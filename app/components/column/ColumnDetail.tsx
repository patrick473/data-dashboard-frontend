import type { ColumnStats } from "@/app/api/data-dashboard-api/dataDashboardAPI.schemas";
import { Card } from "@heroui/react";
import { formatNumber } from "@/app/components/utils/formatNumber";
import DistributionHistogram from "./DistributionHistogram";
import CountBarChart from "./CountBarChart";

const DTYPE_BADGE: Record<string, string> = {
  string: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  numeric: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  datetime: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  boolean: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  categorical: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
};

interface StatRowProps {
  label: string;
  value: React.ReactNode;
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-100 py-2 last:border-0 dark:border-zinc-800">
      <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{value}</span>
    </div>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <Card>
      <Card.Header>
        <Card.Title className="text-base">{title}</Card.Title>
      </Card.Header>
      <Card.Content>{children}</Card.Content>
    </Card>
  );
}

interface ColumnDetailProps {
  column: ColumnStats;
  totalRows: number;
}

export default function ColumnDetail({ column, totalRows }: Readonly<ColumnDetailProps>) {
  const badgeClass =
    DTYPE_BADGE[column.dtype] ??
    "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
  const missingPct = totalRows > 0 ? ((column.null_count / totalRows) * 100).toFixed(1) : "0";
  const fillPct = (column.fill_rate * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Column header */}
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-semibold font-mono text-zinc-900 dark:text-zinc-50">
          {column.name}
        </h2>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}>
          {column.dtype}
        </span>
      </div>

      {/* General stats */}
      <Section title="General Statistics">
        <StatRow label="Total rows" value={formatNumber(totalRows)} />
        <StatRow label="Missing values" value={`${formatNumber(column.null_count)} (${missingPct}%)`} />
        <StatRow label="Fill rate" value={`${fillPct}%`} />
        <StatRow label="Unique values" value={formatNumber(column.unique_count)} />
        {column.top_values.length > 0 && (
          <StatRow
            label="Top values"
            value={
              <span className="font-mono text-xs">
                {column.top_values.join(", ")}
              </span>
            }
          />
        )}
      </Section>

      {/* Numeric stats */}
      {column.dtype === "numeric" && (
        <Section title="Numeric Statistics">
          <StatRow label="Min" value={column.min != null ? String(column.min) : "—"} />
          <StatRow label="Max" value={column.max != null ? String(column.max) : "—"} />
          <StatRow label="Mean" value={column.mean != null ? column.mean.toFixed(4) : "—"} />
          <StatRow label="Median" value={column.median != null ? column.median.toFixed(4) : "—"} />
          <StatRow label="Std deviation" value={column.std != null ? column.std.toFixed(4) : "—"} />
          <StatRow label="Q1" value={column.q1 != null ? column.q1.toFixed(4) : "—"} />
          <StatRow label="Q3" value={column.q3 != null ? column.q3.toFixed(4) : "—"} />
          <StatRow label="IQR" value={column.iqr != null ? column.iqr.toFixed(4) : "—"} />
          <StatRow label="Outliers" value={column.outlier_count != null ? formatNumber(column.outlier_count) : "—"} />
          <StatRow label="Negative values" value={column.negative_count != null ? formatNumber(column.negative_count) : "—"} />
          <StatRow label="Zero values" value={column.zero_count != null ? formatNumber(column.zero_count) : "—"} />
          <StatRow label="Skewness" value={column.skewness != null ? column.skewness.toFixed(4) : "—"} />
          <StatRow label="Kurtosis" value={column.kurtosis != null ? column.kurtosis.toFixed(4) : "—"} />
        </Section>
      )}

      {/* Distribution histogram */}
      {column.distribution && column.distribution.length > 0 && (
        <Section title="Distribution">
          <DistributionHistogram distribution={column.distribution} />
        </Section>
      )}

      {/* Frequency chart (string / categorical) */}
      {column.frequency && column.frequency.length > 0 && (
        <Section title="Value Frequency">
          <CountBarChart
            data={column.frequency.map((e) => ({ label: e.value, count: e.count, rate: e.rate }))}
            color="#6366f1"
          />
        </Section>
      )}

      {/* Datetime stats */}
      {column.dtype === "datetime" && column.gap_stats && (
        <Section title="Gap Statistics">
          <StatRow label="Min gap" value={`${column.gap_stats.min_seconds.toFixed(0)}s`} />
          <StatRow label="Max gap" value={`${column.gap_stats.max_seconds.toFixed(0)}s`} />
          <StatRow label="Mean gap" value={`${column.gap_stats.mean_seconds.toFixed(0)}s`} />
          <StatRow label="Median gap" value={`${column.gap_stats.median_seconds.toFixed(0)}s`} />
        </Section>
      )}

      {column.day_of_week && column.day_of_week.length > 0 && (
        <Section title="Distribution by Day of Week">
          <CountBarChart
            data={column.day_of_week.map((e) => ({ label: e.day, count: e.count }))}
            color="#f59e0b"
          />
        </Section>
      )}

      {column.hour_of_day && column.hour_of_day.length > 0 && (
        <Section title="Distribution by Hour of Day">
          <CountBarChart
            data={column.hour_of_day.map((e) => ({ label: `${e.hour}:00`, count: e.count }))}
            color="#0ea5e9"
          />
        </Section>
      )}
    </div>
  );
}
