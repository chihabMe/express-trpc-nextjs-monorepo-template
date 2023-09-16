
export const PAGINATION = 20

export const getSecret = ()=>{
  const secret = process.env.SECRET_KEY
  if(!secret)throw new Error("SECRET_KEY is required")
  return secret
}
export const ACCESS_TOKEN_LIFE_TIME=60*60*30 // 30min
export const REFRESH_TOKEN_LIFE_TIME=60*60*25*35//35 days
