import User from "./models/user";

const dbInit = () => {
  User.sync()
}
export default dbInit 