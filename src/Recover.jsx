import { useState } from "react";
import { useLocation } from "react-router";
import Page from "./Page";

export default function Recover() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    fetch(`${import.meta.env.BASE_URL}/api/users?reset=${email}`).then(
      (response) => {
        if (response.ok) {
          setSuccess(true);
        } else {
          response.json().then((data) => {
            setError(data.message || "Errore");
          });
        }
      }
    );
  };

  return (
    <Page title="Recupera password" className="simple-page">
      {success ? (
        <>
          <p>
            Un'email per il recupero della password è stata inviata a{" "}
            <strong>{email}</strong>
          </p>
          <p>
            Controlla la tua casella di posta (ed eventualmente la cartella
            spam).
          </p>
        </>
      ) : (
        <>
          <p>
            Inserisci la tua email per ricevere le istruzioni per reimpostare la
            password.
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Invia email</button>
          </form>
          {error && <p className="error">{error}</p>}
        </>
      )}
    </Page>
  );
}
