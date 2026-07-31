import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import newsHandler from "./api/news.js";

function localApiPlugin() {
  return {
    name: "local-api",
    configureServer(server) {
      server.middlewares.use("/api/news", async (req, res) => {
        const requestUrl = new URL(req.url || "/", "http://localhost");
        req.query = Object.fromEntries(requestUrl.searchParams);
        res.status = (statusCode) => {
          res.statusCode = statusCode;
          return res;
        };
        res.json = (body) => {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        };

        await newsHandler(req, res);
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  process.env.NEWS_API_KEY ??= env.NEWS_API_KEY;

  return {
    plugins: [react(), localApiPlugin()],
  };
});
