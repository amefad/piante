import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import Page from "./Page";

export default function Confirm() {
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = searchParams.get("id");
    const token = searchParams.get("token");
    if (id && token) {
      fetch(`${import.meta.env.BASE_URL}/api/users/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        response.json().then((data) => {
          if (response.ok) {
            setUser(data);
          } else {
            setError(data.message || "Conferma fallita");
          }
        });
      });
    } else {
      setError("ID utente e token necessari");
    }
  }, []);

  return (
    <Page title="Conferma account" className="simple-page">
      {user && (
        <>
          <p>
            <strong>{user.name}</strong> benvenuto nella Mappa delle piante!
          </p>
          <p>
            <Link to="/login">Ora puoi effettuare il login</Link>
          </p>
        </>
      )}
      {error && <p className="error">{error}</p>}
    </Page>
  );
}
