import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";

// https://vite.dev/config/
export default defineConfig({
  base: "/b2b/",
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      generatedRouteTree: "./src/route-tree.gen.ts",
      routesDirectory: "./src/pages",
      routeToken: "layout",
    }),
    react(),
    tailwindcss(),
  ],
  server: {
    https: {
      key: fs.readFileSync("./ssl/localhost-key.pem"),
      cert: fs.readFileSync("./ssl/localhost.pem"),
    },
    host: "localhost", // ou '0.0.0.0' se quiser acesso externo
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
