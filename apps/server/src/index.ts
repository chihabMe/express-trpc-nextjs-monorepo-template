import express, { Express } from "express";
import trpcMiddleware from "./utils/middlewares/trpc.middleware";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { authRouter } from "./apps/auth/auth.router";
import errorsMiddleware from "./utils/middlewares/errors.middleware";

const registerApps = (app: Express) => {
  app.use("/api/auth", authRouter);
};
const registerMiddleware = (app: Express) => {
  app.use(helmet());
  app.use(cors());
  app.use(morgan("tiny"));
  app.use(express.json());
  app.use("/api/trpc", trpcMiddleware);
};
const registerErrorsMiddleware = (app: Express) => {
  app.use(errorsMiddleware);
};
const app = express();
registerMiddleware(app);
registerApps(app);
registerErrorsMiddleware(app);
registerMiddleware;
const port = process.env.PORT ?? 3001;
app.listen(port, () => console.log(`running on port ${port}`));
