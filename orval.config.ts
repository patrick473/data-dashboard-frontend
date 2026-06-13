import { defineConfig } from "orval";

export default defineConfig({
  dataDashboardApi: {
    input: {
      target: "./openapi.yaml",
    },
    output: {
      mode: "tags-split",
      target: "./app/api/data-dashboard-api",
      client: "fetch",
      baseUrl: "http://localhost:8000",
    },
  },
});
