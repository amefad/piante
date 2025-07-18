import { useState } from "react";
import { useSearchParams, Link } from "react-router";
import Page from "./Page";

export default function Reset() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    const id = searchParams.get("id");
    const token = searchParams.get("token");
    if (id && token) {
      fetch(`${import.meta.env.BASE_URL}/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      }).then((response) => {
        response.json().then((data) => {
          if (response.ok) {
            setUserName(data.name);
            setSuccess(true);
            // TODO Con il data.token ricevuto fai logout: DELETE /api/session
          } else {
            setError(data.message || "Errore");
          }
        });
      });
    } else {
      setError("ID utente e token necessari");
    }
  };

  return (
    <Page title="Imposta nuova password" className="simple-page">
      {success ? (
        <>
          <p>
            Impostata con successo nuova password per <strong>{userName}</strong>.
          </p>
          <p>
            <Link to="/login">Vai al login</Link>
          </p>
        </>
      ) : (
        <>
          <p>Inserisci la tua nuova password.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Nuova password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Imposta password</button>
          </form>
          {error && <p className="error">{error}</p>}
        </>
      )}
    </Page>
  );
}
