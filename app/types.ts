export interface ColumnMetadata {
  name: string;
  dtype: "string" | "numeric" | "datetime" | "boolean" | "categorical";
  null_count: number;
  unique_count: number;
  top_values?: string[];
  min?: number | string;
  max?: number | string;
  mean?: number;
  std?: number;
  median?: number;
}

export interface CsvMetadata {
  file: {
    name: string;
    size_bytes: number;
    row_count: number;
    column_count: number;
  };
  columns: ColumnMetadata[];
}
