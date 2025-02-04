import "./Login.css";

import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const Login = ({ setUser }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);

      const email = formData.get("email");
      const password = formData.get("password");

      if (!email) {
        alert("Email is required");
        return;
      }

      if (!password) {
        alert("Password is required");
        return;
      }

      setLoading(true);

      try {
        const response = await axios.post("/api/login", {
          email,
          password,
        });

        setUser(response.data);
      } catch (e) {
        alert(e.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    },
    [setUser]
  );

  return (
    <fieldset className="login" disabled={loading}>
      <legend>Login</legend>
      <form onSubmit={handleSubmit}>
        <div className="form-content">
          <label htmlFor="email">Email:</label>
          <input id="email" type="email" name="email" />
          <label htmlFor="password">Password:</label>
          <input id="password" type="password" name="password" />
        </div>
        <button type="submit">Login</button>
      </form>
    </fieldset>
  );
};

Login.propTypes = {
  setUser: PropTypes.func.isRequired,
};
