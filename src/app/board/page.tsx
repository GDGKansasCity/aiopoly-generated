"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMonopolyBoard } from "@/context/MonopolyBoardContext";
import type { GeneratePropertiesOutput } from "@/ai/flows/generate-properties";
import type { EditableBoard, EditablePropertyGroup, EditableProperty } from "@/components/monopoly-mapper/types";
import { BoardDisplay } from "@/components/monopoly-mapper/BoardDisplay";
import { EditControls } from "@/components/monopoly-mapper/EditControls";
import { exportToCSV, exportToJSON } from "@/lib/exportHelpers";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Terminal, ArrowLeft, Home } from "lucide-react";

let groupIdCounter = 0;
let propertyIdCounter = 0;
const generateGroupId = () => `group-${groupIdCounter++}`;
const generatePropertyId = () => `prop-${propertyIdCounter++}`;

export default function MonopolyBoardPage() {
  const router = useRouter();
  const { boardData, theme, setBoard, isLoading: isContextLoading, error: contextError, setError: setContextError } = useMonopolyBoard();
  
  const [editableBoard, setEditableBoard] = React.useState<EditableBoard>([]);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const { toast } = useToast();

  const transformAiOutputToEditableBoard = React.useCallback((aiOutput: GeneratePropertiesOutput | null): EditableBoard => {
    groupIdCounter = 0; 
    propertyIdCounter = 0;

    if (!aiOutput || !aiOutput.properties || aiOutput.properties.length === 0) {
      return [];
    }

    const groupedByOriginalName: Record<string, { color: string; properties: { name: string }[] }> = {};

    aiOutput.properties.forEach(prop => {
      if (!groupedByOriginalName[prop.group]) {
        groupedByOriginalName[prop.group] = {
          color: prop.color || '#CCCCCC', 
          properties: [],
        };
      }
      groupedByOriginalName[prop.group].properties.push({ name: prop.name });
    });
    
    return Object.entries(groupedByOriginalName).map(([groupName, data]) => ({
      id: generateGroupId(),
      name: groupName,
      color: data.color,
      properties: data.properties.map(p => ({
        id: generatePropertyId(),
        name: p.name,
      })),
    }));
  }, []);


  React.useEffect(() => {
    if (!isContextLoading && !boardData && !contextError) {
      toast({ title: "No Board Data", description: "Please generate a board first. Redirecting...", variant: "default" });
      router.replace('/');
      return;
    }
    if (boardData) {
      const newBoard = transformAiOutputToEditableBoard(boardData);
      setEditableBoard(newBoard);
      // Toast for empty but successful generation shown by input page before redirect
      // Or, if AI output processing here leads to empty.
      if (newBoard.length === 0 && !isContextLoading && !contextError) {
          toast({
              title: "Board Processed",
              description: `Generated an empty property list for theme: ${theme}. You can edit the board or start a new theme.`,
              variant: "default",
          });
      }
    }
  }, [boardData, isContextLoading, router, theme, contextError, transformAiOutputToEditableBoard, toast]);

  const handleGoHome = () => {
    setBoard(null, null); 
    setContextError(null);
    router.push('/');
  };

  const handleToggleEdit = () => setIsEditing(!isEditing);

  const handleGroupNameChange = (groupId: string, newName: string) => {
    setEditableBoard(prevBoard =>
      prevBoard.map(group =>
        group.id === groupId ? { ...group, name: newName } : group
      )
    );
  };

  const handleGroupColorChange = (groupId: string, newColor: string) => {
    setEditableBoard(prevBoard =>
      prevBoard.map(group =>
        group.id === groupId ? { ...group, color: newColor } : group
      )
    );
  };

  const handlePropertyNameChange = (groupId: string, propertyId: string, newName: string) => {
    setEditableBoard(prevBoard =>
      prevBoard.map(group =>
        group.id === groupId
          ? {
              ...group,
              properties: group.properties.map(prop =>
                prop.id === propertyId ? { ...prop, name: newName } : prop
              ),
            }
          : group
      )
    );
  };
  
  const handleExportCSV = () => {
    if (editableBoard.length > 0) {
      exportToCSV(editableBoard, theme || "monopoly_board");
      toast({ title: "Exported to CSV", description: "Your Monopoly board has been exported." });
    }
  };

  const handleExportJSON = () => {
    if (editableBoard.length > 0) {
      exportToJSON(editableBoard, theme || "monopoly_board");
      toast({ title: "Exported to JSON", description: "Your Monopoly board has been exported." });
    }
  };

  if (isContextLoading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Generating your Monopoly board for theme: {theme || "selected theme"}...</p>
      </div>
    );
  }
  
  if (contextError && !isContextLoading) {
     return (
       <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <header className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary tracking-tight">Board Error</h1>
            <Button variant="outline" onClick={handleGoHome}>
              <Home className="mr-2 h-4 w-4" />
              New Theme
            </Button>
          </header>
         <Alert variant="destructive" className="mb-6">
           <Terminal className="h-4 w-4" />
           <AlertTitle>Error Generating Board</AlertTitle>
           <AlertDescription>{contextError}</AlertDescription>
         </Alert>
       </div>
     );
  }

  // This handles the case where the page is loaded directly or context is cleared somehow post-load
  if (!boardData && !isContextLoading && !contextError) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center">
         <header className="mb-8 flex justify-center items-center">
            <h1 className="text-3xl font-bold text-primary tracking-tight">No Board Data</h1>
          </header>
        <p className="text-lg text-muted-foreground mb-4">No board data found. Please generate properties first.</p>
        <Button onClick={handleGoHome}>
          <Home className="mr-2 h-4 w-4" />
          Start New Theme
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-primary tracking-tight">Monopoly Board: <span className="text-accent">{theme}</span></h1>
            <p className="text-md text-muted-foreground mt-1">
            View, edit, and export your generated properties.
            </p>
        </div>
        <Button variant="outline" onClick={handleGoHome} size="lg">
          <Home className="mr-2 h-5 w-5" />
          New Theme
        </Button>
      </header>
      
      <Separator className="my-8" />

      <section id="controls" className="mb-8">
        <EditControls
            isEditing={isEditing}
            onToggleEdit={handleToggleEdit}
            onExportCSV={handleExportCSV}
            onExportJSON={handleExportJSON}
            hasData={editableBoard.length > 0}
        />
      </section>
      
      <main id="board-display">
        <BoardDisplay
          board={editableBoard}
          isEditing={isEditing}
          onGroupNameChange={handleGroupNameChange}
          onGroupColorChange={handleGroupColorChange}
          onPropertyNameChange={handlePropertyNameChange}
        />
         {editableBoard.length === 0 && !isContextLoading && (
            <div className="text-center py-10">
                <p className="text-muted-foreground text-lg">The AI generated an empty list of properties for "{theme}".</p>
                <p className="text-sm text-muted-foreground">You can try to edit the board above or start a new theme.</p>
            </div>
        )}
      </main>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Monopoly Mapper. Create your dream board.</p>
      </footer>
    </div>
  );
}
