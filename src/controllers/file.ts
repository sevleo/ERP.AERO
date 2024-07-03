import fs from "fs";
import path from "path";
import connection from "../db";
import { isTokenBlacklisted } from "../helpers/disableTokens";

// Function to upload file
export const uploadFile = async (req: any, res: any) => {
  console.log(req.file);
  console.log(req.headers);

  if (isTokenBlacklisted(req.headers.authorization)) {
    res.status(401).send("token is blacklisted");
  } else {
    // Deconstructing req.file
    const { file } = req;
    const { originalname, mimetype, size, filename } = file;

    try {
      const query =
        "INSERT INTO files (file_name, file_extension, mime_type, file_size, upload_date) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)";
      await connection
        .promise()
        .query(query, [
          originalname,
          path.extname(originalname),
          mimetype,
          size,
        ]);

      res
        .status(200)
        .send({ success: true, message: "File uploaded successfully." });
    } catch (err) {
      console.error("Error uploading file:", err);
      res.status(500).send("Internal server error.");
    }
  }
};

// Function to list files
export const listFiles = async (req: any, res: any) => {
  try {
    const [files] = await connection.promise().query("SELECT * FROM files");
    res.status(200).send(files);
  } catch (err) {
    console.error("Error listing files:", err);
    res.status(500).send("Internal server error.");
  }
};

// Function to delete file
export const deleteFile = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const query = "DELETE FROM files WHERE id = ?";
    await connection.promise().query(query, [id]);

    res
      .status(200)
      .send({ success: true, message: "File deleted successfully." });
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).send("Internal server error.");
  }
};

// Function to get file details
export const getFile = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const [file] = await connection
      .promise()
      .query("SELECT * FROM files WHERE id = ?", [id]);
    if ((file as any).length === 0) {
      return res
        .status(404)
        .send({ success: false, message: "File not found." });
    }

    res.status(200).send((file as any)[0]);
  } catch (err) {
    console.error("Error getting file details:", err);
    res.status(500).send("Internal server error.");
  }
};

// Function to download file
export const downloadFile = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const [file] = await connection
      .promise()
      .query("SELECT * FROM files WHERE id = ?", [id]);
    if ((file as any).length === 0) {
      return res
        .status(404)
        .send({ success: false, message: "File not found." });
    }

    const filePath = path.join(
      __dirname,
      "../../uploads",
      (file as any)[0].file_name
    );
    res.download(filePath);
  } catch (err) {
    console.error("Error downloading file:", err);
    res.status(500).send("Internal server error.");
  }
};

// Function to update file
export const updateFile = async (req: any, res: any) => {
  const { id } = req.params;
  const { fileName, fileExtension, mimeType } = req.body;

  try {
    const query =
      "UPDATE files SET file_name = ?, file_extension = ?, mime_type = ? WHERE id = ?";
    await connection
      .promise()
      .query(query, [fileName, fileExtension, mimeType, id]);

    res
      .status(200)
      .send({ success: true, message: "File updated successfully." });
  } catch (err) {
    console.error("Error updating file:", err);
    res.status(500).send("Internal server error.");
  }
};
