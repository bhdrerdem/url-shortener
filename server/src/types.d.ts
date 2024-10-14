import { IUser } from "./models/User.model"; // Adjust the path as needed

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null; // Declare the user field as optional
    }
  }
}
