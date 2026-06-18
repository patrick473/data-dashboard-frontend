import Header from "@/app/components/common/Header";
import ColumnDashboard from "@/app/components/column/ColumnDashboard";
import { getAvailableFiles, getData } from "@/app/api/data-dashboard-api/data/data";
import type { ColumnStats } from "@/app/api/data-dashboard-api/dataDashboardAPI.schemas";

export default async function ColumnPage({
  searchParams,
}: {
  readonly searchParams: Promise<{ file?: string; column?: string }>;
}) {
  const { data: filesData } = await getAvailableFiles();
  const availableFiles = filesData.available_files;
  const { file, column } = await searchParams;
  const selectedFile = file ?? availableFiles[0] ?? "";

  let columns: ColumnStats[] = [];
  let selectedColumn: ColumnStats | undefined;
  let totalRows = 0;

  if (selectedFile) {
    const fileData = await getData(selectedFile);
    if (fileData.status === 200) {
      columns = fileData.data.columns;
      totalRows = fileData.data.total_rows;
      selectedColumn = column ? columns.find((c) => c.name === column) : undefined;
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Header />
      <ColumnDashboard
        availableFiles={availableFiles}
        selectedFile={selectedFile}
        columns={columns}
        selectedColumn={selectedColumn}
        totalRows={totalRows}
      />
    </div>
  );
}
