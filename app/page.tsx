import Header from "@/app/components/common/Header";
import Dashboard from "@/app/components/dashboard/Dashboard";
import { getAvailableFiles } from "@/app/api/data-dashboard-api/data/data";

export default async function Home({
  searchParams,
}: {
  readonly searchParams: Promise<{ file?: string }>;
}) {
  const { data: filesData } = await getAvailableFiles();
  const availableFiles = filesData.available_files;
  const selectedFile = (await searchParams).file ?? availableFiles[0] ?? "";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Header />
      <Dashboard fileName={selectedFile} availableFiles={availableFiles} />
    </div>
  );
}
