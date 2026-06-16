import type { AnalysisResult, ColumnStats } from "@/app/api/data-dashboard-api/dataDashboardAPI.schemas";
import { formatNumber } from "@/app/components/utils/formatNumber";
import { Card } from "@heroui/react/card";
import { Table } from "@heroui/react/table";

const DTYPE_BADGE: Record<string, string> = {
    string: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    numeric: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    datetime: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    boolean: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
    categorical: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
};

function Badge({ dtype }: Readonly<{ dtype: string }>) {
    const cls =
        DTYPE_BADGE[dtype] ?? "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
    return (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{dtype}</span>
    );
}

function NumDiffCell({
    a,
    b,
    format = formatNumber,
}: Readonly<{
    a: number | null | undefined;
    b: number | null | undefined;
    format?: (n: number) => string;
}>) {
    const strA = a == null ? "—" : format(a);
    const strB = b == null ? "—" : format(b);
    const changed = a != null && b != null && strA !== strB;
    return (
        <>
            {a != null && <div className="text-zinc-700 dark:text-zinc-300">{strA}</div>}
            {changed && (
                <div className="mt-0.5 font-semibold text-amber-600 dark:text-amber-400">{strB}</div>
            )}
            {a == null && b != null && <div className="text-zinc-500 dark:text-zinc-400">{strB}</div>}
        </>
    );
}

interface Props {
    dataA: AnalysisResult;
    dataB: AnalysisResult;
}

export default function ColumnDiffTable({ dataA, dataB }: Readonly<Props>) {
    const mapA = new Map<string, ColumnStats>(dataA.columns.map((c) => [c.name, c]));
    const mapB = new Map<string, ColumnStats>(dataB.columns.map((c) => [c.name, c]));
    const allColumns = [
        ...new Set([
            ...dataA.columns.map((c) => c.name),
            ...dataB.columns.map((c) => c.name),
        ]),
    ];

    return (
        <Card>
            <Card.Header>

                <Card.Title>Column Comparison</Card.Title>
                <Card.Description className="flex items-center gap-3 text-xs text-zinc-500">    <span className="text-zinc-500 dark:text-zinc-400">A → B, amber = changed</span>
                    <span className="rounded bg-green-100 px-1.5 py-0.5 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        only in A
                    </span>
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        only in B
                    </span></Card.Description>
            </Card.Header>
            <Card.Content>
                <Table>
                    <Table.ScrollContainer>
                        <Table.Content>
                            <Table.Header>
                                <Table.Column isRowHeader>Column</Table.Column>
                                <Table.Column>Type</Table.Column>
                                <Table.Column>Nulls</Table.Column>
                                <Table.Column>Unique</Table.Column>
                                <Table.Column>Fill Rate</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {allColumns.map((name, i) => {
                                    const colA = mapA.get(name);
                                    const colB = mapB.get(name);
                                    const onlyA = colA != null && colB == null;
                                    const onlyB = colA == null && colB != null;
                                    let rowBg = i % 2 === 0 ? "" : "bg-zinc-50/50 dark:bg-zinc-800/20";
                                    if (onlyA) rowBg = "bg-green-50/60 dark:bg-green-900/10";
                                    else if (onlyB) rowBg = "bg-blue-50/60 dark:bg-blue-900/10";

                                    const typeA = colA?.dtype ?? "";
                                    const typeB = colB?.dtype ?? "";
                                    const typeDiff = typeA !== "" && typeB !== "" && typeA !== typeB;

                                    return (
                                        <Table.Row
                                            key={name}
                                            className={`border-b border-zinc-100 dark:border-zinc-800 ${rowBg}`}
                                        >
                                            <Table.Cell className="px-4 py-3 font-mono font-medium text-zinc-800 dark:text-zinc-200">
                                                {name}
                                                {onlyA && (
                                                    <span className="ml-2 text-xs font-sans text-green-600 dark:text-green-400">
                                                        (only A)
                                                    </span>
                                                )}
                                                {onlyB && (
                                                    <span className="ml-2 text-xs font-sans text-blue-600 dark:text-blue-400">
                                                        (only B)
                                                    </span>
                                                )}
                                            </Table.Cell>
                                            <Table.Cell className="px-4 py-3">
                                                {typeA && <div><Badge dtype={typeA} /></div>}
                                                {typeDiff && typeB && (
                                                    <div className="mt-0.5">
                                                        <Badge dtype={typeB} />
                                                    </div>
                                                )}
                                                {!typeA && typeB && <Badge dtype={typeB} />}
                                            </Table.Cell>
                                            <Table.Cell className="px-4 py-3 text-sm text-right tabular-nums">
                                                <NumDiffCell a={colA?.null_count} b={colB?.null_count} />
                                            </Table.Cell>
                                            <Table.Cell className="px-4 py-3 text-sm text-right tabular-nums">
                                                <NumDiffCell a={colA?.unique_count} b={colB?.unique_count} />
                                            </Table.Cell>
                                            <Table.Cell className="px-4 py-3 text-sm text-right tabular-nums">
                                                <NumDiffCell
                                                    a={colA?.fill_rate == null ? undefined : colA.fill_rate * 100}
                                                    b={colB?.fill_rate == null ? undefined : colB.fill_rate * 100}
                                                    format={(n) => n.toFixed(1) + "%"}
                                                />
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>

            </Card.Content>
        </Card>
    );
}
