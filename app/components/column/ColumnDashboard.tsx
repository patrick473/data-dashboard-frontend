import ColumnSelectCard from "./ColumnSelectCard";
import ColumnDetail from "./ColumnDetail";
import type { ColumnStats } from "@/app/api/data-dashboard-api/dataDashboardAPI.schemas";

interface ColumnDashboardProps {
  availableFiles: string[];
  selectedFile: string;
  columns: ColumnStats[];
  selectedColumn: ColumnStats | undefined;
  totalRows: number;
}

export default function ColumnDashboard({
  availableFiles,
  selectedFile,
  columns,
  selectedColumn,
  totalRows,
}: Readonly<ColumnDashboardProps>) {
  return (
    <main className="mx-auto max-w-4xl px-6 py-8 space-y-8">
      <ColumnSelectCard
        availableFiles={availableFiles}
        selectedFile={selectedFile}
        columns={columns}
        selectedColumnName={selectedColumn?.name}
      />

      {selectedColumn ? (
        <ColumnDetail column={selectedColumn} totalRows={totalRows} />
      ) : (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Select a column above to view its detailed statistics.
        </p>
      )}
    </main>
  );
}
