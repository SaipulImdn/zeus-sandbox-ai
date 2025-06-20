import dotenv from "dotenv";
dotenv.config();

import { useApi } from "./constant/constant.js";

if (useApi) {
  import("express").then((expressModule) => {
    const express = expressModule.default;
    import("./routes/routes.js").then((routerModule) => {
      const router = routerModule.default;

      const app = express();
      app.use(express.json());
      app.use("/api/v1", router);

      const PORT = Number(process.env.PORT) || 3000;
      app.listen(PORT, () => {
        console.log(`API server ready at http://localhost:${PORT}/api/v1/ask`);
      });
    });
  });
} else {
  import("./cli/repl.js").then(({ startRepl }) => {
    startRepl();
  });
}
