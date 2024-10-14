import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import config from "../config/default";

export const googleAuthClient = new OAuth2Client(
  config.googleAuthConfig.clientId,
  config.googleAuthConfig.clientSecret,
  config.googleAuthConfig.redirectUri
);

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
