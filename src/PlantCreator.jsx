import { useState } from "react";
import { useAuth } from "./AuthContext";
//import { CenterContext } from "./MapContext";
import Autocomplete from "./Autocomplete";
import "./PlantCreator.scss";

export default function PlantCreator({ newCenter }) {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [species, setSpecies] = useState({ id: 1 });
  const [number, setNumber] = useState("");
  const [height, setHeight] = useState("");
  const [error, setError] = useState(null);

  // Posts the plant data to database
  function addPlant() {
    const token = localStorage.getItem("authToken");
    const jsonData = {
      number: number || null,
      latitude: newCenter[0],
      longitude: newCenter[1],
      circumferences: [50], // TODO
      height: height || null,
      species: {
        id: species.id,
      },
      userId: user.id,
    };
    console.table(jsonData);
    fetch(`${import.meta.env.BASE_URL}/api/plants`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(jsonData),
    }).then((response) => {
      response.json().then((data) => {
        if (response.ok) {
          setStep(0);
        } else {
          setError(data.message || "Inserimento fallito");
        }
      });
    });
  }

  if (user) {
    if (step == 0) {
      return (
        <button className="add" onClick={() => setStep(1)} title="Aggiungi una pianta">
          +
        </button>
      );
    } else if (step == 1) {
      return (
        <>
          <section className="panel">
            Posiziona la mappa e prosegui.
            <button onClick={() => setStep(2)} title="Passo successivo">
              Prosegui
            </button>
          </section>
          <div className="centerMarker">
            <img src={`${import.meta.env.BASE_URL}/markers/custom-icon.png`} />
          </div>
        </>
      );
    } else {
      return (
        <section className="panel">
          <small>
            {newCenter[0]} {newCenter[1]}
          </small>
          <Autocomplete value={"?"} setSpecies={setSpecies} />
          {species.warning && <mark>{species.warning}</mark>}
          <input
            type="number"
            placeholder="Numero comunale"
            value={number}
            onChange={(event) => setNumber(event.target.value)}
          />
          <input
            type="number"
            placeholder="Altezza (metri)"
            value={height}
            onChange={(event) => setHeight(event.target.value)}
          />
          <textarea placeholder="Note" value="Note (da implementare)" disabled />
          <div className="buttons">
            <button onClick={() => setStep(0)} title="Annulla l'inserimento">
              Annulla
            </button>
            <button onClick={addPlant} title="Concludi l'inserimento">
              Salva
            </button>
          </div>
          {error && <p className="error">{error}</p>}
        </section>
      );
    }
  }
}
