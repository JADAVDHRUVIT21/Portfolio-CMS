const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const pool = require("./db");
const authenticateToken = require("./authMiddleware");

const app = express();

// Upload directory
const uploadDirectory = path.join(
  __dirname,
  "..",
  "backend",
  "uploads"
);

// Create upload directory if it does not exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use(
  "/uploads",
  express.static(uploadDirectory)
);

// Swagger documentation
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// Multer upload configuration
const upload = multer({
  storage: storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: function (req, file, cb) {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPEG, PNG, WEBP, and GIF images are allowed"
        )
      );
    }
  },
});

// Health check
/**
 * @swagger
 * /:
 *   get:
 *     summary: Check upload service status
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Upload service is running
 */
app.get("/", (req, res) => {
  res.json({
    message: "Portfolio CMS Multer Upload Service is running",
  });
});

// Upload image
/**
 * @swagger
 * /upload/image:
 *   post:
 *     summary: Upload an image
 *     description: Upload an image using a valid Bearer access token. Supported formats are JPEG, PNG, WEBP, and GIF. Maximum file size is 5 MB.
 *     tags:
 *       - Upload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *       400:
 *         description: Invalid file, no file uploaded, or file exceeds 5 MB
 *       401:
 *         description: Missing or invalid authentication token
 *       500:
 *         description: Failed to save media information
 */
app.post(
  "/upload/image",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        detail: "No image file uploaded",
      });
    }

    try {
      const fileUrl = `/uploads/${req.file.filename}`;

      const result = await pool.query(
        `
        INSERT INTO media (
          filename,
          original_filename,
          file_url,
          file_type,
          file_size
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
          id,
          filename,
          original_filename,
          file_url,
          file_type,
          file_size,
          created_at
        `,
        [
          req.file.filename,
          req.file.originalname,
          fileUrl,
          req.file.mimetype,
          req.file.size,
        ]
      );

      const media = result.rows[0];

      return res.status(201).json({
        message: "Image uploaded successfully",
        id: media.id,
        filename: media.filename,
        original_filename: media.original_filename,
        file_url: media.file_url,
        file_type: media.file_type,
        file_size: media.file_size,
        created_at: media.created_at,
      });
    } catch (error) {
      console.error("Database insert error:", error);

      // Remove uploaded file if database insertion fails
      try {
        if (
          req.file &&
          req.file.path &&
          fs.existsSync(req.file.path)
        ) {
          fs.unlinkSync(req.file.path);

          console.log(
            "Uploaded file removed after database error:",
            req.file.filename
          );
        }
      } catch (cleanupError) {
        console.error(
          "Failed to remove uploaded file after database error:",
          cleanupError
        );
      }

      return res.status(500).json({
        detail:
          "Image upload failed and the uploaded file was removed",
      });
    }
  }
);

// Multer error handler
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        detail: "Image size must not exceed 5 MB",
      });
    }

    return res.status(400).json({
      detail: error.message,
    });
  }

  if (error) {
    return res.status(400).json({
      detail: error.message,
    });
  }

  next();
});

// Server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `Upload service running on http://localhost:${PORT}`
  );
});