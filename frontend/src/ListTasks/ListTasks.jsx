import "./ListTasks.css";

import axios from "axios";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";

const Task = ({ task, setTasks }) => {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState(task.description);

  const handleSave = async () => {
    try {
      setLoading(true);

      const response = await axios.put(`/api/tasks/${task._id}`, {
        description,
      });

      alert("Task saved");

      setTasks((tasks) =>
        tasks.map((t) => (t._id === task._id ? response.data : t))
      );
    } catch (err) {
      alert(`Failed to save task: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/tasks/${task._id}`);

      alert("Task deleted");

      setTasks((tasks) => tasks.filter((t) => t._id !== task._id));
    } catch (err) {
      alert(`Failed to delete task: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = useCallback(
    async (e) => {
      const status = e.target.value;

      try {
        setLoading(true);

        const response = await axios.put(`/api/tasks/${task._id}`, {
          description: task.description,
          status,
        });

        setTasks((tasks) =>
          tasks.map((t) => (t._id === task._id ? response.data : t))
        );
      } catch (err) {
        alert(`Failed to update status: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [task, setTasks]
  );

  return (
    <div className="task">
      <div className="description">
        <input
          type="text"
          disabled={loading}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button
          onClick={handleSave}
          disabled={loading || description == task.description}
        >
          Save
        </button>
      </div>
      <div className="labels-actions">
        <div className="labels">
          <label>Created at: {new Date(task.createdAt).toLocaleString()}</label>
          <label>Updated at: {new Date(task.updatedAt).toLocaleString()}</label>
        </div>
        <div className="actions">
          <select
            value={task.status}
            onChange={handleStatusChange}
            disabled={loading}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button onClick={handleDelete} disabled={loading}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

Task.propTypes = {
  task: PropTypes.object.isRequired,
  setTasks: PropTypes.func.isRequired,
};

const Tasks = ({ tasks, setTasks, status }) => {
  const items = useMemo(
    () => tasks.filter((task) => task.status === status),
    [tasks, status]
  );

  return (
    <div className="tasks">
      <h2>{status}</h2>
      <div className="scroll-container">
        {items.map((task) => (
          <Task key={task._id} task={task} setTasks={setTasks} />
        ))}
      </div>
    </div>
  );
};

Tasks.propTypes = {
  tasks: PropTypes.array.isRequired,
  setTasks: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
};

export const ListTasks = ({ tasks, setTasks, search, loading, setLoading }) => {
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);

        const response = await axios.get("/api/tasks", {
          params: {
            search,
          },
        });

        setTasks(response.data);
      } catch (err) {
        alert(`Failed to fetch tasks: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [search, setLoading, setTasks]);

  return (
    <div className="tasks-container">
      <Tasks tasks={tasks} setTasks={setTasks} status="Pending" />
      <Tasks tasks={tasks} setTasks={setTasks} status="In Progress" />
      <Tasks tasks={tasks} setTasks={setTasks} status="Completed" />

      {loading && <div className="loading">Loading...</div>}
    </div>
  );
};

ListTasks.propTypes = {
  tasks: PropTypes.array.isRequired,
  setTasks: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
};
