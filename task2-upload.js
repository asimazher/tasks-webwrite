const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

// Connecting to MongoDB
const connectDb = async () => {
  try {
    const conn = await mongoose.connect("mongodb://127.0.0.1:27017/test");
    console.log(`Database connected at ${conn.connection.host}`);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

connectDb();

// Defining a file schema
const fileSchema = new mongoose.Schema({
  name: String,
  size: Number,
  path: String,
  contentType: String,
});

const File = mongoose.model("File", fileSchema);

// Setting up multer

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// file upload endpoint

app.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    // Saving file details to the database
    const newFile = new File({
      name: file.originalname,
      size: file.size,
      path: file.path,
      contentType: file.mimetype,
    });
    await newFile.save();

    res.json({ message: "File uploaded successfully.", file: newFile });
  } catch (error) {
    console.error("Error saving file details:", error);
    res
      .status(500)
      .json({ error: "An error occurred while saving file details." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
