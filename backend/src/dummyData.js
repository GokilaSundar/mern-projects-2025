import dotenv from "dotenv";
import mongoose from "mongoose";

import { Book } from "./models/Book.js";

dotenv.config();

const books = [
  {
    title: "The Winds of Eternity",
    author: "Dan Brown",
    description:
      "An enthralling narrative of hidden treasures, blending past and future.",
    year: 2018,
    price: 28.58,
  },
  {
    title: "Shadows of the Forgotten",
    author: "Ursula K. Le Guin",
    description:
      "An enthralling narrative of hidden treasures, blending past and future.",
    year: 1998,
    price: 38.84,
  },
  {
    title: "Echoes of the Void",
    author: "Brandon Sanderson",
    description:
      "An enthralling narrative of hidden treasures, blending past and future.",
    year: 2009,
    price: 10.31,
  },
  {
    title: "Chronicles of Dawn",
    author: "Margaret Atwood",
    description:
      "In the heart of a forgotten island, secrets unravel as destinies collide.",
    year: 2025,
    price: 30.26,
  },
  {
    title: "The Final Hour",
    author: "Arthur C. Clarke",
    description:
      "In the heart of a forgotten island, secrets unravel as destinies collide.",
    year: 1998,
    price: 42.87,
  },
  {
    title: "Legacy of the Lost",
    author: "Neil Gaiman",
    description:
      "In the heart of a forgotten island, secrets unravel as destinies collide.",
    year: 2002,
    price: 35.64,
  },
  {
    title: "Path of Destiny",
    author: "Douglas Adams",
    description:
      "An enthralling narrative of hidden treasures, blending past and future.",
    year: 2004,
    price: 37.12,
  },
  {
    title: "Whispers of the Forest",
    author: "Margaret Atwood",
    description:
      "An enthralling narrative of hidden treasures, blending past and future.",
    year: 2019,
    price: 39.4,
  },
  {
    title: "The Celestial Key",
    author: "C.S. Lewis",
    description:
      "The story follows a fierce warrior as they navigate a battle for survival.",
    year: 2019,
    price: 18.05,
  },
  {
    title: "Fires of Rebellion",
    author: "Margaret Atwood",
    description:
      "A gripping tale of redemption set in a post-apocalyptic world.",
    year: 1998,
    price: 40.68,
  },
  {
    title: "Tales of the Wanderer",
    author: "George R.R. Martin",
    description:
      "The story follows a fierce warrior as they navigate a battle for survival.",
    year: 1991,
    price: 31.3,
  },
  {
    title: "The Alchemist's Secret",
    author: "George R.R. Martin",
    description:
      "A gripping tale of redemption set in a post-apocalyptic world.",
    year: 2024,
    price: 24.91,
  },
  {
    title: "Edge of Tomorrow",
    author: "Stephen King",
    description:
      "A gripping tale of redemption set in a post-apocalyptic world.",
    year: 2014,
    price: 37.24,
  },
  {
    title: "The Starlit Journey",
    author: "Eoin Colfer",
    description:
      "In the heart of a forgotten island, secrets unravel as destinies collide.",
    year: 2012,
    price: 18.77,
  },
  {
    title: "Song of the Sea",
    author: "Arthur C. Clarke",
    description:
      "The story follows a fierce warrior as they navigate a battle for survival.",
    year: 1998,
    price: 32.45,
  },
  {
    title: "The Architect's Dream",
    author: "Tolkien",
    description:
      "The story follows a fierce warrior as they navigate a battle for survival.",
    year: 2001,
    price: 47.88,
  },
  {
    title: "Guardians of the Flame",
    author: "Philip K. Dick",
    description:
      "An enthralling narrative of hidden treasures, blending past and future.",
    year: 2012,
    price: 46.2,
  },
  {
    title: "The Infinite Spiral",
    author: "Rick Riordan",
    description:
      "An enthralling narrative of hidden treasures, blending past and future.",
    year: 2006,
    price: 13.75,
  },
  {
    title: "Curse of the Ancient",
    author: "Brandon Sanderson",
    description:
      "A gripping tale of redemption set in a post-apocalyptic world.",
    year: 2025,
    price: 49.36,
  },
  {
    title: "Beyond the Horizon",
    author: "Orson Scott Card",
    description:
      "A gripping tale of redemption set in a post-apocalyptic world.",
    year: 1993,
    price: 23.79,
  },
  {
    title: "Heart of the Storm",
    author: "Terry Pratchett",
    description:
      "A gripping tale of redemption set in a post-apocalyptic world.",
    year: 1993,
    price: 31.89,
  },
  {
    title: "Rise of the Phoenix",
    author: "Arthur C. Clarke",
    description:
      "In the heart of a forgotten island, secrets unravel as destinies collide.",
    year: 1992,
    price: 48.75,
  },
  {
    title: "The Eternal Bond",
    author: "Stephen King",
    description:
      "A gripping tale of redemption set in a post-apocalyptic world.",
    year: 2003,
    price: 12.93,
  },
  {
    title: "War of Shadows",
    author: "Ursula K. Le Guin",
    description:
      "A gripping tale of redemption set in a post-apocalyptic world.",
    year: 2010,
    price: 41.09,
  },
  {
    title: "Secrets of the Forgotten Island",
    author: "Terry Pratchett",
    description:
      "The story follows a fierce warrior as they navigate a battle for survival.",
    year: 2007,
    price: 46.74,
  },
  {
    title: "Daughters of the Moon",
    author: "C.S. Lewis",
    description:
      "In the heart of a forgotten island, secrets unravel as destinies collide.",
    year: 1999,
    price: 21.94,
  },
  {
    title: "Embers of Fate",
    author: "Dan Brown",
    description:
      "In the heart of a forgotten island, secrets unravel as destinies collide.",
    year: 1992,
    price: 48.52,
  },
  {
    title: "The Silent Blade",
    author: "Suzanne Collins",
    description:
      "In the heart of a forgotten island, secrets unravel as destinies collide.",
    year: 2006,
    price: 39.49,
  },
  {
    title: "The Lost Chronicles",
    author: "Stephen King",
    description:
      "In the heart of a forgotten island, secrets unravel as destinies collide.",
    year: 2004,
    price: 23.49,
  },
  {
    title: "Threads of Silver",
    author: "Neil Gaiman",
    description:
      "The story follows a fierce warrior as they navigate a battle for survival.",
    year: 2012,
    price: 35.47,
  },
  {
    title: "The Enchanted Garden",
    author: "Dan Brown",
    description:
      "In the heart of a forgotten island, secrets unravel as destinies collide.",
    year: 2018,
    price: 32.66,
  },
  {
    title: "Veil of Illusions",
    author: "Tolkien",
    description:
      "The story follows a fierce warrior as they navigate a battle for survival.",
    year: 1995,
    price: 15.51,
  },
  {
    title: "The Clockmaker's Apprentice",
    author: "Agatha Christie",
    description:
      "A gripping tale of redemption set in a post-apocalyptic world.",
    year: 2022,
    price: 25.49,
  },
  {
    title: "Wings of Freedom",
    author: "Terry Pratchett",
    description:
      "A gripping tale of redemption set in a post-apocalyptic world.",
    year: 2004,
    price: 17.35,
  },
  {
    title: "The Forgotten Prophecy",
    author: "Brandon Sanderson",
    description:
      "An enthralling narrative of hidden treasures, blending past and future.",
    year: 2012,
    price: 31.61,
  },
  {
    title: "The Timekeeper's Saga",
    author: "Philip K. Dick",
    description:
      "A gripping tale of redemption set in a post-apocalyptic world.",
    year: 2020,
    price: 25.54,
  },
  {
    title: "Mysteries of the Abyss",
    author: "Brandon Sanderson",
    description:
      "An enthralling narrative of hidden treasures, blending past and future.",
    year: 2000,
    price: 11.33,
  },
  {
    title: "A Light in the Darkness",
    author: "Isaac Asimov",
    description:
      "An enthralling narrative of hidden treasures, blending past and future.",
    year: 1995,
    price: 31.79,
  },
  {
    title: "The Crystal Realm",
    author: "Eoin Colfer",
    description:
      "An enthralling narrative of hidden treasures, blending past and future.",
    year: 1991,
    price: 26.9,
  },
  {
    title: "The Mark of Truth",
    author: "Agatha Christie",
    description:
      "The story follows a fierce warrior as they navigate a battle for survival.",
    year: 1993,
    price: 12.39,
  },
  {
    title: "The Serpent's Wrath",
    author: "Douglas Adams",
    description:
      "The story follows a fierce warrior as they navigate a battle for survival.",
    year: 2021,
    price: 37.66,
  },
  {
    title: "The Dark Labyrinth",
    author: "Rick Riordan",
    description:
      "In the heart of a forgotten island, secrets unravel as destinies collide.",
    year: 2002,
    price: 43.35,
  },
  {
    title: "The Relic Hunter",
    author: "Stephen King",
    description:
      "The story follows a fierce warrior as they navigate a battle for survival.",
    year: 1998,
    price: 45.44,
  },
  {
    title: "The Midnight Library",
    author: "Rick Riordan",
    description:
      "An enthralling narrative of hidden treasures, blending past and future.",
    year: 2001,
    price: 25.81,
  },
  {
    title: "The Wandering Mage",
    author: "Ursula K. Le Guin",
    description:
      "An enthralling narrative of hidden treasures, blending past and future.",
    year: 2011,
    price: 44.36,
  },
  {
    title: "A Song for Tomorrow",
    author: "Rick Riordan",
    description:
      "The story follows a fierce warrior as they navigate a battle for survival.",
    year: 1998,
    price: 34.42,
  },
  {
    title: "The Last Oracle",
    author: "Eoin Colfer",
    description:
      "An enthralling narrative of hidden treasures, blending past and future.",
    year: 2018,
    price: 22.79,
  },
  {
    title: "Dreams of Infinity",
    author: "Neil Gaiman",
    description:
      "An enthralling narrative of hidden treasures, blending past and future.",
    year: 2006,
    price: 29.73,
  },
  {
    title: "Echoes of the Sea",
    author: "Douglas Adams",
    description:
      "The story follows a fierce warrior as they navigate a battle for survival.",
    year: 1997,
    price: 41.48,
  },
  {
    title: "Kingdom of Glass",
    author: "Philip K. Dick",
    description:
      "The story follows a fierce warrior as they navigate a battle for survival.",
    year: 1991,
    price: 23.12,
  },
  {
    title: "The Warlock's Pact",
    author: "C.S. Lewis",
    description:
      "In the heart of a forgotten island, secrets unravel as destinies collide.",
    year: 2005,
    price: 34.43,
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    Book.insertMany(books)
      .then(() => {
        console.log("Inserted books");
      })
      .catch((error) => {
        console.error("Failed to insert books", error);
      });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });
