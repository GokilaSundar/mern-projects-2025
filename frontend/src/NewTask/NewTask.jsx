import "./NewTask.css";

import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";

export const NewTask = ({ onAdd }) => {
  const [loading, setLoading] = useState(false);

  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/tasks", {
        description,
      });

      alert(`Task created with ID ${response.data._id}`);

      setDescription("");

      onAdd(response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="new-task" onSubmit={handleSubmit}>
      <label htmlFor="description">Description:</label>
      <input
        id="description"
        type="text"
        disabled={loading}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        Add
      </button>
    </form>
  );
};

NewTask.propTypes = {
  onAdd: PropTypes.func.isRequired,
};
