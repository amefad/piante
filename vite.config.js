import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/piante",
  build: {
    outDir: "piante",
  },
  server: {
    proxy: {
      "/piante/api": {
        target: "http://localhost:8000/public/api",
        rewrite: (path) => path.replace(/^\/piante\/api/, ""),
      },
    },
  },
});
