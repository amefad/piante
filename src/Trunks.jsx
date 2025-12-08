import "./Trunks.scss";

export default function Trunks({ method, setMethod, measures, setMeasures }) {
  function addMeasure() {
    setMeasures([...measures.slice(), ""]);
  }

  function removeMeasure() {
    setMeasures(measures.slice(0, -1));
  }

  function changeMeasure(event, index) {
    let value = event.target.value;
    if (value <= 0) {
      value = "";
    }
    setMeasures(measures.map((measure, i) => (i == index ? value : measure)));
  }

  return (
    <div id="trunks">
      <div className="methods" onChange={(event) => setMethod(event.target.value)}>
        <label>
          <input
            type="radio"
            name="method"
            value="diameter"
            defaultChecked={method == "diameter"}
          />
          Diametri
        </label>
        <br />
        <label>
          <input type="radio" name="method" value="circum" defaultChecked={method == "circum"} />
          Circonferenze
        </label>
        <br />
        <label>
          <input type="radio" name="method" value="none" defaultChecked={method == "none"} />
          Non misurabile
        </label>
      </div>
      {method != "none" && (
        <div className="values">
          {measures.map((measure, index) => (
            <input
              key={index}
              type="number"
              placeholder="Centimetri"
              onChange={(event) => changeMeasure(event, index)}
              value={measure}
            />
          ))}
          {measures.length > 1 && <input type="button" value="-" onClick={removeMeasure} />}
          <input type="button" value="+" onClick={addMeasure} />
        </div>
      )}
    </div>
  );
}
