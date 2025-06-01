import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:8081/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      console.log("Registration Successful:", data);
      setRegistrationSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <header>
        <h1>Register</h1>
      </header>
      <div className="form-container">
        {registrationSuccess ? (
          <p className="success-message">
            Registration Successful! Redirecting to Login...
          </p>
        ) : (
          <form onSubmit={handleRegister} className="form">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Register</button>
            <p>Already have an account?</p>
            <Link to="/">Login</Link>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
