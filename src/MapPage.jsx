import Map from "./Map";
import Access from "./Access";
import { useData } from "./hooks/useData";
import "./MapPage.scss";

export default function MapPage() {
  const { plants } = useData();

  return (
    <div id="map-page">
      <Map active={true} plants={plants} />
      <Access />
    </div>
  );
}
