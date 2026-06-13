import type React from "react";
import type { AnalysisResult } from "@/app/api/data-dashboard-api/dataDashboardAPI.schemas";
import { formatNumber } from "@/app/components/utils/formatNumber";

function formatBytes(bytes: number): string {
  if (bytes >= 1_073_741_824) return (bytes / 1_073_741_824).toFixed(1) + " GB";
  if (bytes >= 1_048_576) return (bytes / 1_048_576).toFixed(1) + " MB";
  return (bytes / 1024).toFixed(1) + " KB";
}

interface MetricRowProps {
  label: string;
  valueA: string;
  valueB: string;
  changed: boolean;
  numericA?: number;
  numericB?: number;
}

function MetricRow({ label, valueA, valueB, changed, numericA, numericB }: Readonly<MetricRowProps>) {
  let deltaBadge: React.ReactNode = null;
  if (numericA !== undefined && numericB !== undefined && numericA !== 0) {
    const pct = ((numericB - numericA) / Math.abs(numericA)) * 100;
    if (Math.abs(pct) >= 0.05) {
      const positive = pct > 0;
      const label = (positive ? "+" : "") + pct.toFixed(1) + "%";
      deltaBadge = (
        <span
          className={`ml-1.5 inline-block rounded px-1 py-0.5 text-xs font-semibold tabular-nums ${
            positive
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
              : "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
          }`}
        >
          {label}
        </span>
      );
    }
  }

  return (
    <div
      className={`grid grid-cols-3 gap-4 px-4 py-3 text-sm border-b border-zinc-100 dark:border-zinc-800 last:border-0 ${
        changed ? "bg-amber-50/50 dark:bg-amber-900/10" : ""
      }`}
    >
      <span className="text-zinc-500 dark:text-zinc-400 font-medium">{label}</span>
      <span className="text-right tabular-nums text-zinc-800 dark:text-zinc-200">{valueA}</span>
      <span
        className={`text-right tabular-nums ${
          changed
            ? "font-semibold text-amber-600 dark:text-amber-400"
            : "text-zinc-800 dark:text-zinc-200"
        }`}
      >
        {valueB}
        {deltaBadge}
      </span>
    </div>
  );
}

interface Props {
  dataA: AnalysisResult;
  dataB: AnalysisResult;
}

export default function CompareStatCards({ dataA, dataB }: Readonly<Props>) {
  const completenessA = (dataA.overall_fill_rate * 100).toFixed(1) + "%";
  const completenessB = (dataB.overall_fill_rate * 100).toFixed(1) + "%";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="grid grid-cols-3 gap-4 px-4 py-3 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 rounded-t-xl">
        <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
          Metric
        </span>
        <span className="text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wide">
          Dataset A
        </span>
        <span className="text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wide">
          Dataset B
        </span>
      </div>
      <MetricRow
        label="File"
        valueA={dataA.file.name}
        valueB={dataB.file.name}
        changed={dataA.file.name !== dataB.file.name}
      />
      <MetricRow
        label="Rows"
        valueA={formatNumber(dataA.total_rows)}
        valueB={formatNumber(dataB.total_rows)}
        changed={dataA.total_rows !== dataB.total_rows}
        numericA={dataA.total_rows}
        numericB={dataB.total_rows}
      />
      <MetricRow
        label="Columns"
        valueA={formatNumber(dataA.total_columns)}
        valueB={formatNumber(dataB.total_columns)}
        changed={dataA.total_columns !== dataB.total_columns}
        numericA={dataA.total_columns}
        numericB={dataB.total_columns}
      />
      <MetricRow
        label="File Size"
        valueA={formatBytes(dataA.file.size_bytes)}
        valueB={formatBytes(dataB.file.size_bytes)}
        changed={dataA.file.size_bytes !== dataB.file.size_bytes}
        numericA={dataA.file.size_bytes}
        numericB={dataB.file.size_bytes}
      />
      <MetricRow
        label="Completeness"
        valueA={completenessA}
        valueB={completenessB}
        changed={dataA.overall_fill_rate !== dataB.overall_fill_rate}
        numericA={dataA.overall_fill_rate}
        numericB={dataB.overall_fill_rate}
      />
      <MetricRow
        label="Total Nulls"
        valueA={formatNumber(dataA.total_nulls)}
        valueB={formatNumber(dataB.total_nulls)}
        changed={dataA.total_nulls !== dataB.total_nulls}
        numericA={dataA.total_nulls}
        numericB={dataB.total_nulls}
      />
      <MetricRow
        label="Complete Columns"
        valueA={formatNumber(dataA.fully_complete_columns)}
        valueB={formatNumber(dataB.fully_complete_columns)}
        changed={dataA.fully_complete_columns !== dataB.fully_complete_columns}
        numericA={dataA.fully_complete_columns}
        numericB={dataB.fully_complete_columns}
      />
      <MetricRow
        label="Rows with Nulls"
        valueA={formatNumber(dataA.rows_with_any_null)}
        valueB={formatNumber(dataB.rows_with_any_null)}
        changed={dataA.rows_with_any_null !== dataB.rows_with_any_null}
        numericA={dataA.rows_with_any_null}
        numericB={dataB.rows_with_any_null}
      />
    </div>
  );
}
