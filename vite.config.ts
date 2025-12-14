import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // For Netlify (root deploy). If you later deploy to GitHub Pages, change this.
  base: "/",
  plugins: [react()],
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
