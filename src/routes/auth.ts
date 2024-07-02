import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import connection from "../db";
import { User } from "../models/user";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  const { username, password }: User = req.body;

  if (!username || password) {
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

    // Hash the password with bcrypt, 10 salt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    await connection
      .promise()
      .query("INSERT INTO users (username, password) VALUES (?, ?)", [
        username,
        hashedPassword,
      ]);

    res.status(201).send("User created successfully.");
  } catch (err) {
    console.error("Error signing up user:", err);
    res.status(500).send("Internal server error.");
  }
});

export default router;
