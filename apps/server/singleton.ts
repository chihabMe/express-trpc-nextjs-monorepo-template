import {PrismaClient} from "@shared/db"
import {mockDeep,mockReset,DeepMockProxy} from "jest-mock-extended"
import db from "./src/utils/db"

jest.mock("./index",()=>(
  {
    __esModule:true,
    default:mockDeep<PrismaClient>()
  }
))
beforeEach(()=>{
  mockReset(prismaMock)
})
export const prismaMock = db as unknown as DeepMockProxy<PrismaClient>
