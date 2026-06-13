"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { ColumnMetadata } from "../../../types";

const DTYPE_COLORS: Record<string, string> = {
  string: "#6366f1",
  numeric: "#22c55e",
  datetime: "#f59e0b",
  boolean: "#ec4899",
  categorical: "#14b8a6",
};

interface Props {
  columns: ColumnMetadata[];
}

export default function DataTypeChart({ columns }: Readonly<Props>) {
  const counts: Record<string, number> = {};
  for (const col of columns) {
    counts[col.dtype] = (counts[col.dtype] ?? 0) + 1;
  }

  const data = Object.entries(counts).map(([dtype, count]) => ({
    name: dtype,
    value: count,
    fill: DTYPE_COLORS[dtype] ?? "#a1a1aa",
  }));

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        Column Data Types
      </h2>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={50}
            paddingAngle={3}
            label={({ name, percent }) =>
              `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
            }
            labelLine={false}
          />
          <Tooltip
            formatter={(value, name) => [value, name]}
            contentStyle={{
              borderRadius: "8px",
              fontSize: "12px",
              border: "1px solid #e4e4e7",
            }}
          />
          <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
