import { Link } from "react-router";
import { MapProvider } from "./MapContext";
import { usePlants } from "./hooks/usePlants";
import Map from "./Map";
import Access from "./Access";
import PlantCreator from "./PlantCreator";
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
        <MapProvider>
          <Map data={data} active={true} />
          <PlantCreator />
        </MapProvider>
      </div>
    </div>
  );
}
