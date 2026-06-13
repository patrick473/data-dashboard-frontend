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
import { Card } from "@heroui/react/card";
import { formatNumber } from "@/app/components/utils/formatNumber";

interface Props {
  columns: ColumnMetadata[];
}

export default function UniqueValuesChart({ columns }: Readonly<Props>) {
  const data = columns
    .map((col) => ({
      name: col.name,
      unique: col.unique_count,
    }))
    .sort((a, b) => b.unique - a.unique);

  return (
    <Card>
      <Card.Header>
        Unique Values per Column
      </Card.Header>
      <Card.Content>
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
            formatter={(value) => [formatNumber(Number(value)), "Unique"]}
                       contentStyle={{
              borderRadius: "var(--radius-2xl)",
              fontSize: "12px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--surface)",
            }}
          />
          <Bar dataKey="unique" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      </Card.Content>
    </Card>
  );
}
