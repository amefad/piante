import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.scss";

const position = [45.8869, 12.29733];
const bounds = [
  [45.866446, 12.333395],
  [45.947274, 12.323518],
  [45.860204, 12.326402],
  [45.903145, 12.24726],
];

export default function Map({ active }) {
  const marker = L.icon({
    iconUrl: `${import.meta.env.BASE_URL}/markers/map-pin.svg`,
    iconAnchor: [9, 9],
  });
  return (
    <MapContainer
      center={position}
      bounds={bounds}
      zoom={13}
      zoomControl={active}
      dragging={active}
      scrollWheelZoom={active}
      doubleClickZoom={active}
      boxZoom={active}
      touchZoom={active}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={marker}>
        <Popup>
          A pretty CSS3 popup. <br />
        </Popup>
      </Marker>
    </MapContainer>
  );
}
