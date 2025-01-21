import cors from "cors";
import dotenv from "dotenv";
import { existsSync } from "fs";
import express from "express";
import mongoose from "mongoose";
import { join } from "path";

import { Book } from "./models/Book.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/books", async (req, res) => {
  const { title, author, description, year, price } = req.body;

  const book = new Book({
    title,
    author,
    description,
    year,
    price,
  });

  const createdBook = await book.save();

  res.status(201).json(createdBook);
});

app.put("/api/books/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    const { title, author, description, year, price } = req.body;

    book.title = title;
    book.author = author;
    book.description = description;
    book.year = year;
    book.price = price;

    const updatedBook = await book.save();

    res.json(updatedBook);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

app.delete("/api/books/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    await book.deleteOne();
    res.json({ message: "Book removed" });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

app.get("/api/books", async (req, res) => {
  const search = req.query.search;

  let findOptions = {};

  if (search) {
    if (isNaN(search)) {
      findOptions = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { author: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    } else {
      const numberValue = Number(search);
      const searchRegex = new RegExp(search, "i");

      findOptions = {
        $or: [
          { title: searchRegex },
          { author: searchRegex },
          { description: searchRegex },
          { year: numberValue },
          { price: numberValue },
        ],
      };
    }
  }

  const books = await Book.find(findOptions);

  res.json(books);
});

async function main() {
  // #region For production deployment with frontend
  const publicPath = join(process.cwd(), "public");

  if (existsSync(publicPath)) {
    app.use(express.static(publicPath));

    app.get("*", (_, res) => {
      res.sendFile(join(publicPath, "index.html"));
    });
  } else {
    app.get("/", (_, res) => {
      res.send("API is running...");
    });
  }
  // #endregion

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
