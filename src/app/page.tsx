"use client";

import * as React from "react";
import { generateProperties, type GeneratePropertiesOutput } from "@/ai/flows/generate-properties";
import type { EditableBoard, EditablePropertyGroup, EditableProperty } from "@/components/monopoly-mapper/types";
import { ThemeForm } from "@/components/monopoly-mapper/ThemeForm";
import { BoardDisplay } from "@/components/monopoly-mapper/BoardDisplay";
import { EditControls } from "@/components/monopoly-mapper/EditControls";
import { exportToCSV, exportToJSON } from "@/lib/exportHelpers";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

// Helper to generate unique IDs for client-side state
let groupIdCounter = 0;
let propertyIdCounter = 0;
const generateGroupId = () => `group-${groupIdCounter++}`;
const generatePropertyId = () => `prop-${propertyIdCounter++}`;

export default function MonopolyMapperPage() {
  const [theme, setTheme] = React.useState<string>("");
  const [editableBoard, setEditableBoard] = React.useState<EditableBoard>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  const transformAiOutputToEditableBoard = (aiOutput: GeneratePropertiesOutput): EditableBoard => {
    groupIdCounter = 0; // Reset counters for new generation
    propertyIdCounter = 0;

    if (!aiOutput || !aiOutput.properties || aiOutput.properties.length === 0) {
      return [];
    }

    const groupedByOriginalName: Record<string, { color: string; properties: { name: string }[] }> = {};

    aiOutput.properties.forEach(prop => {
      if (!groupedByOriginalName[prop.group]) {
        groupedByOriginalName[prop.group] = {
          color: prop.color || '#CCCCCC', // Default color if AI doesn't provide one
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
  };

  const handleThemeSubmit = async (submittedTheme: string) => {
    setIsLoading(true);
    setError(null);
    setTheme(submittedTheme);
    try {
      const result = await generateProperties({ theme: submittedTheme });
      if (result && result.properties) {
        const newBoard = transformAiOutputToEditableBoard(result);
        setEditableBoard(newBoard);
        if (newBoard.length === 0) {
            toast({
                title: "Properties Generated",
                description: "AI generated an empty list of properties. Try a different theme or be more specific.",
                variant: "default",
            });
        } else {
            toast({
                title: "Properties Generated!",
                description: `Successfully generated properties for the theme: ${submittedTheme}.`,
            });
        }
      } else {
        setError("Failed to generate properties. The AI returned an unexpected result.");
        toast({
          title: "Error Generating Properties",
          description: "The AI returned an unexpected result. Please try again.",
          variant: "destructive",
        });
        setEditableBoard([]);
      }
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to generate properties: ${errorMessage}`);
      toast({
        title: "Error Generating Properties",
        description: errorMessage,
        variant: "destructive",
      });
      setEditableBoard([]);
    } finally {
      setIsLoading(false);
    }
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


  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary tracking-tight">Monopoly Mapper</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Generate and customize Monopoly board properties for any theme!
        </p>
      </header>

      <section id="theme-input" className="mb-8 p-6 bg-card rounded-xl shadow-lg">
        <ThemeForm onSubmit={handleThemeSubmit} isLoading={isLoading} />
      </section>

      {error && (
         <Alert variant="destructive" className="mb-6">
           <Terminal className="h-4 w-4" />
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
      )}
      
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
      </main>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Monopoly Mapper. Create your dream board.</p>
      </footer>
    </div>
  );
}
