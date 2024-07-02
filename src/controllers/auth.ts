import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import connection from "../db";
import { User } from "../models/user";
import { v4 as uuidv4 } from "uuid";

const signup = asyncHandler(async (req: Request, res: any) => {
  const { username, password }: User = req.body;
  console.log(req);

  if (!username || !password) {
    return res.status(400).send("Username and password are required.");
  }

  try {
    // Check if user already exists
    const [rows] = await connection
      .promise()
      .query("SELECT * FROM users WHERE username = ?", [username]);

    if ((rows as any[]).length > 0) {
      return res.status(409).send("Username already exists.");
    }

    // Hash the password with bcrypt, using 10 rounds of salt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const newId = uuidv4();
    // Insert new user into the database
    const insertQuery =
      "INSERT INTO users (id, username, password) VALUES (?, ?, ?)";
    await connection
      .promise()
      .query(insertQuery, [newId, username, hashedPassword]);

    res.status(201).send("User created successfully.");
  } catch (err) {
    console.error("Error signing up user:", err);
    res.status(500).send("Internal server error.");
  }
});

const auth = {
  signup,
};

export default auth;
