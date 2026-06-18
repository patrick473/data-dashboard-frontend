"use client";

import { useRouter, useSearchParams } from "next/navigation";
import FileSelect from "@/app/components/common/FileSelect";
import { Card } from "@heroui/react";
import { ListBox, Select } from "@heroui/react";
import type { ColumnStats } from "@/app/api/data-dashboard-api/dataDashboardAPI.schemas";

interface ColumnSelectCardProps {
  readonly availableFiles: string[];
  readonly selectedFile: string;
  readonly columns: ColumnStats[];
  readonly selectedColumnName?: string;
}

export default function ColumnSelectCard({
  availableFiles,
  selectedFile,
  columns,
  selectedColumnName,
}: ColumnSelectCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleFileChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("file", value);
    params.delete("column");
    router.push(`?${params.toString()}`);
  }

  function handleColumnChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("column", value);
    router.push(`?${params.toString()}`);
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Select Dataset &amp; Column</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Dataset
            </label>
            <FileSelect
              availableFiles={availableFiles}
              selectedFile={selectedFile}
              onSelectionChange={handleFileChange}
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Column
            </label>
            <Select
              aria-label="Select a column"
              value={selectedColumnName ?? ""}
              onChange={(key) => handleColumnChange(key as string)}
              isDisabled={columns.length === 0}
            >
              <Select.Trigger>
                <Select.Value placeholder="Select a column…" />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {columns.map((col) => (
                    <ListBox.Item key={col.name} id={col.name} textValue={col.name}>
                      <span className="font-mono text-sm">{col.name}</span>
                      <span className="ml-2 text-xs text-zinc-400">{col.dtype}</span>
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
