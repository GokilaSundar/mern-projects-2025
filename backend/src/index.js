import bcrypt from "bcryptjs";
import cookie from "cookie";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { existsSync } from "fs";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { join } from "path";
import { Server } from "socket.io";

import { Message } from "./models/Message.js";
import { User } from "./models/User.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "SecretPassword@123";

const socketConnections = {};

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).send({
      message: "Name, email, and password are required",
    });
    return;
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400).send({
      message: "User already exists",
    });
    return;
  }

  const encryptedPassword = bcrypt.hashSync(password, 10);

  const newUser = new User({
    name,
    email,
    password: encryptedPassword,
  });

  await newUser.save();

  const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);

  res.cookie("token", token).send({
    _id: newUser._id,
    name: newUser.name,
    email: newUser,
  });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({
      message: "Email and password are required",
    });
    return;
  }

  const user = await User.findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    res.status(401).send({
      message: "Invalid email or password",
    });
    return;
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);

  res.cookie("token", token).send({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});

app.use("/api", (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).send({
      message: "Unauthorized!",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.userId = decoded.userId;

    next();
  } catch (err) {
    console.error("Failed to authenticate token", err);

    res.status(401).send({
      message: "Invalid token!",
    });
  }
});

app.get("/api/me", async (req, res) => {
  const userId = req.userId;

  const user = await User.findOne({
    _id: userId,
  });

  if (!user) {
    res.status(404).send({
      message: "User not found",
    });
    return;
  }

  res.send({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});

app.post("/api/logout", (_, res) => {
  res.clearCookie("token").send({
    message: "Logged out",
  });
});

app.post("/api/messages", async (req, res) => {
  const { message } = req.body;
  const userId = req.userId;

  if (!message) {
    res.status(400).send("Message is required");
    return;
  }

  const now = new Date();

  const newMessage = new Message({
    userId,
    message,
    createdAt: now,
    updatedAt: now,
  });

  await newMessage.save();

  // Load user to get name and add it to the message as "name"
  const user = await User.findOne({
    _id: userId,
  });

  io.emit("newMessage", {
    ...newMessage.toObject(),
    name: user.name,
  });

  res.status(201).send(newMessage);
});

app.put("/api/messages/:id", async (req, res) => {
  const { message } = req.body;
  const userId = req.userId;

  if (!message) {
    res.status(400).send("Name and message are required");
    return;
  }

  const messageToUpdate = await Message.findOne({ _id: req.params.id, userId });

  if (!messageToUpdate) {
    res.status(404).send("Message not found");
    return;
  }

  messageToUpdate.message = message;
  messageToUpdate.updatedAt = Date.now();

  await messageToUpdate.save();

  const user = await User.findOne({
    _id: userId,
  });

  messageToUpdate.name = user.name;

  io.emit("editMessage", {
    ...messageToUpdate.toObject(),
    name: user.name,
  });

  res.send(messageToUpdate);
});

app.delete("/api/messages/:id", async (req, res) => {
  const userId = req.userId;

  const messageToDelete = await Message.findOne({ _id: req.params.id, userId });

  if (!messageToDelete) {
    res.status(404).send("Message not found");
    return;
  }

  await messageToDelete.deleteOne();

  io.emit("deleteMessage", req.params.id);

  res.send({
    message: "Message deleted",
  });
});

app.get("/api/messages", async (_, res) => {
  const messages = await Message.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: 1,
        userId: 1,
        message: 1,
        createdAt: 1,
        updatedAt: 1,
        name: "$user.name",
      },
    },
  ]);

  res.send(messages);
});

io.on("connection", (socket) => {
  try {
    const token = cookie.parse(socket.handshake.headers.cookie).token;

    if (!token) {
      socket.disconnect();
      return;
    }

    const userId = jwt.verify(token, JWT_SECRET).userId;

    socketConnections[socket.id] = userId;

    io.emit(
      "onlineUsers",
      Object.values(socketConnections).filter(
        (value, index, array) => array.indexOf(value) === index
      )
    );

    console.log("User connected", userId);

    socket.on("disconnect", () => {
      delete socketConnections[socket.id];

      io.emit(
        "onlineUsers",
        Object.values(socketConnections).filter(
          (value, index, array) => array.indexOf(value) === index
        )
      );

      console.log("User disconnected", userId);
    });
  } catch (err) {
    console.error("Failed to authenticate token", err);

    if (socket.connected) {
      socket.disconnect();
    }
  }
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

  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
