import { Request, Response } from "express";
import { createUser } from "../services/user.service";
import { AuthProvider } from "../models/AuthInfo.model";
import bcrypt from "bcrypt";
import { hashPassword } from "../services/auth.service";

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
