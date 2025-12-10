import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useMapContext } from "./MapContext";
import { useSnackbar } from "./SnackbarContext";
import useSWRMutation from "swr/mutation";
import Autocomplete from "./Autocomplete";
import Trunks from "./Trunks";
import { disableMap, enableMap, resizeMap } from "./libs/map";
import "./PlantCreator.scss";

const uploadPlant = async (urlKey, { arg: { token, plant } }) => {
  const res = await fetch(urlKey, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(plant),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(data?.message || `Request failed with status ${res.status}`);
    err.status = res.status;
    err.info = data;
    throw err;
  }
  return data;
};

export default function PlantCreator() {
  const { user, token } = useAuth();
  const mapState = useMapContext();
  const { setSnack } = useSnackbar();
  const [species, setSpecies] = useState(null);
  const [number, setNumber] = useState("");
  const [method, setMethod] = useState("diameter");
  const [measures, setMeasures] = useState([""]);
  const [height, setHeight] = useState("");
  const [error, setError] = useState(null);

  const { trigger } = useSWRMutation(`${import.meta.env.BASE_URL}/api/plants`, uploadPlant, {
    populateCache: (newPlant, plants) => {
      return [...plants, newPlant];
    },
    revalidate: false,
  });

  function gotoStep(step) {
    mapState.setStep(step);
    step == 2 ? disableMap(mapState.map) : enableMap(mapState.map);
    resizeMap(mapState.map);
  }

  // Posts the plant data to database
  async function addPlant(event) {
    event.preventDefault();
    setError(null);
    if (!species) {
      setSnack("Specie non definita");
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
      number: number || null,
      diameters: diameters.length > 0 ? diameters : null,
      height: height || null,
      species: {
        id: species.id,
      },
      userId: user.id,
    };

    try {
      await trigger({ token: token, plant: jsonData });
      setSnack("Nuova pianta inserita");
      // Resets some values
      setError(null);
      gotoStep(0);
      setNumber("");
      setMeasures([""]);
      setHeight("");
    } catch (exception) {
      setSnack("qualcosa andato storto");
      setError(exception.message);
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
            <button onClick={() => gotoStep(2)} title="Passo successivo">
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
            min="0"
            step="1"
            inputMode="numeric"
            placeholder="Numero comunale"
            value={number}
            onChange={(event) => setNumber(parseInt(event.target.value))}
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
            step="1"
            inputMode="numeric"
            placeholder="Altezza (metri)"
            value={height}
            onChange={(event) => setHeight(parseFloat(event.target.value))}
          />
          <textarea placeholder="Note" value="Note (da implementare)" disabled />
          <div className="buttons">
            <button type="button" onClick={() => gotoStep(1)} title="Torna al posizionamento">
              Indietro
            </button>
            <button type="submit" title="Concludi l'inserimento">
              Salva
            </button>
          </div>
          {error && <p className="error">{error}</p>}
        </form>
      );
    }
  }
}
