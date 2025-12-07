import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useMapContext } from "./MapContext";
import Autocomplete from "./Autocomplete";
import Trunks from "./Trunks";
import { disableMap, enableMap, resizeMap } from "./libs/map";
import "./PlantCreator.scss";

export default function PlantCreator() {
  const { user, token } = useAuth();
  const mapState = useMapContext();
  const [species, setSpecies] = useState({ id: 1 });
  const [number, setNumber] = useState("");
  const [diameters, setDiameters] = useState([]);
  const [height, setHeight] = useState("");
  const [error, setError] = useState(null);

  function gotoStep(step) {
    mapState.setStep(step);
    step == 2 ? disableMap(mapState.map) : enableMap(mapState.map);
    resizeMap(mapState.map);
  }

  // Posts the plant data to database
  function addPlant(event) {
    event.preventDefault();
    const jsonData = {
      latitude: mapState.plantLocation[0],
      longitude: mapState.plantLocation[1],
      number: number || null,
      circumferences: diameters.length > 0 ? diameters : null,
      height: height || null,
      species: {
        id: species.id,
      },
      userId: user.id,
    };
    fetch(`${import.meta.env.BASE_URL}/api/plants`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(jsonData),
    }).then((response) => {
      response.json().then((data) => {
        if (response.ok) {
          mapState.setStep(0);
          enableMap(mapState.map);
          resizeMap(mapState.map);
        } else {
          setError(data.message || "Inserimento fallito");
        }
      });
    });
  }

  if (user) {
    if (mapState.step == 0) {
      return (
        <button className="add" onClick={() => gotoStep(1)} title="Aggiungi una pianta">
          <img src={`${import.meta.env.BASE_URL}/img/plus.svg`} alt="+" />
        </button>
      );
    } else if (mapState.step == 1) {
      return (
        <section className="panel centered">
          Posiziona la mappa e prosegui.
          <div className="buttons">
            <button type="button" onClick={() => gotoStep(0)} title="Annulla l'inserimento">
              Annulla
            </button>
            <button onClick={() => gotoStep(2)} title="Passo successivo">
              Prosegui
            </button>
          </div>
        </section>
      );
    } else {
      return (
        <form className="panel" onSubmit={addPlant}>
          <Autocomplete value={"?"} setSpecies={setSpecies} />
          {species.warning && <mark>{species.warning}</mark>}
          <input
            type="number"
            placeholder="Numero comunale"
            value={number}
            onChange={(event) => setNumber(parseInt(event.target.value))}
          />
          <Trunks setDiameters={setDiameters} />
          <input
            type="number"
            placeholder="Altezza (metri)"
            value={height}
            onChange={(event) => setHeight(parseFloat(event.target.value))}
          />
          <textarea placeholder="Note" value="Note (da implementare)" disabled />
          <div className="buttons">
            <button type="button" onClick={() => gotoStep(1)} title="Torna al posizionamento">
              Indietro
            </button>
            <button type="submit" onClick={addPlant} title="Concludi l'inserimento">
              Salva
            </button>
          </div>
          {error && <p className="error">{error}</p>}
        </form>
      );
    }
  }
}
