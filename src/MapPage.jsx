import Map from "./Map";
import Access from "./Access";
import { usePlants } from "./hooks/usePlants";
import "./MapPage.scss";

export default function MapPage() {
  const { plants } = usePlants();

  return (
    <div id="map-page">
      <Map active={true} plants={plants} />
      <Access />
    </div>
  );
}
