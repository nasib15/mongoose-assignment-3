import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import bookRoutes from "./app/controllers/book.controller";
import borrowRoutes from "./app/controllers/borrow.controller";

const app: Application = express();

// Basic rate limiting for all routes (CodeQL js/missing-rate-limiting).
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://assignment-4-redux.vercel.app"],
  })
);

app.use("/api", bookRoutes);
app.use("/api", borrowRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Library Management API");
});

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `The requested URL is not valid`,
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    message: err.message || "Validation failed",
    success: false,
    error: err,
  });
});

export default app;
