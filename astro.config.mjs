import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://example.com",
  devToolbar: {
    enabled: false,
  },
  // uncomment when build targeting a subpath in the deployment server
  // base: '/somepath',
  // vite: {
  //   server: {
  //     proxy: {
  //       // Proxy requests starting with /api to PHP server
  //       "/api": {
  //         target: "http://localhost:8000",
  //         changeOrigin: true,
  //       },
  //     },
  //   },
  // },
});
