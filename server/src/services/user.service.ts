import AuthInfo, { AuthProvider } from "../models/AuthInfo.model";
import User, { IUser } from "../models/User.model";

export const createUser = async (
  email: string,
  provider: AuthProvider,
  providerId: string | null,
  password: string | null
): Promise<IUser> => {
  try {
    const user = await User.create({ email });

    const authInfo = await AuthInfo.create({
      provider,
      providerId,
      user: user._id,
      password,
    });

    user.authInfo = authInfo._id;
    await user.save();

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Database operation failed");
  }
};

export const getUserByEmail = async (
  email: string,
  includes: string[]
): Promise<IUser | null> => {
  try {
    const query = User.findOne({ email }).populate(includes);
    return await query.exec();
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw new Error("Database operation failed");
  }
};

export const getUserById = async (
  id: string,
  includes: string[]
): Promise<IUser | null> => {
  try {
    const query = User.findById(id).populate(includes);
    return await query.exec();
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw new Error("Database operation failed");
  }
};
