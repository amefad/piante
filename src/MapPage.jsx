import Map from "./Map";
import Access from "./Access";
import { usePlants } from "./hooks/usePlants";
import "./MapPage.scss";

export default function MapPage() {
  const data = usePlants();

  return (
    <div id="map-page">
      <Map data={data} active={true} />
      <Access />
    </div>
  );
}
