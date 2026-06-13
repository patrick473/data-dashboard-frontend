"use client";

import { useRouter, useSearchParams } from "next/navigation";
import FileSelect from "@/app/components/common/FileSelect";

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
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">Select file</p>
      <FileSelect
        availableFiles={availableFiles}
        selectedFile={selectedFile}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
}
