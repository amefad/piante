import Page from "./Page";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Confirm() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleConfirm = () => {
    setError(null);
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const token = urlParams.get("token");
    if (id && token) {
      fetch(`${import.meta.env.BASE_URL}/api/users/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        response.json().then((data) => {
          if (response.ok) {
            navigate(`${import.meta.env.BASE_URL}/login`);
          } else {
            setError(data.message || "Conferma fallita");
          }
        });
      });
    } else {
      setError("ID utente e token necessari");
    }
  };

  return (
    <Page title="Conferma account" className="simple-page">
      <p>Clicca il pulsante qui sotto per confermare il tuo account.</p>
      <p>
        <button onClick={handleConfirm}>Conferma account</button>
      </p>
      {error && <p className="error">{error}</p>}
    </Page>
  );
}
