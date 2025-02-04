import cors from "cors";
import dotenv from "dotenv";
import { existsSync } from "fs";
import express from "express";
import mongoose from "mongoose";
import { join } from "path";

import { DiaryEntry } from "./models/DiaryEntry.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/entry/:date", async (req, res) => {
  const { date } = req.params;
  const entry = await DiaryEntry.findOne({ date });
  res.send(entry);
});

app.post("/api/entry/:date", async (req, res) => {
  const { date } = req.params;
  const { notes } = req.body;

  let entry = await DiaryEntry.findOne({ date });

  if (entry) {
    entry.notes = notes;
  } else {
    entry = new DiaryEntry({ date, notes });
  }

  await entry.save();

  res.send(entry);
});

app.delete("/api/entry/:date", async (req, res) => {
  const { date } = req.params;
  const entry = await DiaryEntry.findOneAndDelete({ date });
  res.send(entry);
});

app.get("/api/dates", async (req, res) => {
  const search = req.query.search;

  // Search notes in the DiaryEntry collection
  const dates = await DiaryEntry.find(
    search ? { notes: { $regex: new RegExp(search, "i") } } : {}
  ).distinct("date");

  res.send(dates);
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
