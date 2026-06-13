"use client";

import { ListBox, Select } from "@heroui/react";

interface FileSelectProps {
  readonly availableFiles: string[];
  readonly selectedFile: string;
  readonly onSelectionChange: (value: string) => void;
}

export default function FileSelect({
  availableFiles,
  selectedFile,
  onSelectionChange,
}: FileSelectProps) {
  return (
    <Select
      aria-label="Select a file"
      value={selectedFile}
      onChange={(key) => onSelectionChange(key as string)}
    >
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>

      <Select.Popover>
        <ListBox>
          {availableFiles.map((file) => (
            <ListBox.Item key={file} id={file} textValue={file}>
              {file}
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
