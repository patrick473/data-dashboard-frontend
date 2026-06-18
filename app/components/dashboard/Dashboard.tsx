import StatCard from "./tiles/StatCard";
import MissingValuesChart from "./tiles/MissingValuesChart";
import UniqueValuesChart from "./tiles/UniqueValuesChart";
import DataTypeChart from "./tiles/DataTypeChart";
import ColumnStatsTable from "./tiles/ColumnStatsTable";
import FileSelectCard from "./FileSelectCard";
import { getData } from "@/app/api/data-dashboard-api/data/data";
import type { ColumnMetadata } from "@/app/types";
import { formatNumber } from "@/app/components/utils/formatNumber";

function formatBytes(bytes: number): string {
  if (bytes >= 1_073_741_824) return (bytes / 1_073_741_824).toFixed(1) + " GB";
  if (bytes >= 1_048_576) return (bytes / 1_048_576).toFixed(1) + " MB";
  return (bytes / 1024).toFixed(1) + " KB";
}

export default async function Dashboard({ fileName, availableFiles }: Readonly<{ fileName: string; availableFiles: string[] }>) {
  const fileData = await getData(fileName);

  if (fileData.status !== 200) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-red-500">Failed to load data for &quot;{fileName}&quot;.</p>
      </main>
    );
  }

  const data = fileData.data;
  const totalMissing = data.columns.reduce((sum, col) => sum + col.null_count, 0);
  const totalCells = data.total_rows * data.columns.length;
  const completeness = totalCells > 0
    ? ((totalCells - totalMissing) / totalCells * 100).toFixed(1)
    : "0";

  return (
    <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
      {/* File selector */}
      <FileSelectCard availableFiles={availableFiles} />

      {/* Summary stat cards */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Rows" value={formatNumber(data.total_rows)} />
        <StatCard label="Columns" value={formatNumber(data.columns.length)} />
        <StatCard label="File Size" value={formatBytes(data.file.size_bytes)} />
        <StatCard
          label="Completeness"
          value={`${completeness}%`}
          sub={`${formatNumber(totalMissing)} missing cells total`}
        />
      </section>

      {/* Charts row */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <DataTypeChart columns={data.columns as ColumnMetadata[]} />
        </div>
        <div className="lg:col-span-2">
          <MissingValuesChart columns={data.columns as ColumnMetadata[]} rowCount={data.total_rows} />
        </div>
      </section>

      <UniqueValuesChart columns={data.columns as ColumnMetadata[]} />

      {/* Column stats table */}
      <ColumnStatsTable columns={data.columns as ColumnMetadata[]} rowCount={data.total_rows} fileName={fileName} />
    </main>
  );
}
