"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import type { EditableProperty } from "./types";

interface PropertyItemProps {
  property: EditableProperty;
  isEditing: boolean;
  onNameChange: (id: string, newName: string) => void;
  groupColor: string; // To style the item slightly, perhaps a left border
}

export function PropertyItem({ property, isEditing, onNameChange, groupColor }: PropertyItemProps) {
  const [name, setName] = React.useState(property.name);

  React.useEffect(() => {
    setName(property.name);
  }, [property.name]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleNameBlur = () => {
    if (name !== property.name) {
      onNameChange(property.id, name);
    }
  };
  
  const borderStyle = { borderLeft: `4px solid ${groupColor}` };

  return (
    <div className="py-2 px-3 my-1 rounded-md bg-background" style={borderStyle}>
      {isEditing ? (
        <Input
          type="text"
          value={name}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          className="w-full text-sm p-1 border-input focus:border-primary"
          aria-label={`Edit property name ${property.name}`}
        />
      ) : (
        <p className="text-sm text-foreground">{property.name}</p>
      )}
    </div>
  );
}
