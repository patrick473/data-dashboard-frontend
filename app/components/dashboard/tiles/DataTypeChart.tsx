"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { ColumnMetadata } from "../../../types";
import { Card } from "@heroui/react/card";

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
   <Card>
      <Card.Header>
        Column Data Types
      </Card.Header>
      <Card.Content>
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
              borderRadius: "var(--radius-2xl)",
              fontSize: "12px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--surface)",
            }}
          />
          <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
        </PieChart>
      </ResponsiveContainer>
      </Card.Content>
    </Card>
  );
}
