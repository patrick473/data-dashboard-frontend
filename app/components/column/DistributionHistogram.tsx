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
import type { DistributionBucket } from "@/app/api/data-dashboard-api/dataDashboardAPI.schemas";
import { formatNumber } from "@/app/components/utils/formatNumber";

interface Props {
  distribution: DistributionBucket[];
}

export default function DistributionHistogram({ distribution }: Readonly<Props>) {
  const data = distribution.map((bucket) => ({
    label: `${bucket.min}`,
    range: `${bucket.min} – ${bucket.max}`,
    count: bucket.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 48 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#71717a" }}
          angle={-35}
          textAnchor="end"
          interval={0}
        />
        <YAxis tick={{ fontSize: 11, fill: "#71717a" }} tickFormatter={formatNumber} />
        <Tooltip
          formatter={(value) => [formatNumber(Number(value)), "Count"]}
          labelFormatter={(label, payload) =>
            payload?.[0]?.payload?.range ?? label
          }
          contentStyle={{
            borderRadius: "8px",
            fontSize: "12px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--surface)",
          }}
        />
        <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
