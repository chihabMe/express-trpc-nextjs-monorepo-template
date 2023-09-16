import Hasher from "../../lib/hasher";
import db from "../../utils/db";
import { ObtainTokenInput } from "./auth.schemas";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export default class AuthServices {
  private hasher :Hasher
  constructor(hasher:Hasher){
    this.hasher=hasher
  }

  verifyCredentials = async(input:ObtainTokenInput)=>{
    db.

  }

  generateTokens = async () => {
    return {
      access: "access token",
      refersh: "refresh token",
    };
  };
}
