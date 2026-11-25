import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ejs from "ejs";
import { homeJobs, catalogJobs } from "./src/templates/data/jobs.js";

const projectRoot = dirname(fileURLToPath(import.meta.url));

function renderEjsPages() {
  return {
    name: "job-board-ejs",
    transformIndexHtml: {
      order: "pre",
      handler(html, context) {
        return ejs.render(html, { homeJobs, catalogJobs }, {
          filename: context.filename
        });
      }
    },
    configureServer(server) {
      const partialsPath = resolve(projectRoot, "src/templates/partials");
      server.watcher.add(partialsPath);
      server.watcher.on("change", (changedPath) => {
        if (changedPath.endsWith(".ejs")) {
          server.ws.send({ type: "full-reload" });
        }
      });
    }
  };
}

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/Web_2026/" : "/",
  plugins: [renderEjsPages()],
  server: { port: 5173, open: true },
  preview: { port: 4173 },
  root: ".",
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      input: {
        home: resolve(projectRoot, "index.html"),
        jobs: resolve(projectRoot, "jobs.html"),
        details: resolve(projectRoot, "job-details.html"),
        apply: resolve(projectRoot, "apply.html")
      }
    }
  }
}));
