import { createContext, useState, useContext } from "react";

const SnackbarContext = createContext(null);

export const useSnackbar = () => {
  return useContext(SnackbarContext);
};

export const SnackbarProvider = ({ children }) => {
  const [snack, setSnack] = useState(null);
  return <SnackbarContext value={{ snack, setSnack }}>{children}</SnackbarContext>;
};
