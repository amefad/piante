import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://example.com",
  devToolbar: {
    enabled: false,
  },
  vite: {
    server: {
      proxy: {
        // Proxy requests starting with /api to PHP server
        "/api": {
          target: "http://localhost:8000",
          changeOrigin: true,
        },
      },
    },
  },
});
