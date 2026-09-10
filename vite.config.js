import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    host: true, // expose on the LAN so you can test on a real phone
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
        /**
         * Only leaf libraries are grouped by hand.
         *
         * An earlier version also grouped "three"/"@react-three"/"maath" by
         * path substring. That split the WebGL dependency graph across two
         * chunks which then imported each other, so Rollup had to treat the
         * whole ~830 KB bundle as a static dependency of the entry — every
         * phone downloaded it to render zero 3D scenes.
         *
         * react and framer-motion are safe because nothing they import lives
         * in another manual chunk. Everything else is left to Rollup, whose
         * automatic splitting keeps a dynamic import and its exclusive deps in
         * an async chunk — which is what keeps three.js off devices that never
         * render a canvas. Verify after changing this:
         *   grep modulepreload dist/index.html   # must not list the 800 KB chunk
         */
        manualChunks: {
          react: ["react", "react-dom"],
          motion: ["framer-motion"],
        },
      },
    },
  },
});
