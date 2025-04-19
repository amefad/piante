import { defineConfig } from "astro/config";
import relativeLinks from 'astro-relative-links';

export default defineConfig({
  site: "https://example.com",
  devToolbar: {
    enabled: false,
  },
  // uncomment to build targeting a subpath (optional)
  // base: '/somepath',
  integrations: [relativeLinks()],
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
