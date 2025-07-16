import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import Page from "./Page";
import "./Login.scss";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    fetch(`${import.meta.env.BASE_URL}/api/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }).then((response) => {
      response.json().then((data) => {
        if (response.ok) {
          const user = {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
          };
          login({ token: data.token, user });
          navigate(`${import.meta.env.BASE_URL}`);
        } else {
          setError(data.message || "Login failed");
        }
      });
    });
  };

  return (
    <Page title="Login" className="login-page">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </Page>
  );
}
