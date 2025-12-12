import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import useSWRMutation from "swr/mutation";
import { usePlants } from "./hooks/usePlants";
import { useAuth } from "./AuthContext";
import { MapProvider, useMap } from "./MapContext";
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

const putData = async (urlKey, { arg: { id, token, jsonData } }) => {
  const res = await fetch(`${urlKey}/${id}`, {
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
  const plantsData = usePlants();
  const [plant, setPlant] = useState(null);
  const [editData, setEditData] = useState(false);
  const [editMap, setEditMap] = useState(false);

  const { user, token } = useAuth();
  const { setSnack } = useSnackbar();
  const [putError, setPutError] = useState(null);

  // Plant states
  const [species, setSpecies] = useState(null);
  const [number, setNumber] = useState("");
  const [method, setMethod] = useState("diameter");
  const [diameters, setDiameters] = useState([""]);
  const [height, setHeight] = useState("");

  const { trigger } = useSWRMutation(`${import.meta.env.BASE_URL}/api/plants`, putData, {
    populateCache: (data, plants) => {
      if (data.id) {
        // data is a plant
        const filteredPlants = plants.filter((plant) => plant.id != data.id);
        return [...filteredPlants, data];
      }
      return data;
    },
    revalidate: false,
  });

  useEffect(() => {
    if (plantsData.plants) {
      const thisPlant = plantsData.plants.find((plant) => plant.id == id);
      setPlant(thisPlant);
      plantsData.selected = thisPlant;
    }
  }, [plantsData]);

  useEffect(() => {
    // if (plant && !editor) ?
    if (plant) {
      setSpecies(plant.species || null);
      setNumber(plant.number || "");
      setMethod(plant.diameters.includes("unable") ? "none" : "diameter");
      setDiameters(plant.diameters.length > 0 ? plant.diameters : [""]);
      setHeight(plant.height != null ? String(plant.height) : "");
    }
  }, [plant, editData]);

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
      await trigger({ id, token, jsonData });
      setEditData(false);
      setSnack("Dati aggiornati");
    } catch (error) {
      if (error instanceof OkWithMessageError) {
        setEditData(false);
        setSnack(error.message);
      } else {
        setPutError(error.message || "Qualcosa è andato storto");
      }
    }
  }

  async function putPlantLocation(event, plantLocation) {
    event.preventDefault();
    setPutError(null);
    const jsonData = {
      id: parseInt(id),
      latitude: plantLocation[0],
      longitude: plantLocation[1],
    };
    try {
      await trigger({ id, token, jsonData });
      setEditMap(false);
      setSnack("Posizione aggiornata");
    } catch (error) {
      if (error instanceof OkWithMessageError) {
        setEditMap(false);
        setSnack(error.message);
      } else {
        setPutError(error.message || "Qualcosa è andato storto");
      }
    }
  }

  const LocationButtons = () => {
    const mapState = useMap();

    useEffect(() => {
      mapState.setStep(1);
    });

    return (
      <div className="buttons">
        <button onClick={() => setEditMap(false)}>Annulla</button>
        <button onClick={(event) => putPlantLocation(event, mapState.plantLocation)}>Salva</button>
      </div>
    );
  };

  return (
    <Page>
      {plantsData.isLoading && <p>Loading...</p>}
      {plantsData.error && <p className="error">{plantsData.error.message}</p>}
      {plant &&
        !plantsData.error &&
        ((editData || editMap) && user ? (
          editMap ? (
            <div className="location-editor">
              <MapProvider>
                <Map data={plantsData} active={true} />
                <LocationButtons setEditMap={setEditMap} putPlantLocation={putPlantLocation} />
              </MapProvider>
            </div>
          ) : (
            <form className="data-editor" onSubmit={putPlantData}>
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
                <button type="button" onClick={() => setEditData(false)}>
                  Annulla
                </button>
                <button type="submit">Salva</button>
              </div>
            </form>
          )
        ) : (
          <div className="plant-page">
            <h2>{plant.species.scientificName}</h2>
            <h3>{plant.species.commonName}</h3>
            {user && <mark>{plant.species.warning}</mark>}
            <p>
              Numero comunale {plant.number}
              <br />
              Diametri {plant.diameters.join(", ")} cm
              <br />
              Altezza {plant.height} m<br />
            </p>
            {user && <button onClick={() => setEditData(true)}>Modifica dati</button>}
            <p>
              Aggiunta il <data value={plant.date}>{plant.date}</data> da {plant.user.name}
            </p>
            <MapProvider>
              <Link to="/map">
                <Map data={plantsData} />
              </Link>
            </MapProvider>
            {user && (
              <p>
                <button onClick={() => setEditMap(true)}>Modifica posizione</button>
              </p>
            )}
            {plant.images.map((image) => (
              <img
                key={image.id}
                src={`${import.meta.env.BASE_URL}/uploads/thumbnail/${image.fileName}`}
              />
            ))}
          </div>
        ))}
    </Page>
  );
}
