import dotenv from "dotenv";
dotenv.config();

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
      app.use("/api/v1", router);

      app.listen(port, () => {
        logInfo(`API server ready at http://localhost:${port}/api/v1/ask`);
      });
    }).catch((err) => {
      logError("Failed to load routes:", err.message);
    });
  }).catch((err) => {
    logError("Failed to start Express server:", err.message);
  });

} else {
  logInfo("Starting in CLI mode...");

  import("./cli/repl.js")
    .then(({ startRepl }) => {
      startRepl();
    })
    .catch((err) => {
      logError("Failed to start CLI:", err.message);
    });
}
