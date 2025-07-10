import express, { Request, Response } from "express";
import { Book } from "../models/books.model";

const bookRoutes = express.Router();

bookRoutes.post("/books", async (req: Request, res: Response) => {
  const bookData = req.body;
  const book = await Book.create(bookData);
  res.status(201).json({
    success: true,
    message: "Book created successfully",
    data: book,
  });
});

bookRoutes.get("/books", async (req: Request, res: Response) => {
  const {
    filter,
    sort = "asc",
    sortBy = "createdAt",
    limit = "10",
  } = req.query;
  const limitNumber = Number(limit);
  let query: any = {};

  if (filter) {
    query.genre = filter;
  }

  const books = await Book.find(query)
    .sort({
      [sortBy as string]: sort === "asc" ? 1 : -1,
    })
    .limit(limitNumber);

  res.status(200).json({
    success: true,
    message: "Books retrieved successfully",
    data: books,
  });
});

bookRoutes.get("/books/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const book = await Book.findById(id);

  res.status(200).json({
    success: true,
    message: "Book retrieved successfully",
    data: book,
  });
});

bookRoutes.put("/books/:bookId", async (req: Request, res: Response) => {
  const updateBookData = req.body;
  const { bookId } = req.params;

  const response = await Book.findByIdAndUpdate(bookId, updateBookData, {
    new: true,
  });

  res.status(201).json({
    success: true,
    message: "Book updated successfully",
    data: response,
  });
});

bookRoutes.delete("/books/:bookId", async (req: Request, res: Response) => {
  const { bookId } = req.params;

  await Book.findByIdAndDelete(bookId);

  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
    data: null,
  });
});

export default bookRoutes;
