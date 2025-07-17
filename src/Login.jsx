import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "./AuthContext";
import Page from "./Page";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [resend, setResend] = useState(false);
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
          setError(data.message || "Login fallito");
          if (response.status == 403) {
            setResend(true);
          }
        }
      });
    });
  };

  return (
    <Page title="Login" className="simple-page">
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
      </form>
      {error && <p className="error">{error}</p>}
      {resend ? (
        <p>
          <Link to={`${import.meta.env.BASE_URL}/resend`} state={{ email }}>
            Reinvia email di conferma
          </Link>
        </p>
      ) : (
        <p>
          Non hai un account?{" "}
          <Link to={`${import.meta.env.BASE_URL}/register`}>
            Registrati qui
          </Link>
        </p>
      )}
    </Page>
  );
}
