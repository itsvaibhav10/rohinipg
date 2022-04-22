const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Multer Orignal File Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.access('./uploads', (err) => {
      if (err) fs.mkdirSync('./uploads');
      cb(null, './uploads');
    });
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = file.mimetype === 'application/pdf' ? '.pdf' : '.webp';
    const fileName = file.fieldname + '-' + uniqueSuffix + ext;
    cb(null, fileName);
  },
});

// Type Filter For Book Cover
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = (app, dir) => {
  // Parsing Content
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(
    multer({ storage: storage, fileFilter: fileFilter }).fields([
      { name: 'pg_images', maxCount: 8 },
    ])
  );

  // Static Files Folder
  app.use(express.static(path.join(dir, 'public')));
  app.use('/uploads', express.static(path.join(dir, 'uploads')));
};
