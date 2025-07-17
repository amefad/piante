import { useState } from "react";
import { useLocation } from "react-router";
import Page from "./Page";

export default function Resend() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    fetch(`${import.meta.env.BASE_URL}/api/users?confirm=${email}`).then(
      (response) => {
        response.json().then((data) => {
          if (response.ok) {
            setSuccess(true);
          } else {
            setError(data.message || "Reinvio email fallito");
          }
        });
      }
    );
  };

  return (
    <Page title="Reinvia email di conferma" className="simple-page">
      {success ? (
        <>
          <p>
            Email di conferma inviata a <strong>{email}</strong>
          </p>
          <p> Controlla la tua casella di posta.</p>
        </>
      ) : (
        <>
          <p>Riceverai un'email necessaria per completare la registrazione.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Reinvia email</button>
          </form>
          {error && <p className="error">{error}</p>}
        </>
      )}
    </Page>
  );
}
