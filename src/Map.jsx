import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, AttributionControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.scss";

const position = [45.8869, 12.29733];
const bounds = [
  [46.05, 12.52], // NE corner
  [45.7, 12.13], // SW corner
];

export default function Map({ active }) {
  const marker = L.icon({
    iconUrl: `${import.meta.env.BASE_URL}/markers/map-pin.svg`,
    iconAnchor: [9, 9],
  });
  return (
    <MapContainer
      center={position}
      zoom={13}
      zoomControl={active}
      dragging={active}
      scrollWheelZoom={active}
      doubleClickZoom={active}
      boxZoom={active}
      touchZoom={active}
      attributionControl={false}
      maxBounds={bounds}
      maxBoundsViscosity={0.9}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        minZoom={11}
        maxZoom={21}
      />
      <AttributionControl prefix="" position="bottomright" />
      <Marker position={position} icon={marker}>
        <Popup>
          A pretty CSS3 popup. <br />
        </Popup>
      </Marker>
    </MapContainer>
  );
}
