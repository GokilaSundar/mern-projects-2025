import "./App.css";

import { useState } from "react";
import { NewTask } from "./NewTask/NewTask";
import { ListTasks } from "./ListTasks/ListTasks";

export const App = () => {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");

  return (
    <>
      <NewTask onAdd={(task) => setTasks([...tasks, task])} />
      <input
        className="search"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />
      <ListTasks
        tasks={tasks}
        setTasks={setTasks}
        search={search}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  );
};
