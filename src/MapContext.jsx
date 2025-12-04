import { createContext, useState } from "react";

export const MapContext = createContext();

export const MapContextProvider = (props) => {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState([45.8869, 12.29733]);
  const [step, setStep] = useState(0);

  const mapState = {
    map,
    setMap,
    center,
    setCenter,
    step,
    setStep,
  };

  return <MapContext.Provider value={mapState}>{props.children}</MapContext.Provider>;
};
