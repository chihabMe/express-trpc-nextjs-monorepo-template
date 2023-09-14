import {  PrismaClient} from "@shared/db";

 export const db = new PrismaClient() // method 1 

// export const db = DbSingleton.createDbInstance()//method 2 
//
// export default class DbSingleton { 
//   private static dbInstance:PrismaClient;
//
//   public static createDbInstance():PrismaClient{
//     if(!DbSingleton.dbInstance){
//       const instance =  new PrismaClient()
//       DbSingleton.dbInstance=instance
//       return instance
//     }
//     return DbSingleton.dbInstance
//   }
// }
