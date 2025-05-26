export interface EditableProperty {
  id: string;
  name: string;
}

export interface EditablePropertyGroup {
  id:string;
  name: string; // Editable group name
  color: string; // Editable color, should be a valid CSS color string
  properties: EditableProperty[];
}

export type EditableBoard = EditablePropertyGroup[];
