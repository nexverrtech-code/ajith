import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,
    port: 5173,
    open: false,
  },

  preview: {
    host: true,
    port: 4173,
  },

  build: {
    target: "es2019",
    cssTarget: "chrome80",
    sourcemap: false,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1200,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("/react/") ||
              id.includes("/react-dom/")
            ) {
              return "react";
            }

            if (id.includes("/framer-motion/")) {
              return "motion";
            }
          }
        },
      },
    },
  },
});