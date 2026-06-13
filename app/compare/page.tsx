import Header from "@/app/components/common/Header";
import ComparisonDashboard from "@/app/components/compare/ComparisonDashboard";
import { getAvailableFiles } from "@/app/api/data-dashboard-api/data/data";

export default async function ComparePage({
  searchParams,
}: {
  readonly searchParams: Promise<{ fileA?: string; fileB?: string }>;
}) {
  const { data: filesData } = await getAvailableFiles();
  const availableFiles = filesData.available_files;
  const { fileA, fileB } = await searchParams;
  const selectedFileA = fileA ?? availableFiles[0] ?? "";
  const selectedFileB = fileB ?? availableFiles[1] ?? availableFiles[0] ?? "";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Header />
      <ComparisonDashboard
        fileA={selectedFileA}
        fileB={selectedFileB}
        availableFiles={availableFiles}
      />
    </div>
  );
}
