import dotenv from "dotenv";
import mongoose from "mongoose";

import { Task } from "./models/Task.js";

dotenv.config();

const tasks = [
  {
    description: "Complete the Data Structures assignment",
    status: "Pending",
  },
  {
    description: "Prepare for the Algorithms midterm",
    status: "Pending",
  },
  {
    description: "Debug the Python project code",
    status: "Pending",
  },
  {
    description: "Read the research paper on AI advancements",
    status: "Completed",
  },
  {
    description: "Finish the database normalization task",
    status: "Completed",
  },
  {
    description: "Participate in the coding challenge",
    status: "Pending",
  },
  {
    description: "Write a report on networking protocols",
    status: "Completed",
  },
  {
    description: "Develop a frontend for the web application",
    status: "Pending",
  },
  {
    description: "Test the REST API endpoints",
    status: "Completed",
  },
  {
    description: "Revise the operating systems lecture notes",
    status: "In Progress",
  },
];
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    Task.insertMany(
      tasks.map((task, index) => ({
        ...task,
        createdAt: new Date(Date.now() - index * 1000 * 60 * 60),
        updatedAt: new Date(
          Date.now() - index * 1000 * 60 * 60 + 1000 * 60 * 30
        ),
      }))
    )
      .then(() => {
        console.log("Inserted tasks");
      })
      .catch((error) => {
        console.error("Failed to insert tasks", error);
      });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });
