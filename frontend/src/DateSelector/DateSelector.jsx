import "./DateSelector.css";

import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

export const DateSelector = ({ date, setDate, dates, setDates }) => {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);

    const abortController = new AbortController();

    axios
      .get("/api/dates", {
        signal: abortController.signal,
        params: {
          search,
        },
      })
      .then((response) => {
        setDates(response.data);

        setLoading(false);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          alert(`Failed to load dates: ${err.message}`);
          setLoading(false);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [search, setDates]);

  return (
    <div className="date-selector">
      <div className="date-picker">
        <label htmlFor="date">Date:</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search entries..."
      />
      <ul className="entries">
        {dates.map((d) => (
          <li
            key={d}
            className={date === d ? "selected" : ""}
            onClick={() => setDate(d)}
          >
            {d}
          </li>
        ))}

        {loading && <div className="loading">Loading...</div>}
      </ul>
    </div>
  );
};

DateSelector.propTypes = {
  date: PropTypes.string.isRequired,
  setDate: PropTypes.func.isRequired,
  dates: PropTypes.array.isRequired,
  setDates: PropTypes.func.isRequired,
};
