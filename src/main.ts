import dotenv from "dotenv";
dotenv.config();

import path from "path";
import { getConfig } from "./config/config.js";
import { logError, logInfo } from "./utils/logger.js";

const { useApi, port } = getConfig();

if (useApi) {
  logInfo("Starting in API mode...");

  import("express").then((expressModule) => {
    const express = expressModule.default;

    import("./routes/routes.js").then((routerModule) => {
      const router = routerModule.default;

      const app = express();
      app.use(express.json());

      const interfacePath = path.join(process.cwd(), "src/interface");
      app.use("/interface", express.static(interfacePath));

      app.get("/", (_req, res) => {
        res.sendFile(path.join(interfacePath, "sandbox.html"));
      });

      app.get("/healthz", (_req, res) => {
      res.redirect("/interface/healthz.html");
      });

      app.use("/api/v1", router);

      app.use((_req, res) => {
        res.status(404).sendFile(path.join(interfacePath, "not-found.html"));
      });

      app.listen(port, () => {
        logInfo(`API server ready at http://localhost:${port}`);
        logInfo(`Try UI at http://localhost:${port}/interface/sandbox.html`);
      });
    }).catch((err) => {
      logError("Failed to load routes:", err.message);
    });
  }).catch((err) => {
    logError("Failed to start Express server:", err.message);
  });
}
