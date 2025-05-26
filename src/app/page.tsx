"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMonopolyBoard } from "@/context/MonopolyBoardContext";
import { generateProperties } from "@/ai/flows/generate-properties";
import { ThemeForm } from "@/components/monopoly-mapper/ThemeForm";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function MonopolyMapperInputPage() {
  const router = useRouter();
  const { setBoard, isLoading, setIsLoading, error, setError } = useMonopolyBoard();
  const { toast } = useToast();

  const handleThemeSubmit = async (submittedTheme: string) => {
    setIsLoading(true);
    setError(null);
    setBoard(null, submittedTheme); // Set theme in context early for loading message on next page

    try {
      const result = await generateProperties({ theme: submittedTheme });
      if (result && result.properties) {
        setBoard(result, submittedTheme); // Update context with full data
        toast({
          title: "Properties Generated!",
          description: `Successfully generated properties for the theme: ${submittedTheme}. Redirecting...`,
        });
        router.push('/board');
      } else {
        const msg = "Failed to generate properties. The AI returned an unexpected result.";
        setError(msg);
        setBoard(null, submittedTheme); // Keep theme, but no data
        toast({
          title: "Error Generating Properties",
          description: "The AI returned an unexpected result. Please try again.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to generate properties: ${errorMessage}`);
      setBoard(null, submittedTheme); // Keep theme, but no data
      toast({
        title: "Error Generating Properties",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

      <section id="theme-input" className="mb-8 p-6 bg-card rounded-xl shadow-lg max-w-2xl mx-auto">
        <ThemeForm onSubmit={handleThemeSubmit} isLoading={isLoading} />
      </section>

      {error && !isLoading && ( // Show error only if not loading
         <Alert variant="destructive" className="mb-6 max-w-2xl mx-auto">
           <Terminal className="h-4 w-4" />
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
      )}
      
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Monopoly Mapper. Create your dream board.</p>
      </footer>
    </div>
  );
}
