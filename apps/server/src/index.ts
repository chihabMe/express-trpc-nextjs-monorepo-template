import express,{Express} from "express"
import trpcMiddleware from "./utils/middlewares/trpc.middleware"
import cors from "cors" 
import morgan from "morgan"
import helmet from "helmet"

const registerApps = (app:Express)=>{
}
const registerMiddleware = (app:Express)=>{
  app.use(helmet())
  app.use(cors())
  app.use(express.json({limit:"10mb"}))
  app.use(morgan("tiny"))
  app.use("/api/trpc",trpcMiddleware)

}
const registerErrorsMiddleware = (app:Express)=>{

}
const app = express()
registerMiddleware(app)
registerErrorsMiddleware(app)
registerMiddleware
const port = process.env.PORT??3001
app.listen(port,()=>console.log(`running on port ${port}`))
