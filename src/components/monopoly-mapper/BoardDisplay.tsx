"use client";

import * as React from "react";
import { PropertyGroupCard } from "./PropertyGroupCard";
import type { EditableBoard } from "./types";
import { LayoutGrid } from "lucide-react";

interface BoardDisplayProps {
  board: EditableBoard;
  isEditing: boolean;
  onGroupNameChange: (groupId: string, newName: string) => void;
  onGroupColorChange: (groupId: string, newColor: string) => void;
  onPropertyNameChange: (groupId: string, propertyId: string, newName: string) => void;
}

export function BoardDisplay({
  board,
  isEditing,
  onGroupNameChange,
  onGroupColorChange,
  onPropertyNameChange,
}: BoardDisplayProps) {
  if (board.length === 0) {
    return (
      <div className="text-center py-10">
        <LayoutGrid className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-lg">No properties generated yet.</p>
        <p className="text-sm text-muted-foreground">Enter a theme above and click "Generate Properties".</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {board.map((group) => (
        <PropertyGroupCard
          key={group.id}
          group={group}
          isEditing={isEditing}
          onGroupNameChange={onGroupNameChange}
          onGroupColorChange={onGroupColorChange}
          onPropertyNameChange={onPropertyNameChange}
        />
      ))}
    </div>
  );
}
