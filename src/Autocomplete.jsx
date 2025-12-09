import { useState, useEffect } from "react";
import Popup from "./Popup";
import "./Autocomplete.scss";

export default function Autocomplete({ species, setSpecies }) {
  const [speciesList, setSpeciesList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [value, setValue] = useState(species?.scientificName || "");
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

  function showSuggestions(event) {
    const value = event.target.value;
    if (value.length > 0) {
      setFilteredData(
        speciesList.filter((species) => species.text.indexOf(value.toLowerCase()) > -1)
      );
    } else {
      setFilteredData(speciesList);
    }
    setMenuVisible(true);
    setValue(value);
  }

  return (
    <div id="autocomplete">
      <input
        placeholder="Nome specie"
        onClick={showSuggestions}
        onChange={showSuggestions}
        value={value}
        required
      />
      <Popup
        className="list"
        show={menuVisible}
        onClickOutside={() => {
          species && setValue(species.scientificName);
          setMenuVisible(false);
        }}
      >
        {filteredData.map((datum, i) => (
          <div
            className="datum"
            key={i}
            onClick={() => {
              setSpecies(datum);
              setValue(datum.scientificName);
              setMenuVisible(false);
            }}
          >
            <strong>{datum.scientificName}</strong>
            <small>{datum.commonName}</small>
            <mark>{datum.warning}</mark>
          </div>
        ))}
      </Popup>
    </div>
  );
}
