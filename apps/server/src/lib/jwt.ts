import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import * as config from "../utils/config";
import IJwtUser from "../apps/interfaces/IJwtUser";

export default class Jwt {
  private secret = config.getSecret();

  verify = async (token: string) => {
    return jwt.verify(token, this.secret) as IJwtUser;
  };
  sign = async (data: IJwtUser, config: SignOptions) => {
    return jwt.sign(data, this.secret, config);
  };
}
