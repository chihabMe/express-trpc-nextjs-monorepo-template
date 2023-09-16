import * as z from "zod";

export const zParse = <T extends z.AnyZodObject>(
  schema: T,
  body: any,
): Promise<z.infer<T>> => {
  return schema.parseAsync(body);
};
