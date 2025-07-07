import dotenv from "dotenv";
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;

dotenv.config();

const PORT = 5000;

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    console.log("MongoDB is connected");

    server = app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  } catch (error: any) {
    console.log(`An error has happenned : ${error}`);
  }
}

main();
