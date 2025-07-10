import { Model, Types } from "mongoose";

export interface IBorrow {
  book: Types.ObjectId;
  quantity: number;
  dueDate: Date;
}

export interface BorrowModelType extends Model<IBorrow> {
  updateAvailable(number: number): boolean;
}
