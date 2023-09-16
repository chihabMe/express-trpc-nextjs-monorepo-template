import * as z from "zod"

export const obtainTokenSchema = z.object({
  email:z.string(),
  password:z.string()
})

export type ObtainTokenInput = z.TypeOf<typeof obtainTokenSchema>
