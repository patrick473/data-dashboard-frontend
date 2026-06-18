"use client";

import {
  ComposedChart,
  Scatter,
  ErrorBar,
  ReferenceLine,
  ReferenceArea,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatNumber } from "@/app/components/utils/formatNumber";

interface Props {
  mean: number;
  std: number;
  median: number;
  q1: number;
  q3: number;
  min: number;
  max: number;
}

function StdDevTooltip({ mean, std }: Readonly<{ mean: number; std: number }>) {
  return (
    <div
      style={{
        background: "var(--surface, white)",
        border: "1px solid var(--border, #e4e4e7)",
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 12,
        lineHeight: 1.6,
      }}
    >
      <div>
        <span style={{ color: "#6366f1", fontWeight: 600 }}>Mean</span>{" "}
        {formatNumber(mean)}
      </div>
      <div>
        <span style={{ color: "#6366f1" }}>±1σ</span>{" "}
        {formatNumber(mean - std)} – {formatNumber(mean + std)}
      </div>
    </div>
  );
}

export default function StdDevChart({ mean, std, median, q1, q3, min, max }: Readonly<Props>) {
  const range = max - min;
  const padding = Math.max(range * 0.1, std * 0.5, 1);
  const domainMin = min - padding;
  const domainMax = max + padding;

  const scatterData = [{ x: mean, y: 0, std }];

  return (
    <div className="space-y-2">
      <ResponsiveContainer width="100%" height={110}>
        <ComposedChart margin={{ top: 32, right: 32, left: 32, bottom: 8 }}>
          <XAxis
            type="number"
            dataKey="x"
            domain={[domainMin, domainMax]}
            tickFormatter={(v) => formatNumber(v)}
            tick={{ fontSize: 11, fill: "#71717a" }}
            scale="linear"
          />
          <YAxis type="number" domain={[-1, 1]} hide />

          {/* Min–Max markers */}
          <ReferenceLine
            x={min}
            stroke="#94a3b8"
            strokeWidth={2}
            label={{ value: "Min", position: "top", fontSize: 10, fill: "#94a3b8" }}
          />
          <ReferenceLine
            x={max}
            stroke="#94a3b8"
            strokeWidth={2}
            label={{ value: "Max", position: "top", fontSize: 10, fill: "#94a3b8" }}
          />

          {/* IQR shaded box Q1–Q3 */}
          <ReferenceArea
            x1={q1}
            x2={q3}
            fill="#22c55e"
            fillOpacity={0.15}
            stroke="#22c55e"
            strokeOpacity={0.5}
          />
          <ReferenceLine
            x={q1}
            stroke="#22c55e"
            strokeWidth={2}
            label={{ value: "Q1", position: "top", fontSize: 10, fill: "#22c55e" }}
          />
          <ReferenceLine
            x={q3}
            stroke="#22c55e"
            strokeWidth={2}
            label={{ value: "Q3", position: "top", fontSize: 10, fill: "#22c55e" }}
          />

          {/* Median */}
          <ReferenceLine
            x={median}
            stroke="#f59e0b"
            strokeWidth={2.5}
            strokeDasharray="5 3"
            label={{ value: "Median", position: "top", fontSize: 10, fill: "#f59e0b" }}
          />

          {/* Mean ± std as scatter + error bar */}
          <Scatter data={scatterData} fill="#6366f1" r={5}>
            <ErrorBar
              dataKey="std"
              direction="x"
              width={6}
              strokeWidth={2}
              stroke="#6366f1"
            />
          </Scatter>

          <Tooltip
            cursor={false}
            content={<StdDevTooltip mean={mean} std={std} />}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-xs text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5 bg-zinc-400 rounded"></span>
          {" Min / Max"}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-2 rounded-sm bg-green-500 opacity-40 border border-green-500"></span>
          {" IQR (Q1–Q3)"}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5 bg-amber-400 rounded" style={{ borderTop: "2px dashed #f59e0b" }}></span>
          {" Median"}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
          {" Mean ± σ"}
        </span>
      </div>
    </div>
  );
}
