"use client";

import Link from "next/link";
import { formatNumber } from "@/app/components/utils/formatNumber";
import type { ColumnMetadata } from "../../../types";
import { Card } from "@heroui/react/card";
import { Table } from "@heroui/react/table";
import { Chip } from "@heroui/react";

const DTYPE_BADGE: Record<string, string> = {
    string: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    numeric: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    datetime: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    boolean: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
    categorical: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
};

interface Props {
    columns: ColumnMetadata[];
    rowCount: number;
    fileName: string;
}

export default function ColumnStatsTable({ columns, rowCount, fileName }: Readonly<Props>) {
    return (
        <Card>
            <Card.Header>
                Column Statistics
            </Card.Header>
            <Card.Content>
                <Table>
                    <Table.ScrollContainer>
                        <Table.Content>
                        <Table.Header>
                            <Table.Column isRowHeader>Column</Table.Column>
                            <Table.Column>Type</Table.Column>
                            <Table.Column>Missing</Table.Column>
                            <Table.Column>Unique</Table.Column>
                            <Table.Column>Min</Table.Column>
                            <Table.Column>Max</Table.Column>
                            <Table.Column>Mean</Table.Column>
                            <Table.Column>Std</Table.Column>
                            <Table.Column>Top Values</Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {columns.map((col, i) => {
                                const missingPct = ((col.null_count / rowCount) * 100).toFixed(1);
                                const badgeClass =
                                    DTYPE_BADGE[col.dtype] ??
                                    "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
                                return (
                                    <Table.Row key={col.name}>
                                        <Table.Cell>
                                            <Link
                                                href={`/column?file=${encodeURIComponent(fileName)}&column=${encodeURIComponent(col.name)}`}
                                                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                                {col.name}
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Chip className={badgeClass} size="sm">
                                                {col.dtype}
                                            </Chip>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {col.null_count === 0 ? (
                                                <span className="text-green-600 dark:text-green-400">0</span>
                                            ) : (
                                                <>
                                                    {formatNumber(col.null_count)}{" "}
                                                    ({missingPct}%)
                                                </>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>{formatNumber(col.unique_count)}</Table.Cell>
                                        <Table.Cell>{col.min == null ? "—" : String(col.min)}</Table.Cell>
                                        <Table.Cell>{col.max == null ? "—" : String(col.max)}</Table.Cell>
                                        <Table.Cell>{col.mean == null ? "—" : col.mean.toFixed(1)}</Table.Cell>
                                        <Table.Cell>{col.std == null ? "—" : col.std.toFixed(1)}</Table.Cell>
                                        <Table.Cell>    {col.top_values ? (
                                            <span className="font-mono text-xs">
                                                {col.top_values.slice(0, 3).join(", ")}
                                                {col.top_values.length > 3 && (
                                                    <span className="text-zinc-400"> +{col.top_values.length - 3}</span>
                                                )}
                                            </span>
                                        ) : (
                                            "—"
                                        )}</Table.Cell>
                                    </Table.Row>
                                )
                            })}
                            </Table.Body>
</Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </Card.Content>
        </Card>
    );
}
