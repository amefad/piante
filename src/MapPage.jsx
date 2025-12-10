import { Link } from "react-router";
import { MapContextProvider } from "./MapContext";
import Map from "./Map";
import Access from "./Access";
import PlantCreator from "./PlantCreator";
import { usePlants } from "./hooks/usePlants";
import "./MapPage.scss";

export default function MapPage() {
  const data = usePlants();

  return (
    <div id="map-page">
      <Link className="logo" to="/">
        <img src={`${import.meta.env.BASE_URL}/favicon.svg`} alt="Logo" />
      </Link>
      <Access />
      <div className="content">
        <MapContextProvider>
          <Map data={data} active={true} />
          <PlantCreator />
        </MapContextProvider>
      </div>
    </div>
  );
}
