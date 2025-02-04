import "./DiaryEntry.css";

import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const DiaryEntry = ({ date, setDate, setDates }) => {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");

  const handleSave = useCallback(async () => {
    setLoading(true);

    try {
      await axios.post(`/api/entry/${date}`, {
        notes,
      });

      alert("Diary entry saved");

      setDates((dates) => (dates.includes(date) ? dates : [...dates, date]));
    } catch (err) {
      alert(`Failed to save diary entry: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [date, notes, setDates]);

  const handleDelete = useCallback(async () => {
    setLoading(true);

    try {
      await axios.delete(`/api/entry/${date}`);

      alert("Diary entry deleted");

      setNotes("");
      setDate("");

      setDates((dates) => dates.filter((d) => d !== date));
    } catch (err) {
      alert(`Failed to delete diary entry: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [date, setDate, setDates]);

  useEffect(() => {
    if (date === "") {
      setNotes("");
      return;
    }

    setLoading(true);

    axios
      .get(`/api/entry/${date}`)
      .then((response) => {
        setNotes(response.data?.notes || "");
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setNotes("");
        } else {
          alert(`Failed to load diary entry: ${err.message}`);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [date]);

  return (
    <fieldset className="diary-entry">
      <legend>
        {date === "" ? "Select a date" : `Diary entry for ${date}`}
      </legend>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />

      <div className="actions">
        <button disabled={loading} onClick={handleSave}>
          Save
        </button>
        <button disabled={loading} onClick={handleDelete}>
          Delete
        </button>
      </div>

      {loading && <div className="loading">Loading...</div>}
    </fieldset>
  );
};

DiaryEntry.propTypes = {
  date: PropTypes.string.isRequired,
  setDate: PropTypes.func.isRequired,
  setDates: PropTypes.func.isRequired,
};
