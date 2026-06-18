"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@heroui/react/card";
import type { ModelResult } from "@/app/api/data-dashboard-api/dataDashboardAPI.schemas";

const MODEL_COLORS = ["#6366f1", "#f97316", "#10b981", "#f59e0b", "#3b82f6"];

interface MetricBarChartProps {
  models: ModelResult[];
  dataKey: keyof ModelResult;
  label: string;
  color?: string;
  lowerIsBetter?: boolean;
}

function MetricBarChart({ models, dataKey, label, lowerIsBetter = false }: Readonly<MetricBarChartProps>) {
  const data = models.map((m, i) => {
    const val = m[dataKey] as number | undefined;
    return { name: m.model, value: val, fill: MODEL_COLORS[i % MODEL_COLORS.length] };
  }).filter((d): d is { name: string; value: number; fill: string } => d.value !== undefined);

  const best = lowerIsBetter
    ? Math.min(...data.map((d) => d.value))
    : Math.max(...data.map((d) => d.value));
  const coloredData = data.map((d) => ({
    ...d,
    fill: d.value === best ? "#10b981" : d.fill,
  }));

  return (
    <Card>
      <Card.Header>{label}</Card.Header>
      <Card.Content>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={coloredData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#71717a" }}
              interval={0}
            />
            <YAxis tick={{ fontSize: 11, fill: "#71717a" }} />
            <Tooltip
              formatter={(value) => [Number(value).toFixed(4), label]}
              contentStyle={{
                borderRadius: "var(--radius-2xl)",
                fontSize: "12px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
              }}
            />
            <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500 text-right">
          {lowerIsBetter ? "Lower is better" : "Higher is better"} — best highlighted in green
        </p>
      </Card.Content>
    </Card>
  );
}

interface MetricsTableProps {
  models: ModelResult[];
}

const METRICS: { key: keyof ModelResult; label: string; lowerIsBetter: boolean }[] = [
  { key: "mae", label: "MAE", lowerIsBetter: true },
  { key: "rmse", label: "RMSE", lowerIsBetter: true },
  { key: "r2", label: "R²", lowerIsBetter: false },
  { key: "gemiddelde_vertraging", label: "Gem. Vertraging", lowerIsBetter: false },
  { key: "voorspelling", label: "Voorspelling", lowerIsBetter: false },
  { key: "max_depth", label: "Max Depth", lowerIsBetter: false },
  { key: "n_estimators", label: "N Estimators", lowerIsBetter: false },
];

function MetricsTable({ models }: Readonly<MetricsTableProps>) {
  return (
    <Card>
      <Card.Header>Model Comparison</Card.Header>
      <Card.Content>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="py-2 pr-4 text-left font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide text-xs">
                  Metric
                </th>
                {models.map((m) => (
                  <th
                    key={m.model}
                    className="py-2 px-4 text-right font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wide text-xs"
                  >
                    {m.model}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METRICS.map(({ key, label, lowerIsBetter }) => {
                const values = models.map((m) => m[key] as number | undefined);
                const defined = values.filter((v): v is number => v !== undefined);
                if (defined.length === 0) return null;
                const best = lowerIsBetter ? Math.min(...defined) : Math.max(...defined);

                return (
                  <tr
                    key={key}
                    className="border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                  >
                    <td className="py-2.5 pr-4 text-zinc-500 dark:text-zinc-400 font-medium">
                      {label}
                    </td>
                    {models.map((m) => {
                      const val = m[key] as number | undefined;
                      const isBest = val !== undefined && val === best && defined.length > 1;
                      return (
                        <td
                          key={m.model}
                          className={`py-2.5 px-4 text-right tabular-nums ${
                            isBest
                              ? "font-semibold text-emerald-600 dark:text-emerald-400"
                              : "text-zinc-800 dark:text-zinc-200"
                          }`}
                        >
                          {val === undefined ? "—" : val.toFixed(4)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card.Content>
    </Card>
  );
}

interface Props {
  models: ModelResult[];
}

export default function ModelsDashboard({ models }: Readonly<Props>) {
  if (models.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-zinc-500 dark:text-zinc-400">No model results found.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Model Results
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Comparing {models.length} trained model{models.length === 1 ? "" : "s"}
        </p>
      </div>

      <MetricsTable models={models} />

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <MetricBarChart models={models} dataKey="mae" label="MAE" lowerIsBetter />
        <MetricBarChart models={models} dataKey="rmse" label="RMSE" lowerIsBetter />
        <MetricBarChart models={models} dataKey="r2" label="R²" />
      </section>
    </main>
  );
}
