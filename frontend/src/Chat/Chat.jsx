import "./Chat.css";

import axios from "axios";
import PropTypes from "prop-types";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";

export const Chat = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef();

  const latestMessageId = useMemo(() => {
    if (messages.length === 0) {
      return null;
    }

    return messages[messages.length - 1]._id;
  }, [messages]);

  const handleSend = useCallback(async (e) => {
    e.preventDefault();

    const message = e.target[0].value;

    if (!message) {
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/messages", {
        message,
      });

      e.target[0].value = "";
    } catch (err) {
      setError(`Failed to send message: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      setLoading(true);

      await axios.post("/api/logout");

      window.location.reload();
    } catch (err) {
      setError(`Failed to logout: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEdit = useCallback(async (e) => {
    const id = e.target.getAttribute("data-id");

    const message = prompt("Edit message:");

    if (!message) {
      return;
    }

    try {
      setLoading(true);

      await axios.put(`/api/messages/${id}`, {
        message,
      });
    } catch (err) {
      setError(`Failed to edit message: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (e) => {
    const id = e.target.getAttribute("data-id");

    if (!confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      setLoading(true);

      await axios.delete(`/api/messages/${id}`);
    } catch (err) {
      setError(`Failed to delete message: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);

    abortControllerRef.current = new AbortController();

    axios
      .get("/api/messages", {
        signal: abortControllerRef.current.signal,
      })
      .then((response) => {
        setError(null);
        setMessages(response.data);

        setLoading(false);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          setError(`Failed to load messages: ${err.message}`);
          setLoading(false);
        }
      });

    const socket = io();

    socket.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("editMessage", (message) => {
      setMessages((prevMessages) =>
        prevMessages.map((m) => (m._id === message._id ? message : m))
      );
    });

    socket.on("deleteMessage", (messageId) => {
      setMessages((prevMessages) =>
        prevMessages.filter((m) => m._id !== messageId)
      );
    });

    return () => {
      abortControllerRef.current.abort();
      socket.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    if (!latestMessageId) {
      return;
    }

    const message = document.getElementById(latestMessageId);

    if (!message) {
      return;
    }

    message.scrollIntoView({ behavior: "smooth" });
  }, [latestMessageId]);

  return (
    <div className="chat-container">
      <div className="header">
        <div className="user">
          Logged in as <strong className="name">{user.name}</strong>{" "}
          <i>({user.email})</i>
        </div>

        <button onClick={handleLogout}>Logout</button>
      </div>

      {loading && <div className="loading-overlay">Loading...</div>}
      {error && <div className="error-overlay">{error}</div>}

      <div className="messages">
        {messages.map((message) => (
          <div
            key={message._id}
            id={message._id}
            className={`message ${
              message.userId === user._id ? "sent" : "received"
            }`}
          >
            <div className="meta">
              <strong className="name">{message.name}</strong>
              {message.userId === user._id && (
                <div className="actions">
                  <button
                    data-id={message._id}
                    title="Edit message"
                    onClick={handleEdit}
                  >
                    &#9999;
                  </button>
                  <button
                    data-id={message._id}
                    title="Delete message"
                    onClick={handleDelete}
                  >
                    &#10006;
                  </button>
                </div>
              )}
            </div>
            <code className="message">{message.message}</code>
            <div className="time">
              <span className="time">
                {new Date(message.createdAt).toLocaleString()}
              </span>
              {message.createdAt !== message.updatedAt && (
                <span className="time">
                  <i>Edited: {new Date(message.updatedAt).toLocaleString()}</i>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <form className="new-message" onSubmit={handleSend}>
        <input type="text" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

Chat.propTypes = {
  user: PropTypes.object.isRequired,
};
