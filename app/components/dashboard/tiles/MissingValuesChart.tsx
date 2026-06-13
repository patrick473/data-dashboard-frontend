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
import type { ColumnMetadata } from "../../../types";

interface Props {
  columns: ColumnMetadata[];
  rowCount: number;
}

export default function MissingValuesChart({ columns, rowCount }: Readonly<Props>) {
  const data = columns
    .map((col) => ({
      name: col.name,
      missing: col.null_count,
      pct: Number.parseFloat(((col.null_count / rowCount) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.missing - a.missing);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        Missing Values per Column
      </h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 48 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#71717a" }}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis tick={{ fontSize: 11, fill: "#71717a" }} />
          <Tooltip
            formatter={(value, _name, props) => [
              `${Number(value).toLocaleString()} (${(props as { payload: { pct: number } }).payload.pct}%)`,
              "Missing",
            ]}
            contentStyle={{
              borderRadius: "8px",
              fontSize: "12px",
              border: "1px solid #e4e4e7",
            }}
          />
          <Bar dataKey="missing" fill="#f97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
