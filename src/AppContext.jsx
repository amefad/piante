import { createContext, useState, useContext } from "react";

const AppContext = createContext(null);

export const useApp = () => {
  return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
  const [snack, setSnack] = useState(null);
  const [mapView, setMapView] = useState({ zoom: 14, coords: [45.8869, 12.29733] });

  return <AppContext value={{ snack, setSnack, mapView, setMapView }}>{children}</AppContext>;
};
