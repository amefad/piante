import Map from "./Map";
import Access from "./Access";
import "./MapPage.scss";

export default function MapPage() {
  return (
    <div id="map-page">
      <Map active={true} />
      <Access />
    </div>
  );
}
