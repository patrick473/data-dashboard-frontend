"use client";

import { useRouter, useSearchParams } from "next/navigation";
import FileSelect from "@/app/components/common/FileSelect";
import { Button, Card, Tooltip } from "@heroui/react";

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
        <Card>
            <Card.Header>
                Compare datasets
            </Card.Header>
            <Card.Content>
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
                    <Tooltip delay={0}>
                        <Tooltip.Trigger>
                            <Button
                                onClick={handleSwap}
                                variant="outline"
                            >
                                ⇄
                            </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content showArrow placement="bottom"> <Tooltip.Arrow />Swap datasets</Tooltip.Content>
                    </Tooltip>

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
            </Card.Content>
        </Card>
    );
}
