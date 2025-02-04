import { useState } from "react";
import "./App.css";
import { DateSelector } from "./DateSelector/DateSelector";
import { DiaryEntry } from "./DiaryEntry/DiaryEntry";

export const App = () => {
  const [date, setDate] = useState("");
  const [dates, setDates] = useState([]);

  return (
    <>
      <DateSelector
        date={date}
        setDate={setDate}
        dates={dates}
        setDates={setDates}
      />
      <DiaryEntry date={date} setDate={setDate} setDates={setDates} />
    </>
  );
};
