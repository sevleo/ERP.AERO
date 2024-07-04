const fs = require("fs");
const path = require("path");
const connection = require("../db"); // Assuming 'db' is exported as default
const { isTokenBlacklisted } = require("../helpers/disableTokens");
const multer = require("multer");
const contentDisposition = require("content-disposition");

// Function to upload file
const uploadFile = async (req, res) => {
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

      res.status(200).send({
        success: true,
        message: "File uploaded successfully.",
        newAccessToken: req.newAccessToken,
      });
    } catch (err) {
      console.error("Error uploading file:", err);
      res.status(500).send("Internal server error.");
    }
  }
};

// Function to list files
const listFiles = async (req, res) => {
  console.log(req);
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

      const totalFiles = countResult[0].count;
      const totalPages = Math.ceil(totalFiles / list_size);

      res.status(200).send({
        success: true,
        files: rows,
        totalFiles,
        totalPages,
        currentPage: page,
        listSize: list_size,
        newAccessToken: req.newAccessToken,
      });
    } catch (err) {
      console.error("Error listing files:", err);
      res.status(500).send("Internal server error.");
    }
  }
};

// Function to delete file
const deleteFile = async (req, res) => {
  if (isTokenBlacklisted(req.headers.authorization)) {
    res.status(401).send("token is blacklisted");
  } else {
    const { id } = req.params;

    try {
      const [file] = await connection
        .promise()
        .query("SELECT * FROM files WHERE id = ?", [id]);

      if (file.length === 0) {
        return res
          .status(404)
          .send({ success: false, message: "File not found." });
      }

      const filePath = path.join(__dirname, "../../uploads/", file[0].filename);

      fs.unlink(filePath, async (err) => {
        if (err) {
          console.error("Error deleting file from filesystem:", err);
          return res.status(500).send("Internal server error.");
        }

        await connection
          .promise()
          .query("DELETE FROM files WHERE id = ?", [id]);
        res.status(200).send({
          success: true,
          message: "File deleted successfully.",
          newAccessToken: req.newAccessToken,
        });
      });
    } catch (err) {
      console.error("Error deleting file:", err);
      res.status(500).send("Internal server error.");
    }
  }
};

// Function to get file details
const getFile = async (req, res) => {
  if (isTokenBlacklisted(req.headers.authorization)) {
    res.status(401).send("token is blacklisted");
  } else {
    const { id } = req.params;

    try {
      const [file] = await connection
        .promise()
        .query("SELECT * FROM files WHERE id = ?", [id]);
      if (file.length === 0) {
        return res
          .status(404)
          .send({ success: false, message: "File not found." });
      }

      console.log(req);

      res.status(200).send({
        success: true,
        file: file[0],
        newAccessToken: req.newAccessToken,
      });
    } catch (err) {
      console.error("Error getting file details:", err);
      res.status(500).send("Internal server error.");
    }
  }
};

// Function to download file
const downloadFile = async (req, res) => {
  if (isTokenBlacklisted(req.headers.authorization)) {
    res.status(401).send("token is blacklisted");
  } else {
    const { id } = req.params;

    try {
      const [file] = await connection
        .promise()
        .query("SELECT * FROM files WHERE id = ?", [id]);

      if (file.length === 0) {
        return res
          .status(404)
          .send({ success: false, message: "File not found." });
      }

      const fileName = file[0].filename;
      const filePath = path.join(__dirname, "../../uploads/", fileName);
      const file_name = file[0].file_name;

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
const updateFile = async (req, res) => {
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
      if (existingFile.length === 0) {
        return res
          .status(404)
          .send({ success: false, message: "File not found." });
      }

      // Delete the old file from the filesystem
      const oldFilePath = path.join(
        __dirname,
        "../../uploads/",
        existingFile[0].filename
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

      res.status(200).send({
        success: true,
        message: "File updated successfully.",
        newAccessToken: req.newAccessToken,
      });
    } catch (err) {
      console.error("Error updating file:", err);
      res.status(500).send("Internal server error.");
    }
  }
};

module.exports = {
  uploadFile,
  listFiles,
  deleteFile,
  getFile,
  downloadFile,
  updateFile,
};
