import type { ColumnMetadata } from "../types";

const DTYPE_BADGE: Record<string, string> = {
  string: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  numeric: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  datetime: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  boolean: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  categorical: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
};

interface Props {
  columns: ColumnMetadata[];
  rowCount: number;
}

export default function ColumnStatsTable({ columns, rowCount }: Readonly<Props>) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Column Statistics
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
              <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Column</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Type</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">Missing</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">Unique</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">Min</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">Max</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">Mean</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">Std</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Top Values</th>
            </tr>
          </thead>
          <tbody>
            {columns.map((col, i) => {
              const missingPct = ((col.null_count / rowCount) * 100).toFixed(1);
              const badgeClass =
                DTYPE_BADGE[col.dtype] ??
                "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
              return (
                <tr
                  key={col.name}
                  className={`border-b border-zinc-100 dark:border-zinc-800 ${
                    i % 2 === 0 ? "" : "bg-zinc-50/50 dark:bg-zinc-800/20"
                  }`}
                >
                  <td className="px-4 py-3 font-mono font-medium text-zinc-800 dark:text-zinc-200">
                    {col.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeClass}`}>
                      {col.dtype}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-zinc-600 dark:text-zinc-400">
                    {col.null_count === 0 ? (
                      <span className="text-green-600 dark:text-green-400">0</span>
                    ) : (
                      <>
                        {col.null_count.toLocaleString()}{" "}
                        <span className="text-zinc-400">({missingPct}%)</span>
                      </>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-zinc-600 dark:text-zinc-400">
                    {col.unique_count.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-zinc-500 dark:text-zinc-500">
                    {col.min == null ? "—" : String(col.min)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-zinc-500 dark:text-zinc-500">
                    {col.max == null ? "—" : String(col.max)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-zinc-500 dark:text-zinc-500">
                    {col.mean == null ? "—" : col.mean.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-zinc-500 dark:text-zinc-500">
                    {col.std == null ? "—" : col.std.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-500">
                    {col.top_values ? (
                      <span className="font-mono text-xs">
                        {col.top_values.slice(0, 3).join(", ")}
                        {col.top_values.length > 3 && (
                          <span className="text-zinc-400"> +{col.top_values.length - 3}</span>
                        )}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
