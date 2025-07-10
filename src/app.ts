import express, { Application, Request, Response } from "express";
import bookRoutes from "./app/controllers/book.controller";
import borrowRoutes from "./app/controllers/borrow.controller";

const app: Application = express();

app.use(express.json());

app.use("/api", bookRoutes);
app.use("/api", borrowRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Library Management API");
});

export default app;
