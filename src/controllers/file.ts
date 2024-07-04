import fs from "fs";
import path from "path";
import connection from "../db";
import { isTokenBlacklisted } from "../helpers/disableTokens";
import multer from "multer";
import contentDisposition from "content-disposition";

// Function to upload file
export const uploadFile = async (req: any, res: any) => {
  console.log(req);
  console.log(req.file);
  console.log(req.headers);

  if (isTokenBlacklisted(req.headers.authorization)) {
    res.status(401).send("token is blacklisted");
  } else {
    // Deconstructing req.file
    const { file } = req;
    const { originalname, mimetype, size, filename } = file;
    console.log(filename);

    try {
      const query =
        "INSERT INTO files (file_name, file_extension, mime_type, file_size, filename, upload_date) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
      await connection
        .promise()
        .query(query, [
          originalname,
          path.extname(originalname),
          mimetype,
          size,
          filename,
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
  if (isTokenBlacklisted(req.headers.authorization)) {
    res.status(401).send("token is blacklisted");
  } else {
    let { page = 1, list_size = 10 } = req.query;
    page = parseInt(page, 10);
    list_size = parseInt(list_size, 10);

    const offset = (page - 1) * list_size;

    try {
      const query = `SELECT id, file_name, file_extension, mime_type, file_size, upload_date FROM files LIMIT ? OFFSET ?`;
      const countQuery = `SELECT COUNT(*) as count FROM files`;
      const [rows] = await connection
        .promise()
        .query(query, [list_size, offset]);
      const [countResult] = await connection.promise().query(countQuery);

      const totalFiles = (countResult as any)[0].count;
      const totalPages = Math.ceil(totalFiles / list_size);

      res.status(200).send({
        success: true,
        files: rows,
        totalFiles,
        totalPages,
        currentPage: page,
        listSize: list_size,
      });
    } catch (err) {
      console.error("Error listing files:", err);
      res.status(500).send("Internal server error.");
    }
  }
};

// Function to delete file
export const deleteFile = async (req: any, res: any) => {
  if (isTokenBlacklisted(req.headers.authorization)) {
    res.status(401).send("token is blacklisted");
  } else {
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
        "../../uploads/",
        (file as any)[0].filename
      );

      fs.unlink(filePath, async (err) => {
        if (err) {
          console.error("Error deleting file from filesystem:", err);
          return res.status(500).send("Internal server error.");
        }

        await connection
          .promise()
          .query("DELETE FROM files WHERE id = ?", [id]);
        res
          .status(200)
          .send({ success: true, message: "File deleted successfully." });
      });
    } catch (err) {
      console.error("Error deleting file:", err);
      res.status(500).send("Internal server error.");
    }
  }
};

// Function to get file details
export const getFile = async (req: any, res: any) => {
  if (isTokenBlacklisted(req.headers.authorization)) {
    res.status(401).send("token is blacklisted");
  } else {
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

      res.status(200).send({ success: true, file: (file as any)[0] });
    } catch (err) {
      console.error("Error getting file details:", err);
      res.status(500).send("Internal server error.");
    }
  }
};

// Function to download file
export const downloadFile = async (req: any, res: any) => {
  if (isTokenBlacklisted(req.headers.authorization)) {
    res.status(401).send("token is blacklisted");
  } else {
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

      const fileName = (file as any)[0].filename;
      const filePath = path.join(__dirname, "../../uploads/", fileName);
      const file_name = (file as any)[0].file_name;

      if (!fs.existsSync(filePath)) {
        return res
          .status(404)
          .send({ success: false, message: "File not found on server." });
      }
      console.log(filePath);
      res.download(filePath, file_name);
    } catch (err) {
      console.error("Error downloading file:", err);
      res.status(500).send("Internal server error.");
    }
  }
};

// Function to update file
export const updateFile = async (req: any, res: any) => {
  console.log(req);
  console.log(req.file);
  console.log(req.headers);

  if (isTokenBlacklisted(req.headers.authorization)) {
    res.status(401).send("token is blacklisted");
  } else {
    const { id } = req.params;
    const { file } = req;
    const { originalname, mimetype, size, filename } = file;

    try {
      // Fetch the existing file record
      const [existingFile] = await connection
        .promise()
        .query("SELECT * FROM files WHERE id = ?", [id]);
      if ((existingFile as any).length === 0) {
        return res
          .status(404)
          .send({ success: false, message: "File not found." });
      }

      // Delete the old file from the filesystem
      const oldFilePath = path.join(
        __dirname,
        "../../uploads/",
        (existingFile as any)[0].filename
      );
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      // Update the file record in the database
      const query = `
        UPDATE files 
        SET file_name = ?, file_extension = ?, mime_type = ?, file_size = ?, filename = ?, upload_date = CURRENT_TIMESTAMP 
        WHERE id = ?`;
      await connection
        .promise()
        .query(query, [
          originalname,
          path.extname(originalname),
          mimetype,
          size,
          filename,
          id,
        ]);

      res
        .status(200)
        .send({ success: true, message: "File updated successfully." });
    } catch (err) {
      console.error("Error updating file:", err);
      res.status(500).send("Internal server error.");
    }
  }
};
