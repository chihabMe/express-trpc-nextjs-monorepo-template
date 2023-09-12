import express,{Express} from "express"
import trpcMiddleware from "./utils/middlewares/trpc.middleware"
import cors from "cors" 
import morgan from "morgan"

const registerApps = (app:Express)=>{
}
const registerMiddleware = (app:Express)=>{
  app.use(cors())
  app.use(morgan("tiny"))
  app.use("/api/trpc",trpcMiddleware)

}
const regsiterErrorsMiddleware = (app:Express)=>{

}
const runServer = ()=>{
  const app = express()
  const port = process.env.PORT??3001
  app.listen(port,()=>console.log(`running on port ${port}`))
}
if(require.main==module)runServer()
