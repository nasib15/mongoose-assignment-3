import express, { Request, Response } from "express";
import { Book } from "../models/books.model";
import { Borrow } from "../models/borrow.model";

const borrowRoutes = express.Router();

borrowRoutes.post("/borrow", async (req: Request, res: Response) => {
  // get id of book
  const borrowData = req.body;
  const bookId = borrowData.book;

  // get book data
  const bookData = await Book.findById(bookId);

  // check if the requested quantity is bigger than the available copies
  if ((bookData?.copies as number) >= borrowData.quantity) {
    const bookResponse = await Book.findByIdAndUpdate(
      bookId,
      { $inc: { copies: -borrowData.quantity } },
      { new: true }
    );

    const bookCopiesAvailable = bookResponse?.copies;

    const borrowResponse = Borrow.updateAvailable(
      bookCopiesAvailable as number
    );

    if (!borrowResponse) {
      await Book.findByIdAndUpdate(bookId, {
        available: false,
      });
    }

    const insertResponse = await Borrow.insertOne(borrowData);

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: insertResponse,
    });
  }

  res.json({
    success: false,
    message: "The requested quantity is bigger than the available copies",
  });
});

borrowRoutes.get("/borrow", async (req: Request, res: Response) => {
  const result = await Borrow.aggregate([
    {
      $group: { _id: "$book", totalQuantity: { $sum: "$quantity" } },
    },
    {
      $lookup: {
        from: "books",
        localField: "_id",
        foreignField: "_id",
        as: "book",
      },
    },
    {
      $project: { _id: 0, book: { title: 1, isbn: 1 }, totalQuantity: 1 },
    },
    {
      $unwind: "$book",
    },
  ]);

  res.json({
    success: true,
    message: "Borrowed books summary retrieved successfully",
    data: result,
  });
});

export default borrowRoutes;
