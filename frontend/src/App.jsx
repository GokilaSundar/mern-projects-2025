import "./App.css";

import { useEffect, useState } from "react";

import { Chat } from "./Chat/Chat";
import axios from "axios";
import { Login } from "./Login/Login";
import { Register } from "./Register/Register";

export const App = () => {
  const [authenticating, setAuthenticating] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("/api/me")
      .then((response) => {
        setUser(response.data);
        setAuthenticating(false);
      })
      .catch((error) => {
        console.error("Failed to authenticate", error);

        setAuthenticating(false);
      });
  }, []);

  if (authenticating) {
    return <div className="auth-overlay">Authenticating...</div>;
  }

  if (!user) {
    return (
      <div className="auth-content">
        <Login setUser={setUser} />
        <Register setUser={setUser} />
      </div>
    );
  }

  return <Chat user={user} setUser={setUser} />;
};
