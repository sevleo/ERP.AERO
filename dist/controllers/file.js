"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFile = exports.downloadFile = exports.getFile = exports.deleteFile = exports.listFiles = exports.uploadFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("../db"));
const disableTokens_1 = require("../helpers/disableTokens");
// Function to upload file
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req);
    console.log(req.file);
    console.log(req.headers);
    if ((0, disableTokens_1.isTokenBlacklisted)(req.headers.authorization)) {
        res.status(401).send("token is blacklisted");
    }
    else {
        // Deconstructing req.file
        const { file } = req;
        const { originalname, mimetype, size, filename } = file;
        console.log(filename);
        try {
            const query = "INSERT INTO files (file_name, file_extension, mime_type, file_size, filename, upload_date) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
            yield db_1.default
                .promise()
                .query(query, [
                originalname,
                path_1.default.extname(originalname),
                mimetype,
                size,
                filename,
            ]);
            res.status(200).send({
                success: true,
                message: "File uploaded successfully.",
                newAccessToken: req.newAccessToken,
            });
        }
        catch (err) {
            console.error("Error uploading file:", err);
            res.status(500).send("Internal server error.");
        }
    }
});
exports.uploadFile = uploadFile;
// Function to list files
const listFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req);
    if ((0, disableTokens_1.isTokenBlacklisted)(req.headers.authorization)) {
        res.status(401).send("token is blacklisted");
    }
    else {
        let { page = 1, list_size = 10 } = req.query;
        page = parseInt(page, 10);
        list_size = parseInt(list_size, 10);
        const offset = (page - 1) * list_size;
        try {
            const query = `SELECT id, file_name, file_extension, mime_type, file_size, upload_date FROM files LIMIT ? OFFSET ?`;
            const countQuery = `SELECT COUNT(*) as count FROM files`;
            const [rows] = yield db_1.default
                .promise()
                .query(query, [list_size, offset]);
            const [countResult] = yield db_1.default.promise().query(countQuery);
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
        }
        catch (err) {
            console.error("Error listing files:", err);
            res.status(500).send("Internal server error.");
        }
    }
});
exports.listFiles = listFiles;
// Function to delete file
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, disableTokens_1.isTokenBlacklisted)(req.headers.authorization)) {
        res.status(401).send("token is blacklisted");
    }
    else {
        const { id } = req.params;
        try {
            const [file] = yield db_1.default
                .promise()
                .query("SELECT * FROM files WHERE id = ?", [id]);
            if (file.length === 0) {
                return res
                    .status(404)
                    .send({ success: false, message: "File not found." });
            }
            const filePath = path_1.default.join(__dirname, "../../uploads/", file[0].filename);
            fs_1.default.unlink(filePath, (err) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.error("Error deleting file from filesystem:", err);
                    return res.status(500).send("Internal server error.");
                }
                yield db_1.default
                    .promise()
                    .query("DELETE FROM files WHERE id = ?", [id]);
                res.status(200).send({
                    success: true,
                    message: "File deleted successfully.",
                    newAccessToken: req.newAccessToken,
                });
            }));
        }
        catch (err) {
            console.error("Error deleting file:", err);
            res.status(500).send("Internal server error.");
        }
    }
});
exports.deleteFile = deleteFile;
// Function to get file details
const getFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, disableTokens_1.isTokenBlacklisted)(req.headers.authorization)) {
        res.status(401).send("token is blacklisted");
    }
    else {
        const { id } = req.params;
        try {
            const [file] = yield db_1.default
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
        }
        catch (err) {
            console.error("Error getting file details:", err);
            res.status(500).send("Internal server error.");
        }
    }
});
exports.getFile = getFile;
// Function to download file
const downloadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, disableTokens_1.isTokenBlacklisted)(req.headers.authorization)) {
        res.status(401).send("token is blacklisted");
    }
    else {
        const { id } = req.params;
        try {
            const [file] = yield db_1.default
                .promise()
                .query("SELECT * FROM files WHERE id = ?", [id]);
            if (file.length === 0) {
                return res
                    .status(404)
                    .send({ success: false, message: "File not found." });
            }
            const fileName = file[0].filename;
            const filePath = path_1.default.join(__dirname, "../../uploads/", fileName);
            const file_name = file[0].file_name;
            if (!fs_1.default.existsSync(filePath)) {
                return res
                    .status(404)
                    .send({ success: false, message: "File not found on server." });
            }
            console.log(filePath);
            res.download(filePath, file_name);
        }
        catch (err) {
            console.error("Error downloading file:", err);
            res.status(500).send("Internal server error.");
        }
    }
});
exports.downloadFile = downloadFile;
// Function to update file
const updateFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req);
    console.log(req.file);
    console.log(req.headers);
    if ((0, disableTokens_1.isTokenBlacklisted)(req.headers.authorization)) {
        res.status(401).send("token is blacklisted");
    }
    else {
        const { id } = req.params;
        const { file } = req;
        const { originalname, mimetype, size, filename } = file;
        try {
            // Fetch the existing file record
            const [existingFile] = yield db_1.default
                .promise()
                .query("SELECT * FROM files WHERE id = ?", [id]);
            if (existingFile.length === 0) {
                return res
                    .status(404)
                    .send({ success: false, message: "File not found." });
            }
            // Delete the old file from the filesystem
            const oldFilePath = path_1.default.join(__dirname, "../../uploads/", existingFile[0].filename);
            if (fs_1.default.existsSync(oldFilePath)) {
                fs_1.default.unlinkSync(oldFilePath);
            }
            // Update the file record in the database
            const query = `
        UPDATE files 
        SET file_name = ?, file_extension = ?, mime_type = ?, file_size = ?, filename = ?, upload_date = CURRENT_TIMESTAMP 
        WHERE id = ?`;
            yield db_1.default
                .promise()
                .query(query, [
                originalname,
                path_1.default.extname(originalname),
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
        }
        catch (err) {
            console.error("Error updating file:", err);
            res.status(500).send("Internal server error.");
        }
    }
});
exports.updateFile = updateFile;
