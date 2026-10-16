import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    plugins: [react()],
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    build: {
      // Split heavy vendor libs so repeat visits hit browser cache and the
      // initial chunk stays small (three.js alone is ~600KB minified)
      rollupOptions: {
        output: {
          // Keep React's CommonJS wrappers with React too. Otherwise Rollup
          // can place shared wrappers in the 3D chunk and eagerly load it.
          onlyExplicitManualChunks: true,
          manualChunks(id) {
            if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id) || id.includes("commonjsHelpers")) return "react";
            if (/\/node_modules\/(three|@react-three\/fiber|react-reconciler)\//.test(id)) return "three";
            if (id.includes("/node_modules/gsap/")) return "gsap";
          },
        },
      },
    },
  };
});
