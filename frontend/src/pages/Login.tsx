import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "./../styles/page/Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, authState } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="login-container">
      <form className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {authState.error && (
          <div className="login-alert-error">
            <p className="error-message">{authState.error}</p>
          </div>
        )}
        <button
          type="button"
          className="btn btn-primary btn-full"
          onClick={handleSubmit}
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
