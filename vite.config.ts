import { rm } from "node:fs/promises";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "exclude-certificate-source-artwork",
      apply: "build",
      async closeBundle() {
        await rm(fileURLToPath(new URL("./dist/certificates", import.meta.url)), { recursive: true, force: true });
      },
    },
  ],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: { sourcemap: false },
});
