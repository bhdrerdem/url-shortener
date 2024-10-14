import { Request, Response } from "express";
import { createUser, getUserByEmail } from "../services/user.service";
import { AuthProvider } from "../models/AuthInfo.model";
import config from "../config/default";
import { googleAuthClient, hashPassword } from "../services/auth.service";
import axios from "axios";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      error: "Fields 'email' and 'password' are required",
    });
  }

  // TODO: Validate email and password

  let hashedPassword: string;
  try {
    hashedPassword = await hashPassword(password);
  } catch (error) {
    console.error("Error hashing password:", error);
    return res.status(500).send({
      error: "Something went wrong, please try again later",
    });
  }

  try {
    const user = await createUser(
      email,
      AuthProvider.LOCAL,
      null,
      hashedPassword
    );
    return res.send(user.toJSON());
  } catch (error) {
    return res.status(500).send({
      error: "Something went wrong, please try again later",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      error: "Fields 'email' and 'password' are required",
    });
  }
};

export const handleGoogleAuth = async (req: Request, res: Response) => {
  const authorizeUrl = googleAuthClient.generateAuthUrl({
    access_type: "offline",
    scope: ["email", "profile"],
  });

  return res.redirect(authorizeUrl);
};

export const handleGoogleAuthCallback = async (req: Request, res: Response) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send({
      error: "Field 'code' is required",
    });
  }

  try {
    const { tokens } = await googleAuthClient.getToken(code.toString());
    googleAuthClient.setCredentials(tokens);

    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    const userData = userInfoResponse.data as { email?: string; sub?: string };

    if (!userData?.email || !userData?.sub) {
      return res.status(400).send({
        error: "Invalid Google response",
      });
    }

    let user = await getUserByEmail(userData.email, ["authInfo"]);
    if (!user) {
      user = await createUser(
        userData.email,
        AuthProvider.GOOGLE,
        userData.sub,
        null
      );
    }

    return res.redirect("http://localhost:3000");
  } catch (error) {
    console.error("Error authenticating with Google:", error);
    return res.status(500).send({
      error: "Something went wrong, please try again later",
    });
  }
};
