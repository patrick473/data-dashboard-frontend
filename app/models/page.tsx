import Header from "@/app/components/common/Header";
import ModelsDashboard from "@/app/components/models/ModelsDashboard";
import { getAvailableModels, getModelResults } from "@/app/api/data-dashboard-api/models/models";
import type { ModelResult } from "@/app/api/data-dashboard-api/dataDashboardAPI.schemas";

export default async function ModelsPage() {
  const { data: availableData, status } = await getAvailableModels();

  if (status !== 200) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
        <Header />
        <main className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-red-500">Failed to load model list.</p>
        </main>
      </div>
    );
  }

  const results = await Promise.all(
    availableData.available_models.map((name) => getModelResults(name))
  );

  const models: ModelResult[] = results
    .filter((r) => r.status === 200)
    .map((r) => (r as { status: 200; data: ModelResult }).data);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Header />
      <ModelsDashboard models={models} />
    </div>
  );
}
