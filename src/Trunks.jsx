import { useEffect } from "react";
import "./Trunks.scss";

export default function Trunks({
  method,
  setMethod,
  indeterminable,
  setIndeterminable,
  measures,
  setMeasures,
  setDiameters,
}) {
  // Converts from diameters into circumferences and vice versa
  function changeMethod(event) {
    setMethod(event.target.value);
    setMeasures(
      measures
        .map((measure) => Math.round(method == "circum" ? measure / Math.PI : measure * Math.PI))
        .map((measure) => (measure == 0 ? "" : measure))
    );
  }

  function addMeasure() {
    setMeasures([...measures.slice(), ""]);
  }

  function removeMeasure() {
    setMeasures(measures.slice(0, -1));
  }

  function changeMeasure(event, index) {
    setMeasures(measures.map((measure, i) => (i == index ? event.target.value : measure)));
  }

  // Produces final diameters array
  useEffect(() => {
    const diameters = indeterminable
      ? ["unable"]
      : measures
          .map((measure) =>
            method == "circum" ? Math.round(measure / Math.PI) : parseInt(measure)
          )
          .filter((diameter) => diameter > 0)
          .sort((a, b) => b - a);
    setDiameters(diameters);
  }, [method, indeterminable, measures]);

  return (
    <div id="trunks">
      <div className="methods">
        <label>
          <input
            type="radio"
            name="method"
            value="diameter"
            onChange={changeMethod}
            defaultChecked={method == "diameter"}
            disabled={indeterminable}
          />
          Diametri
        </label>
        <label>
          <input
            type="radio"
            name="method"
            value="circum"
            onChange={changeMethod}
            defaultChecked={method == "circum"}
            disabled={indeterminable}
          />
          Circonferenze
        </label>
        <label>
          <input
            type="checkbox"
            onClick={() => setIndeterminable(!indeterminable)}
            defaultChecked={indeterminable}
          />
          Indeterminabile
        </label>
      </div>
      {!indeterminable && (
        <div className="values">
          {measures.map((measure, index) => (
            <input
              key={index}
              type="number"
              min="1"
              inputMode="numeric"
              placeholder="Centimetri"
              onChange={(event) => changeMeasure(event, index)}
              value={measure}
            />
          ))}
          <div className="buttons">
            {measures.length > 1 && <input type="button" value="-" onClick={removeMeasure} />}
            <input type="button" value="+" onClick={addMeasure} />
          </div>
        </div>
      )}
    </div>
  );
}
