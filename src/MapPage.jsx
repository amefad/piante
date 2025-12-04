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
      <MapContextProvider>
        <Map data={data} active={true} />
        <PlantCreator />
      </MapContextProvider>
      <Access />
    </div>
  );
}
