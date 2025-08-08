import express from "express";
import pool from "../db";
import multer from "multer";
import path from "path";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

// GET all bookings
router.get("/", verifyToken,async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bookings ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST new booking
router.post("/", async (req, res) => {
  const { name, email, phone, preferred_time, call_type, status } = req.body;

  if (!name || !email || !phone || !preferred_time || !call_type || !status) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO bookings (name, email, phone, preferred_time, call_type, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, email, phone, preferred_time, call_type, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error saving booking:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT update booking status
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ message: "Status is required" });

  try {
    await pool.query("UPDATE bookings SET status = $1 WHERE id = $2", [status, id]);
    res.json({ message: "Status updated" });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST upload case sheet
router.post("/:id/casesheet", upload.single("file"), async (req, res) => {
  const bookingId = req.params.id;
  const file = req.file;

  if (!file) return res.status(400).json({ message: "No file uploaded" });

  const publicUrl = `http://localhost:5000/uploads/${file.filename}`;

  try {
    await pool.query("UPDATE bookings SET case_sheet_url = $1 WHERE id = $2", [publicUrl, bookingId]);
    res.json({ message: "File uploaded successfully", case_sheet_url: publicUrl });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Error saving file URL to database" });
  }
});

export default router;
