import type { EditableBoard, EditablePropertyGroup, EditableProperty } from '@/components/monopoly-mapper/types';

export function exportToCSV(board: EditableBoard, themeName: string): void {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Group Name,Property Name,Group Color\r\n"; // CSV Header

  board.forEach(group => {
    group.properties.forEach(property => {
      const row = [
        `"${group.name.replace(/"/g, '""')}"`, // Escape double quotes
        `"${property.name.replace(/"/g, '""')}"`,
        `"${group.color.replace(/"/g, '""')}"`
      ].join(",");
      csvContent += row + "\r\n";
    });
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${themeName.replace(/\s+/g, '_')}_monopoly_board.csv`);
  document.body.appendChild(link); // Required for Firefox
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(board: EditableBoard, themeName: string): void {
  const jsonContent = JSON.stringify(board, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = `${themeName.replace(/\s+/g, '_')}_monopoly_board.json`;
  document.body.appendChild(link); // Required for Firefox
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
}
