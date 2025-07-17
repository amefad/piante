import { useState } from "react";
import { Link } from "react-router";
import Page from "./Page";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    fetch(`${import.meta.env.BASE_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    }).then((response) => {
      response.json().then((data) => {
        if (response.ok) {
          setRegistered(true);
        } else {
          setError(data.message || "Registrazione fallita");
        }
      });
    });
  };

  return (
    <Page className="simple-page">
      {registered ? (
        <>
          <h2>Email inviata</h2>
          <p>
            Abbiamo mandato un'email all'indirizzo <strong>{email}</strong>
          </p>
          <p>
            Per completare la registrazione clicca sul link che vi troverai.
          </p>
          <p>(Eventualmente controlla la cartella spam)</p>
        </>
      ) : (
        <>
          <h2>Registra nuovo account</h2>
          <p>Inserisci i tuoi dati per creare un nuovo account.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nome Cognome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
            <button type="submit">Crea account</button>
          </form>
          {error && <p className="error">{error}</p>}
          <p>
            Hai già un account?{" "}
            <Link to={`${import.meta.env.BASE_URL}/login`}>Fai login qui</Link>
          </p>
        </>
      )}
    </Page>
  );
}
