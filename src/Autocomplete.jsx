import { useState, useEffect } from "react";
import "./Autocomplete.scss";

export default function Autocomplete({ value: origValue, setSpecies }) {
  const [speciesList, setSpeciesList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [value, setValue] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}/api/species`)
      .then((response) => response.json())
      .then((data) => {
        data.map((species) => {
          species.text = species.commonName.toLowerCase() + species.scientificName.toLowerCase();
        });
        setSpeciesList(data);
      });
  }, []);

  const dataFilter = (texto) => {
    return speciesList.filter((one) => one.text.indexOf(texto?.toLowerCase()) > -1);
  };

  return (
    <div id="autocomplete">
      <input
        onFocus={() => {
          if (value.length === 0) {
            setMenuVisible(true);
          }
        }}
        //onBlur={() => setMenuVisible(false)}
        placeholder="Nome specie"
        onChange={(event) => {
          const text = event.target.value;
          if (text && text.length > 0) {
            setFilteredData(dataFilter(text));
          } else if (text && text.length === 0) {
            setFilteredData(speciesList);
          }
          setMenuVisible(true);
          setValue(text);
        }}
        value={value}
        required
      />
      {menuVisible && filteredData && (
        <div className="list">
          {filteredData.map((datum, i) => (
            <div
              className="datum"
              key={i}
              onClick={() => {
                setValue(datum.scientificName);
                setSpecies(datum);
                setMenuVisible(false);
              }}
            >
              <strong>{datum.scientificName}</strong>
              <small>{datum.commonName}</small>
              <mark>{datum.warning}</mark>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
