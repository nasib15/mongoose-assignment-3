import { model, Schema } from "mongoose";
import { BorrowModelType, IBorrow } from "../interfaces/borrow.interfaces";

const borrowSchema = new Schema<IBorrow, BorrowModelType>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

borrowSchema.static(
  "updateAvailable",
  function updateAvailable(availableNumber) {
    if (availableNumber === 0) {
      return false;
    }

    return true;
  }
);

export const Borrow = model<IBorrow, BorrowModelType>("Borrow", borrowSchema);
