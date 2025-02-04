import cors from "cors";
import dotenv from "dotenv";
import { existsSync } from "fs";
import express from "express";
import mongoose from "mongoose";
import { join } from "path";

import { Message } from "./models/Message.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/messages", async (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    res.status(400).send("Name and message are required");
    return;
  }

  const now = new Date();

  const newMessage = new Message({
    name,
    message,
    createdAt: now,
    updatedAt: now,
  });

  await newMessage.save();

  res.status(201).send(newMessage);
});

app.put("/api/messages/:id", async (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    res.status(400).send("Name and message are required");
    return;
  }

  const messageToUpdate = await Message.findOne({ _id: req.params.id, name });

  if (!messageToUpdate) {
    res.status(404).send("Message not found");
    return;
  }

  messageToUpdate.message = message;
  messageToUpdate.updatedAt = Date.now();

  await messageToUpdate.save();

  res.send(messageToUpdate);
});

app.delete("/api/messages/:id", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400).send("Name is required");
    return;
  }

  const messageToDelete = await Message.findOne({ _id: req.params.id, name });

  if (!messageToDelete) {
    res.status(404).send("Message not found");
    return;
  }

  await messageToDelete.deleteOne();

  res.send({
    message: "Message deleted",
  });
});

app.get("/api/messages", async (_, res) => {
  const messages = await Message.find();

  res.send(messages);
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
