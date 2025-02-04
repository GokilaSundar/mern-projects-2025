import "./App.css";

import { useState } from "react";

import { Chat } from "./Chat/Chat";

export const App = () => {
  const [name, setName] = useState(() => localStorage.getItem("name") || "");

  if (!name) {
    const name = prompt("Enter your name");

    if (name) {
      localStorage.setItem("name", name);
      setName(name);
    }

    return <div className="enter-name">Enter your name to continue</div>;
  }

  return <Chat name={name} />;
};
