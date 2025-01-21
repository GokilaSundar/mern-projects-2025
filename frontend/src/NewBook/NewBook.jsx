import axios from "axios";
import "./NewBook.css";

import { useState } from "react";

export const NewBook = () => {
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [price, setPrice] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post("/api/books", {
        title,
        author,
        description,
        year,
        price,
      });

      alert(`Book created with ID ${response.data._id}`);

      setTitle("");
      setAuthor("");
      setDescription("");
      setYear(new Date().getFullYear());
      setPrice(0);

      document.dispatchEvent(new CustomEvent("books:refresh"));
    } catch (err) {
      alert(`Failed to create book: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <fieldset className="new-book">
      <legend>New Book</legend>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td>
                <label htmlFor="title">Title:</label>
              </td>
              <td>
                <input
                  id="title"
                  type="text"
                  disabled={loading}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="author">Author:</label>
              </td>
              <td>
                <input
                  id="author"
                  type="text"
                  disabled={loading}
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="description">Description:</label>
              </td>
              <td>
                <input
                  id="description"
                  disabled={loading}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="year">Year:</label>
              </td>
              <td>
                <input
                  id="year"
                  type="number"
                  disabled={loading}
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="price">Price:</label>
              </td>
              <td>
                <input
                  id="price"
                  type="number"
                  disabled={loading}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <button type="submit" disabled={loading}>
                  New Book
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </fieldset>
  );
};
