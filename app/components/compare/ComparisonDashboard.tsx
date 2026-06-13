import { getData } from "@/app/api/data-dashboard-api/data/data";
import CompareFileSelectCard from "./CompareFileSelectCard";
import CompareStatCards from "./CompareStatCards";
import ColumnDiffTable from "./ColumnDiffTable";

interface Props {
  fileA: string;
  fileB: string;
  availableFiles: string[];
}

export default async function ComparisonDashboard({
  fileA,
  fileB,
  availableFiles,
}: Readonly<Props>) {
  const [resultA, resultB] = await Promise.all([getData(fileA), getData(fileB)]);

  if (resultA.status !== 200) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-red-500">Failed to load data for &quot;{fileA}&quot;.</p>
      </main>
    );
  }

  if (resultB.status !== 200) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-red-500">Failed to load data for &quot;{fileB}&quot;.</p>
      </main>
    );
  }

  const dataA = resultA.data;
  const dataB = resultB.data;

  return (
    <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
      <CompareFileSelectCard availableFiles={availableFiles} fileA={fileA} fileB={fileB} />
      <CompareStatCards dataA={dataA} dataB={dataB} />
      <ColumnDiffTable dataA={dataA} dataB={dataB} />
    </main>
  );
}
