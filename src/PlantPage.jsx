import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import fetcher from "./libs/fetcher";
import { useAuth } from "./AuthContext";
import { useSnackbar } from "./SnackbarContext";
import Page from "./Page";
import Map from "./Map";
import Autocomplete from "./Autocomplete";
import Trunks from "./Trunks";
import "./PlantPage.scss";

class OkWithMessageError extends Error {
  constructor(msg) {
    super(msg);
    this.name = OkWithMessageError.name;
  }
}

function getPlant(id) {
  let url = `${import.meta.env.BASE_URL}/api/plants/${id}`;
  const { data, isLoading, error } = useSWR(url, fetcher);
  return {
    plant: data,
    isLoading,
    loadError: error,
  };
}

const putData = async (urlKey, { arg: { token, jsonData } }) => {
  const res = await fetch(urlKey, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(jsonData),
  });
  const data = await res.json().catch(() => null);
  if (res.ok && data && data.message) {
    throw new OkWithMessageError(data.message);
  } else if (!res.ok) {
    throw new Error(data?.message || `${res.statusText} (${res.status})`);
  }
  return data;
};

export default function PlantPage() {
  const { id } = useParams();
  const { plant, isLoading, loadError } = getPlant(id);
  const [editor, setEditor] = useState(false);
  const { user, token } = useAuth();
  const { setSnack } = useSnackbar();
  const [putError, setPutError] = useState(null);

  // Plant states
  const [species, setSpecies] = useState(null);
  const [number, setNumber] = useState("");
  const [method, setMethod] = useState("diameter");
  const [diameters, setDiameters] = useState([""]);
  const [height, setHeight] = useState("");

  const { trigger } = useSWRMutation(`${import.meta.env.BASE_URL}/api/plants/${id}`, putData, {
    populateCache: (data) => data,
    revalidate: false,
  });

  useEffect(() => {
    // if (plant && !editor) ?
    if (plant) {
      setSpecies(plant.species || null);
      setNumber(plant.number || "");
      setMethod(plant.diameters.includes("unable") ? "none" : "diameter");
      setDiameters(plant.diameters.length > 0 ? plant.diameters : [""]);
      setHeight(plant.height != null ? String(plant.height) : "");
    }
  }, [plant, editor]);

  async function putPlantData(event) {
    event.preventDefault();
    setPutError(null);
    const jsonData = {
      id: parseInt(id),
      number: parseInt(number) || null,
      diameters: diameters.length > 0 ? diameters : null,
      height: parseFloat(height) || null,
      species: {
        id: species.id,
      },
    };
    try {
      await trigger({ token, jsonData });
      setEditor(false);
      setSnack("Pianta aggiornata");
    } catch (error) {
      if (error instanceof OkWithMessageError) {
        setEditor(false);
        setSnack(error.message);
      } else {
        setPutError(error.message || "Qualcosa è andato storto");
      }
    }
  }

  return (
    <Page>
      {isLoading && <p>Loading...</p>}
      {loadError && <p className="error">{loadError.message}</p>}
      {plant &&
        !loadError &&
        (editor && user ? (
          <form className="editor" onSubmit={putPlantData}>
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
              measures={diameters}
              setMeasures={setDiameters}
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
            {/* <textarea placeholder="Note" value="" /> */}
            {putError && <p className="error">{putError}</p>}
            <div className="buttons">
              <button type="button" onClick={() => setEditor(false)}>
                Annulla
              </button>
              <button type="submit">Salva</button>
            </div>
          </form>
        ) : (
          <>
            <h2>{plant.species.scientificName}</h2>
            <h3>{plant.species.commonName}</h3>
            <mark>{plant.species.warning}</mark>
            <p>
              Numero comunale {plant.number}
              <br />
              Diametri {plant.diameters.join(", ")} cm
              <br />
              Altezza {plant.height} m<br />
            </p>
            {user && <button onClick={() => setEditor(true)}>Modifica dati</button>}
            <p>
              Aggiunta il <data value={plant.date}>{plant.date}</data> da {plant.user.name}
            </p>
            {plant.images.map((image) => (
              <img
                key={image.id}
                src={`${import.meta.env.BASE_URL}/uploads/thumbnail/${image.fileName}`}
              />
            ))}
            <Link to="/map">
              <Map data={{ plants: [plant] }} />
            </Link>
            {user && (
              <p>
                <button onClick={() => alert("TODO")}>Modifica posizione</button>
              </p>
            )}
          </>
        ))}
    </Page>
  );
}
