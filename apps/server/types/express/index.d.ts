import { IncomingHttpHeaders } from "http";
import { User } from "@shared/db";

declare module "express" {
  interface Request {
    user: User | undefined;
    headers: IncomingHttpHeaders & {
      refresh: "string" | undefined;
    };
  }
}
