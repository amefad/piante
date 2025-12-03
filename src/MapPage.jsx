import { useContext, useState } from "react";
//import { CenterContext } from "./MapContext";
import Map from "./Map";
import Access from "./Access";
import PlantCreator from "./PlantCreator";
import { usePlants } from "./hooks/usePlants";
import "./MapPage.scss";

export default function MapPage() {
  const data = usePlants();
  //const center = useContext(CenterContext);
  const [newCenter, setNewCenter] = useState([0, 0]);

  return (
    <div id="map-page">
      {/*<CenterContext value={center}>*/}
      <Map data={data} active={true} setNewCenter={setNewCenter} />
      <Access />
      <PlantCreator newCenter={newCenter} />
      {/*</CenterContext>*/}
    </div>
  );
}
