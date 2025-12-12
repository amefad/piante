import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useMap } from "./MapContext";
import { useSnackbar } from "./SnackbarContext";
import useSWRMutation from "swr/mutation";
import Autocomplete from "./Autocomplete";
import Trunks from "./Trunks";
import { disableMap, enableMap, resizeMap } from "./libs/map";
import "./PlantCreator.scss";

const postData = async (urlKey, { arg: { token, jsonData } }) => {
  const res = await fetch(urlKey, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(jsonData),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || `${res.statusText} (${res.status})`);
  }
  return data;
};

export default function PlantCreator() {
  const { user, token } = useAuth();
  const mapState = useMap();
  const { setSnack } = useSnackbar();
  const [species, setSpecies] = useState(null);
  const [number, setNumber] = useState("");
  const [method, setMethod] = useState("diameter");
  const [measures, setMeasures] = useState([""]);
  const [height, setHeight] = useState("");
  const [error, setError] = useState(null);

  const { trigger } = useSWRMutation(`${import.meta.env.BASE_URL}/api/plants`, postData, {
    populateCache: (newPlant, plants) => {
      return [...plants, newPlant];
    },
    revalidate: false,
  });

  function gotoStep(step) {
    mapState.setStep(step);
    if (step == 0) {
      setNumber("");
      setMeasures([""]);
      setHeight("");
    }
    step == 2 ? disableMap(mapState.map) : enableMap(mapState.map);
    resizeMap(mapState.map);
    setError(null);
  }

  // Posts the plant data to database
  async function addPlant(event) {
    event.preventDefault();
    setError(null);
    if (!species) {
      setError("Specie non definita");
      return;
    }
    const diameters =
      method == "none"
        ? ["unable"]
        : measures
            .map((measure) =>
              method == "circum" ? Math.round(measure / Math.PI) : parseInt(measure)
            )
            .filter((diameter) => diameter > 0)
            .sort((a, b) => b - a);

    const jsonData = {
      latitude: mapState.plantLocation[0],
      longitude: mapState.plantLocation[1],
      number: parseInt(number) || null,
      diameters: diameters.length > 0 ? diameters : null,
      height: parseFloat(height) || null,
      species: {
        id: species.id,
      },
      userId: user.id,
    };

    try {
      await trigger({ token, jsonData });
      gotoStep(0);
      setSnack("Nuova pianta inserita");
    } catch (error) {
      setError(error.message || "Qualcosa è andato storto");
    }
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
            <button type="button" onClick={() => gotoStep(2)} title="Passo successivo">
              Prosegui
            </button>
          </div>
        </section>
      );
    } else {
      return (
        <form className="panel" onSubmit={addPlant}>
          <Autocomplete species={species} setSpecies={setSpecies} />
          {species?.warning && <mark>{species.warning}</mark>}
          <input
            type="number"
            min="1"
            inputMode="numeric"
            placeholder="Numero comunale"
            value={number}
            onChange={(event) => setNumber(event.target.value)}
          />
          <Trunks
            method={method}
            setMethod={setMethod}
            measures={measures}
            setMeasures={setMeasures}
          />
          <input
            type="number"
            min="0"
            step="0.1"
            inputMode="decimal"
            placeholder="Altezza (metri)"
            value={height}
            onChange={(event) => setHeight(event.target.value)}
          />
          <textarea placeholder="Note" value="Note (da implementare)" disabled />
          {error && <p className="error">{error}</p>}
          <div className="buttons">
            <button type="button" onClick={() => gotoStep(1)} title="Torna al posizionamento">
              Indietro
            </button>
            <button type="submit" title="Concludi l'inserimento">
              Salva
            </button>
          </div>
        </form>
      );
    }
  }
}
