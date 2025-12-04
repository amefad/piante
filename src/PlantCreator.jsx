import { useState, useContext } from "react";
import { useAuth } from "./AuthContext";
import { MapContext } from "./MapContext";
import Autocomplete from "./Autocomplete";
import { disableMap, enableMap } from "./libs/map";
import "./PlantCreator.scss";

export default function PlantCreator() {
  const { user } = useAuth();
  const mapState = useContext(MapContext);
  const [species, setSpecies] = useState({ id: 1 });
  const [number, setNumber] = useState("");
  const [height, setHeight] = useState("");
  const [error, setError] = useState(null);

  // Posts the plant data to database
  function addPlant() {
    const token = localStorage.getItem("authToken");
    const jsonData = {
      number: number || null,
      latitude: mapState.center[0],
      longitude: mapState.center[1],
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
          mapState.setStep(0);
          enableMap(mapState.map);
        } else {
          setError(data.message || "Inserimento fallito");
        }
      });
    });
  }

  if (user) {
    if (mapState.step == 0) {
      return (
        <button className="add" onClick={() => mapState.setStep(1)} title="Aggiungi una pianta">
          +
        </button>
      );
    } else if (mapState.step == 1) {
      return (
        <>
          <section className="panel">
            Posiziona la mappa e prosegui.
            <button
              onClick={() => {
                mapState.setStep(2);
                disableMap(mapState.map);
              }}
              title="Passo successivo"
            >
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
            <button
              onClick={() => {
                mapState.setStep(0);
                enableMap(mapState.map);
              }}
              title="Annulla l'inserimento"
            >
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
