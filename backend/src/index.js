import cors from "cors";
import dotenv from "dotenv";
import { existsSync } from "fs";
import express from "express";
import mongoose from "mongoose";
import { join } from "path";

import { Task } from "./models/Task.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/tasks", async (req, res) => {
  const { description } = req.body;

  const task = new Task({
    description,
    status: "Pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const createdTask = await task.save();

  res.status(201).json(createdTask);
});

app.put("/api/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    const { description, status } = req.body;

    task.description = description;
    task.status = status;
    task.updatedAt = new Date();

    const updatedTask = await task.save();

    res.json(updatedTask);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    await task.deleteOne();
    res.json({ message: "Task removed" });
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

app.get("/api/tasks", async (req, res) => {
  const search = req.query.search;

  const tasks = await Task.find(
    search ? { description: { $regex: search, $options: "i" } } : {}
  );

  res.json(tasks);
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
