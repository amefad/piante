import { useState, useEffect } from "react";
import { useApp } from "./AppContext";
import "./Snackbar.scss";

export default function Snackbar() {
  const { snack, setSnack } = useApp();
  const [timeoutId, setTimeoutId] = useState();

  useEffect(() => {
    if (snack) {
      setTimeoutId(setTimeout(hide, 5000));
    }
  }, [snack]);

  function hide() {
    clearTimeout(timeoutId);
    setSnack(null);
  }

  return (
    <div id="snackbar" className={snack ? "show" : "hide"} onClick={hide}>
      {snack}
    </div>
  );
}
