import dotenv from "dotenv";
import mongoose from "mongoose";

import { DiaryEntry } from "./models/DiaryEntry.js";

dotenv.config();

const entries = [
  {
    date: "2025-02-04",
    notes:
      "Started learning about machine learning algorithms. Excited about neural networks!",
  },
  {
    date: "2025-02-03",
    notes:
      "Debugged a tricky issue in my Python project. Finally fixed it after hours of searching!",
  },
  {
    date: "2025-02-02",
    notes:
      "Attended a guest lecture on cybersecurity. Learned about ethical hacking techniques.",
  },
  {
    date: "2025-02-01",
    notes:
      "Worked on a group project for web development. Struggled with API integrations.",
  },
  {
    date: "2025-01-31",
    notes:
      "Practiced solving coding problems on LeetCode. Feeling more confident in data structures.",
  },
  {
    date: "2025-01-30",
    notes:
      "Explored new features in JavaScript ES6. Arrow functions are really useful!",
  },
  {
    date: "2025-01-29",
    notes:
      "Read a research paper on quantum computing. Fascinating but very complex.",
  },
  {
    date: "2025-01-28",
    notes:
      "Started writing a technical blog on database indexing. Hope to publish it soon.",
  },
  {
    date: "2025-01-27",
    notes:
      "Worked on my final year project. Implementing a chatbot using Python and NLP.",
  },
  {
    date: "2025-01-26",
    notes:
      "Prepared for my upcoming exams. Focused on operating systems and networking topics.",
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    DiaryEntry.deleteMany({})
      .then(() => {
        DiaryEntry.insertMany(entries)
          .then(() => {
            console.log("Inserted entries");
          })
          .catch((error) => {
            console.error("Failed to insert entries", error);
          });
      })
      .catch((error) => {
        console.error("Failed to delete entries", error);
      });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });
