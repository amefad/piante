import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, AttributionControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.scss";

// generate a random latitude between 45.886900 and 45.886999
// const minLat = 45.87;
// const maxLat = 45.89;
// const randomLat = () => Number((Math.random() * (maxLat - minLat) + minLat).toFixed(6));

// const positions = new Array(10).fill([]).map(() => [randomLat(), 12.29733]);
// console.log(positions);

const bounds = [
  [46.05, 12.52], // NE corner
  [45.7, 12.13], // SW corner
];

const mapCenter = { latitude: 45.8869, longitude: 12.29733 };

export default function Map({ active = false, plants = [] }) {
  const center = [
    plants[0]?.latitude ?? mapCenter.latitude,
    plants[0]?.longitude ?? mapCenter.longitude,
  ];

  const marker = L.icon({
    iconUrl: `${import.meta.env.BASE_URL}/markers/map-pin.svg`,
    iconAnchor: [9, 9],
  });

  return (
    <MapContainer
      center={center}
      maxBounds={bounds}
      maxBoundsViscosity={0.9}
      zoom={13}
      zoomControl={active}
      dragging={active}
      scrollWheelZoom={active}
      doubleClickZoom={active}
      boxZoom={active}
      touchZoom={active}
      attributionControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        minZoom={11}
        maxZoom={21}
      />
      <AttributionControl prefix={false} position="bottomright" />
      {plants
        .filter((plant) => plant.latitude && plant.longitude)
        .map((plant) => (
          <Marker position={[plant.latitude, plant.longitude]} icon={marker} key={plant.id}>
            <Popup>
              <p style={{ fontWeight: "bold" }}>{plant.commonName}</p>
              <p style={{ fontStyle: "italic" }}>{plant.scientificName}</p>
              <p>
                Aggiunta il <data value={plant.date}>{plant.date}</data>
                <br /> da <span style={{ fontStyle: "italic" }}>{plant.user?.name}</span>
              </p>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
