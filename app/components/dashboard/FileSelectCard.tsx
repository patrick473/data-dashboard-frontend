"use client";

import { useRouter, useSearchParams } from "next/navigation";
import FileSelect from "@/app/components/common/FileSelect";
import { Card } from "@heroui/react";

interface FileSelectCardProps {
  readonly availableFiles: string[];
}

export default function FileSelectCard({ availableFiles }: FileSelectCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedFile = searchParams.get("file") ?? availableFiles[0] ?? "";

  function handleSelectionChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("file", value);
    router.push(`?${params.toString()}`);
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Select Dataset</Card.Title>
      </Card.Header>
      <Card.Content>
      <FileSelect
        availableFiles={availableFiles}
        selectedFile={selectedFile}
        onSelectionChange={handleSelectionChange}
      />
      </Card.Content>
    </Card>
  );
}
