import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bookingsRouter from "./routes/bookings";
import path from "path"
import emailRoutes from "./routes/emails";
import adminRouter from "./routes/admin"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/bookings", bookingsRouter);
app.use("/api/admin", adminRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api", emailRoutes);
