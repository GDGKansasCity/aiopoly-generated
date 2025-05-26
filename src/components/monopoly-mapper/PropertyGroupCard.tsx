"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PropertyItem } from "./PropertyItem";
import type { EditablePropertyGroup, EditableProperty } from "./types";
import { GripVertical, Palette } from "lucide-react";

interface PropertyGroupCardProps {
  group: EditablePropertyGroup;
  isEditing: boolean;
  onGroupNameChange: (groupId: string, newName: string) => void;
  onGroupColorChange: (groupId: string, newColor: string) => void;
  onPropertyNameChange: (groupId: string, propertyId: string, newName: string) => void;
}

export function PropertyGroupCard({
  group,
  isEditing,
  onGroupNameChange,
  onGroupColorChange,
  onPropertyNameChange,
}: PropertyGroupCardProps) {
  const [groupName, setGroupName] = React.useState(group.name);
  const [groupColor, setGroupColor] = React.useState(group.color);

  React.useEffect(() => {
    setGroupName(group.name);
  }, [group.name]);

  React.useEffect(() => {
    setGroupColor(group.color);
  }, [group.color]);

  const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  };

  const handleGroupNameBlur = () => {
    if (groupName !== group.name) {
      onGroupNameChange(group.id, groupName);
    }
  };

  const handleGroupColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupColor(e.target.value);
  };
  
  const handleGroupColorBlur = () => {
    // Basic validation for hex color
    const isValidColor = /^#([0-9A-F]{3}){1,2}$/i.test(groupColor) || /^[a-zA-Z]+$/i.test(groupColor) || /^rgba?\(.+\)$/i.test(groupColor) || /^hsla?\(.+\)$/i.test(groupColor);
    if (groupColor !== group.color && isValidColor) {
      onGroupColorChange(group.id, groupColor);
    } else if (!isValidColor && groupColor !== group.color) {
      // Reset to original if invalid and changed
      setGroupColor(group.color); 
      // Optionally, show a toast message for invalid color
    }
  };


  const colorSwatchStyle: React.CSSProperties = {
    backgroundColor: group.color,
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    border: '1px solid hsl(var(--border))',
    display: 'inline-block',
    verticalAlign: 'middle',
    marginRight: '8px',
  };

  return (
    <Card className="mb-6 shadow-lg_ hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-3" style={{ borderBottom: `3px solid ${group.color}` }}>
        <div className="flex items-center justify-between">
          {isEditing ? (
            <Input
              type="text"
              value={groupName}
              onChange={handleGroupNameChange}
              onBlur={handleGroupNameBlur}
              className="text-xl font-semibold p-1 border-input focus:border-primary flex-grow"
              aria-label={`Edit group name ${group.name}`}
            />
          ) : (
            <CardTitle className="text-xl font-semibold text-primary flex items-center">
               <span style={colorSwatchStyle} title={`Group color: ${group.color}`}></span>
              {group.name}
            </CardTitle>
          )}
           {isEditing && (
             <div className="flex items-center ml-4">
               <Palette size={20} className="text-muted-foreground mr-1" />
                <Input
                  type="text" // Could be type="color" but text gives more flexibility for CSS colors
                  value={groupColor}
                  onChange={handleGroupColorChange}
                  onBlur={handleGroupColorBlur}
                  className="w-28 p-1 border-input focus:border-primary text-sm"
                  placeholder="e.g., #FF0000 or blue"
                  aria-label={`Edit group color ${group.color}`}
                />
             </div>
            )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {group.properties.map((property) => (
          <PropertyItem
            key={property.id}
            property={property}
            isEditing={isEditing}
            onNameChange={(propId, newName) => onPropertyNameChange(group.id, propId, newName)}
            groupColor={group.color}
          />
        ))}
        {group.properties.length === 0 && (
          <p className="text-sm text-muted-foreground">No properties in this group.</p>
        )}
      </CardContent>
    </Card>
  );
}
