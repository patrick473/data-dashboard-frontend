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
import { formatNumber } from "@/app/components/utils/formatNumber";

interface DataItem {
  label: string;
  count: number;
  rate?: number;
}

interface Props {
  data: DataItem[];
  color?: string;
}

const BAR_HEIGHT = 28;
const MIN_HEIGHT = 120;

export default function CountBarChart({ data, color = "#6366f1" }: Readonly<Props>) {
  const height = Math.max(MIN_HEIGHT, data.length * BAR_HEIGHT + 60);
  const maxLabelLen = Math.max(...data.map((d) => String(d.label).length));
  const leftMargin = Math.min(maxLabelLen * 7, 180);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 4, right: 40, left: leftMargin, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: "#71717a" }}
          tickFormatter={formatNumber}
        />
        <YAxis
          type="category"
          dataKey="label"
          tick={{ fontSize: 12, fill: "#3f3f46" }}
          width={leftMargin}
        />
        <Tooltip
          formatter={(value, _name, props) => {
            const rate = props?.payload?.rate;
            const countStr = formatNumber(Number(value));
            return [rate == null ? countStr : `${countStr} (${(rate * 100).toFixed(1)}%)`, "Count"];
          }}
          contentStyle={{
            borderRadius: "8px",
            fontSize: "12px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--surface)",
          }}
        />
        <Bar dataKey="count" fill={color} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
