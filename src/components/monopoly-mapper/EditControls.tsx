"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Download, Edit3, FileJson, FileText } from "lucide-react";

interface EditControlsProps {
  isEditing: boolean;
  onToggleEdit: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  hasData: boolean;
}

export function EditControls({
  isEditing,
  onToggleEdit,
  onExportCSV,
  onExportJSON,
  hasData,
}: EditControlsProps) {
  return (
    <Card className="mt-6 mb-8 p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="edit-mode"
            checked={isEditing}
            onCheckedChange={onToggleEdit}
            disabled={!hasData}
            aria-label="Toggle edit mode"
          />
          <Label htmlFor="edit-mode" className="text-sm font-medium flex items-center">
            <Edit3 className="mr-2 h-4 w-4" />
            Edit Mode
          </Label>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onExportCSV}
            disabled={!hasData}
            aria-label="Export as CSV"
            className="text-sm"
          >
            <FileText className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={onExportJSON}
            disabled={!hasData}
            aria-label="Export as JSON"
            className="text-sm"
          >
            <FileJson className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Minimal Card component if not already globally available or to avoid circular deps
// For this case, assuming Card from ui/card is fine. If issues, define a local one.
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className || ''}`}
    {...props}
  />
));
Card.displayName = "Card";
