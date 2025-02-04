import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { Message } from "./models/Message.js";
import { User } from "./models/User.js";

dotenv.config();

const rawMessages = [
  {
    name: "Neha Patel",
    message: "Hey guys, did you finish the Data Structures assignment?",
  },
  {
    name: "Aarav Sharma",
    message: "Not yet! The recursion part is really tricky.",
  },
  {
    name: "Priya Verma",
    message:
      "I found a great YouTube video explaining recursion. Want the link?",
  },
  {
    name: "Vikram Singh",
    message: "Yes, please! I\u2019m struggling with it too.",
  },
  {
    name: "Neha Patel",
    message: "Are we meeting tomorrow to discuss the final year project?",
  },
  {
    name: "Vikram Singh",
    message: "Yeah, let's meet in the library at 4 PM.",
  },
  {
    name: "Neha Patel",
    message: "I tried implementing a binary search tree in Python. Works well!",
  },
  {
    name: "Priya Verma",
    message: "Nice! Can you share the code? I want to compare it with mine.",
  },
  {
    name: "Vikram Singh",
    message: "Does anyone have the notes for last week's Algorithms lecture?",
  },
  {
    name: "Priya Verma",
    message: "Check the Google Drive folder. I uploaded my notes there.",
  },
  {
    name: "Aarav Sharma",
    message:
      "Guys, I just completed the frontend for our project. Check it out!",
  },
  {
    name: "Rohan Iyer",
    message: "Looks amazing! Now we just need to connect the backend.",
  },
  {
    name: "Priya Verma",
    message: "Should we use Firebase for authentication or build our own?",
  },
  {
    name: "Rohan Iyer",
    message: "Firebase is easier, but custom auth will be more flexible.",
  },
  {
    name: "Priya Verma",
    message: "I\u2019m thinking of writing a blog post on AI ethics. Thoughts?",
  },
  {
    name: "Aarav Sharma",
    message: "That's a great idea! AI bias is a trending topic right now.",
  },
  {
    name: "Neha Patel",
    message:
      "By the way, our networking professor said there's a surprise quiz tomorrow!",
  },
  {
    name: "Vikram Singh",
    message: "Oh no! I need to revise TCP/IP protocols now.",
  },
  {
    name: "Rohan Iyer",
    message: "I just deployed my first web app on AWS! Feels so cool.",
  },
  {
    name: "Priya Verma",
    message: "Awesome! Now you can help me deploy mine too!",
  },
];

const users = rawMessages
  .reduce((acc, { name }) => {
    if (!acc.includes(name)) {
      acc.push(name);
    }
    return acc;
  }, [])
  .map((name) => ({
    name,
    email: `${name.replace(/\s/g, ".").toLowerCase()}@gmail.com`,
    password: bcrypt.hashSync("Password@123", 10),
  }));

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }

  console.log("Connected to MongoDB");

  const startTime = Date.now() - rawMessages.length * 5000;

  try {
    await Message.deleteMany({});

    console.log("Deleted existing messages");
  } catch (error) {
    console.error("Failed to delete existing messages", error);
    process.exit(1);
  }

  try {
    await User.deleteMany({});

    console.log("Deleted existing users");
  } catch (error) {
    console.error("Failed to delete existing users", error);
    process.exit(1);
  }

  try {
    const userNameIdMap = (await User.insertMany(users)).reduce(
      (obj, user) => {
        obj[user.name] = user._id;
        return obj;
      },
      {}
    );

    console.log("Created users!");

    try {
      const messages = rawMessages.map((message, index, arr) => ({
        userId: userNameIdMap[message.name],
        message: message.message,
        createdAt: new Date(startTime + index * 5000),
        updatedAt:
          index === arr.length - 1
            ? new Date(startTime + index * 60000)
            : new Date(startTime + index * 5000),
      }));

      await Message.insertMany(messages);

      console.log("Created messages!");

      process.exit(0);
    } catch (error) {
      console.error("Failed to create messages", error);
      process.exit(1);
    }
  } catch (error) {
    console.error("Failed to create users", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Failed to create dummy data", error);
  process.exit(1);
});
