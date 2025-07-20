import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import bookRoutes from "./app/controllers/book.controller";
import borrowRoutes from "./app/controllers/borrow.controller";

const app: Application = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

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
