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

const POLLING_INTERVAL = 2000;

export const Chat = ({ name }) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef();
  const intervalRef = useRef();

  const latestMessageId = useMemo(() => {
    if (messages.length === 0) {
      return null;
    }

    return messages[messages.length - 1]._id;
  }, [messages]);

  const handleSend = useCallback(
    async (e) => {
      e.preventDefault();

      const message = e.target[0].value;

      if (!message) {
        return;
      }

      try {
        setLoading(true);

        await axios.post("/api/messages", {
          name,
          message,
        });

        e.target[0].value = "";
      } catch (err) {
        setError(`Failed to send message: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [name]
  );

  const handleEdit = useCallback(
    async (e) => {
      const id = e.target.getAttribute("data-id");

      const message = prompt("Edit message:");

      if (!message) {
        return;
      }

      try {
        setLoading(true);

        await axios.put(`/api/messages/${id}`, {
          name,
          message,
        });
      } catch (err) {
        setError(`Failed to edit message: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [name]
  );

  const handleDelete = useCallback(
    async (e) => {
      const id = e.target.getAttribute("data-id");

      if (!confirm("Are you sure you want to delete this message?")) {
        return;
      }

      try {
        setLoading(true);

        await axios.delete(`/api/messages/${id}`, {
          data: {
            name,
          },
        });
      } catch (err) {
        setError(`Failed to delete message: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [name]
  );

  useEffect(() => {
    if (!name) {
      return;
    }

    const poll = async () => {
      try {
        setLoading(true);

        abortControllerRef.current = new AbortController();

        const response = await axios.get("/api/messages", {
          signal: abortControllerRef.current.signal,
        });

        setError(null);
        setMessages(response.data);

        setLoading(false);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(`Failed to load messages: ${err.message}`);
          setLoading(false);
        }
      }
    };

    poll();

    intervalRef.current = setInterval(poll, POLLING_INTERVAL);

    return () => {
      clearInterval(intervalRef.current);
      abortControllerRef.current.abort();
    };
  }, [name]);

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
      {loading && <div className="loading-overlay">Loading...</div>}
      {error && <div className="error-overlay">{error}</div>}

      <div className="messages">
        {messages.map((message) => (
          <div
            key={message._id}
            id={message._id}
            className={`message ${message.name === name ? "sent" : "received"}`}
          >
            <div className="meta">
              <strong className="name">{message.name}</strong>
              {message.name === name && (
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
  name: PropTypes.string,
};
