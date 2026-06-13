import type { CsvMetadata } from "./types";
import StatCard from "./components/StatCard";
import MissingValuesChart from "./components/MissingValuesChart";
import UniqueValuesChart from "./components/UniqueValuesChart";
import DataTypeChart from "./components/DataTypeChart";
import ColumnStatsTable from "./components/ColumnStatsTable";

async function getCsvMetadata(): Promise<CsvMetadata> {
  const res = await fetch("http://localhost:3000/api/csv-metadata", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch CSV metadata");
  return res.json();
}

function formatBytes(bytes: number): string {
  if (bytes >= 1_073_741_824) return (bytes / 1_073_741_824).toFixed(1) + " GB";
  if (bytes >= 1_048_576) return (bytes / 1_048_576).toFixed(1) + " MB";
  return (bytes / 1024).toFixed(1) + " KB";
}

export default async function Home() {
  const data = await getCsvMetadata();
  const totalMissing = data.columns.reduce((s, c) => s + c.null_count, 0);
  const totalCells = data.file.row_count * data.file.column_count;
  const completeness = (((totalCells - totalMissing) / totalCells) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            CSV Metadata Dashboard
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            {data.file.name}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Summary stat cards */}
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Rows"
            value={data.file.row_count.toLocaleString()}
          />
          <StatCard
            label="Columns"
            value={data.file.column_count}
          />
          <StatCard
            label="File Size"
            value={formatBytes(data.file.size_bytes)}
          />
          <StatCard
            label="Completeness"
            value={`${completeness}%`}
            sub={`${totalMissing.toLocaleString()} missing cells total`}
          />
        </section>

        {/* Charts row */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <DataTypeChart columns={data.columns} />
          </div>
          <div className="lg:col-span-2">
            <MissingValuesChart columns={data.columns} rowCount={data.file.row_count} />
          </div>
        </section>

        <UniqueValuesChart columns={data.columns} />

        {/* Column stats table */}
        <ColumnStatsTable columns={data.columns} rowCount={data.file.row_count} />
      </main>
    </div>
  );
}
