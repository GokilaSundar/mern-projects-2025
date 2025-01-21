import "./ListBooks.css";

import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const Row = ({ book, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [description, setDescription] = useState(book.description);
  const [year, setYear] = useState(book.year);
  const [price, setPrice] = useState(book.price);

  const handleSave = async () => {
    try {
      setLoading(true);

      await axios.put(`/api/books/${book._id}`, {
        title,
        author,
        description,
        year,
        price,
      });

      alert("Book saved");
    } catch (err) {
      alert(`Failed to save book: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/books/${book._id}`);

      alert("Book deleted");

      onDelete();
    } catch (err) {
      alert(`Failed to delete book: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr>
      <td>
        <input
          type="text"
          disabled={loading}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </td>
      <td>
        <input
          type="text"
          disabled={loading}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </td>
      <td>
        <input
          type="text"
          disabled={loading}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </td>
      <td>
        <input
          type="number"
          disabled={loading}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />
      </td>
      <td>
        <input
          type="number"
          disabled={loading}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </td>
      <td>
        <button onClick={handleSave} disabled={loading}>
          Save
        </button>
        <button onClick={handleDelete} disabled={loading}>
          Delete
        </button>
      </td>
    </tr>
  );
};

Row.propTypes = {
  book: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export const ListBooks = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);

        const response = await axios.get("/api/books", {
          params: {
            search,
          },
        });

        setBooks(response.data);
      } catch (err) {
        alert(`Failed to fetch books: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();

    document.addEventListener("books:refresh", fetchBooks);

    return () => {
      document.removeEventListener("books:refresh", fetchBooks);
    };
  }, [search]);

  return (
    <fieldset className="list-books">
      <legend>Books</legend>
      <div className="search">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="table-container">
        <table>
          <colgroup>
            <col style={{ width: "30%" }} />
            <col style={{ width: "40%" }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "5em" }} />
            <col style={{ width: "5em" }} />
            <col style={{ width: "10em" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Author</th>
              <th>Year</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <Row
                key={book._id}
                book={book}
                onDelete={() =>
                  setBooks(books.filter((b) => b._id !== book._id))
                }
              />
            ))}
          </tbody>
        </table>
      </div>
      {loading && <div className="loading">Loading...</div>}
    </fieldset>
  );
};
