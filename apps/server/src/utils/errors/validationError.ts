import { TRPCError } from "@trpc/server";
import { TRPC_ERROR_CODE_KEY } from "@trpc/server/dist/rpc";

export class ValidationError {
  fields: Record<string, string[]>;
  constructor(fields: Record<string, string[]>) {
    this.fields = fields;
  }
}
