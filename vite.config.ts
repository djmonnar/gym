import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

const isVercelBuild = process.env.VERCEL === "1";

export default defineConfig({
  base: isVercelBuild ? "/" : "/gym/",
  plugins: [react()],
  build: {
    outDir: "docs",
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "index.source.html")
    }
  },
  server: {
    port: 5173
  }
});
