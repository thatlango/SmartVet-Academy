import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

function ahrefsAnalyticsPlugin(dataKey?: string): Plugin {
  return {
    name: "tuku-ahrefs-web-analytics",
    apply: "build",
    transformIndexHtml() {
      if (!dataKey) return [];
      return [{
        tag: "script",
        attrs: {
          src: "https://analytics.ahrefs.com/analytics.js",
          "data-key": dataKey,
          "data-prop-product": "smartvet-academy",
          defer: true,
        },
        injectTo: "head",
      }];
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const ahrefsDataKey = env.AHREFS_ANALYTICS_KEY || env.VITE_AHREFS_ANALYTICS_KEY;

  return {
    plugins: [react(), tailwindcss(), ahrefsAnalyticsPlugin(ahrefsDataKey)],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    build: { sourcemap: false },
  };
});
