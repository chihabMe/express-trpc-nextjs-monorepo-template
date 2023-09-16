import bcrypt from "bcrypt";

class Hasher {
  hash = async (password: string) => {
    return bcrypt.hash(password, 14);
  };
  comparePassword = async (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
  };
}
export default Hasher;
