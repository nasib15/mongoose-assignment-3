import express, { Request, Response } from "express";
import * as z from "zod";
import { Book } from "../models/books.model";

const bookRoutes = express.Router();

const CreateBookZodSchema = z.object({
  title: z.string().min(3),
  author: z.string().min(3),
  genre: z
    .enum([
      "FICTION",
      "NON_FICTION",
      "SCIENCE",
      "HISTORY",
      "BIOGRAPHY",
      "FANTASY",
    ])
    .default("FICTION"),
  isbn: z.string().min(10),
  description: z.string().min(10),
  copies: z.number().min(1),
  available: z.boolean().default(true),
});

const PatchBookZodSchema = z.object({
  title: z.string().min(3),
  author: z.string().min(3),
  genre: z
    .enum([
      "FICTION",
      "NON_FICTION",
      "SCIENCE",
      "HISTORY",
      "BIOGRAPHY",
      "FANTASY",
    ])
    .default("FICTION"),
  isbn: z.string().min(10),
  description: z.string().min(10),
  copies: z.number().min(1),
  available: z.boolean().default(true),
});

bookRoutes.post("/books", async (req: Request, res: Response) => {
  try {
    const bookData = await CreateBookZodSchema.parseAsync(req.body);

    const book = await Book.create(bookData);
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create book",
      error: error,
    });
  }
});

bookRoutes.get("/books", async (req: Request, res: Response) => {
  try {
    const {
      filter,
      sort = "asc",
      sortBy = "createdAt",
      limit = 10,
      page = 1,
    } = req.query;
    const limitNumber = Number(limit);
    const pageNumber = Number(page);
    const skip = (pageNumber - 1) * limitNumber;
    let query: any = {};

    if (filter) {
      query.genre = filter;
    }

    const totalBooks = await Book.countDocuments(query);

    const books = await Book.find(query)
      .sort({
        [sortBy as string]: sort === "asc" ? 1 : -1,
      })
      .limit(limitNumber)
      .skip(skip);

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
      meta: {
        totalPages: Math.ceil(totalBooks / limitNumber),
        totalItems: totalBooks,
        currentPage: pageNumber,
        totalItemsPerPage: limitNumber,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error retrieving books details",
      error: error,
    });
  }
});

bookRoutes.get("/books/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error retrieving book details",
      error: error,
    });
  }
});

bookRoutes.put("/books/:bookId", async (req: Request, res: Response) => {
  try {
    const updateBookData = await PatchBookZodSchema.parseAsync(req.body);
    const { bookId } = req.params;

    const response = await Book.findByIdAndUpdate(bookId, updateBookData, {
      new: true,
    });

    res.status(201).json({
      success: true,
      message: "Book updated successfully",
      data: response,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update the book details",
      error: error,
    });
  }
});

bookRoutes.delete("/books/:bookId", async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;

    await Book.findByIdAndDelete(bookId);

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete book details",
      error: error,
    });
  }
});

export default bookRoutes;
