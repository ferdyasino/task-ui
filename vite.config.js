import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4137,
    open: true,
  },
  build: {
    outDir: "dist",
  },
  // Important for SPA routing to work with browser refresh
  base: "/",
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
