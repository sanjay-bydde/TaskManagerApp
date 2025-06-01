import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setLoginSuccess(false);
    setLoginFailed(false);

    try {
      const response = await fetch("http://localhost:8081/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("Login Successful:", data);
      localStorage.setItem("token", data.token);
      setTimeout(() => {
        setLoading(false);
        setLoginSuccess(true);

        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }, 3000);
    } catch (error) {
      console.error("Error:", error);

      setTimeout(() => {
        setLoading(false);
        setLoginFailed(true);
      }, 3000);
    }
  };

  return (
    <div className="login-container">
      <header>
        <h1>Login</h1>
      </header>
      <div className="form-container">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Logging in...</p>
          </div>
        ) : loginSuccess ? (
          <p className="success-message">Login Successful! Redirecting...</p>
        ) : loginFailed ? (
          <p className="error-message">Login Failed! Please try again.</p>
        ) : (
          <form onSubmit={handleSubmit} className="form">
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
            <button type="submit">Login</button>
            <p>Don't have an account?</p>
            <Link to="/register">Register</Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
