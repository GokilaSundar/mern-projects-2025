import mongoose from "mongoose";

export const diaryEntrySchema = new mongoose.Schema({
  date: {
    type: String,
    unique: true,
    required: true,
  },
  notes: {
    type: String,
  },
});

export const DiaryEntry = mongoose.model(
  "DiaryEntry",
  diaryEntrySchema,
  "entries"
);
