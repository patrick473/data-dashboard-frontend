"use client";

import { useRouter, useSearchParams } from "next/navigation";
import FileSelect from "@/app/components/common/FileSelect";

interface Props {
  readonly availableFiles: string[];
  readonly fileA: string;
  readonly fileB: string;
}

export default function CompareFileSelectCard({ availableFiles, fileA, fileB }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChangeA(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("fileA", value);
    router.push(`?${params.toString()}`);
  }

  function handleChangeB(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("fileB", value);
    router.push(`?${params.toString()}`);
  }

  function handleSwap() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("fileA", fileB);
    params.set("fileB", fileA);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">Compare datasets</p>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <p className="mb-1.5 text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
            Dataset A
          </p>
          <FileSelect
            availableFiles={availableFiles}
            selectedFile={fileA}
            onSelectionChange={handleChangeA}
          />
        </div>
        <button
          onClick={handleSwap}
          title="Swap A and B"
          className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
        >
          ⇄
        </button>
        <div className="flex-1">
          <p className="mb-1.5 text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
            Dataset B
          </p>
          <FileSelect
            availableFiles={availableFiles}
            selectedFile={fileB}
            onSelectionChange={handleChangeB}
          />
        </div>
      </div>
    </div>
  );
}
