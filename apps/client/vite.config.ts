import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  envDir: "../..",
  plugins: [tanstackRouter(), react(), tailwindcss()],
  server: { port: 5173 },
  resolve: { tsconfigPaths: true },
});
