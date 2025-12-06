import { createContext, useState, useContext } from "react";

const MapContext = createContext(null);

export const useMapContext = () => {
  return useContext(MapContext);
};

export const MapContextProvider = ({ children }) => {
  const [map, setMap] = useState(null);
  const [plantLocation, setPlantLocation] = useState([45.8869, 12.29733]);
  const [step, setStep] = useState(0);

  const mapState = {
    map,
    setMap,
    plantLocation,
    setPlantLocation,
    step,
    setStep,
  };

  return <MapContext value={mapState}>{children}</MapContext>;
};
