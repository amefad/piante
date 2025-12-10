import { useEffect, useCallback } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, AttributionControl } from "react-leaflet";
import { useMapContext } from "./MapContext";
import "leaflet/dist/leaflet.css";
import "./Map.scss";

const bounds = [
  [46.05, 12.52], // NE corner
  [45.7, 12.13], // SW corner
];
const initialCenter = [45.8869, 12.29733];
const marker = L.icon({
  iconUrl: `${import.meta.env.BASE_URL}/markers/map-pin.svg`,
  iconAnchor: [9, 9],
});
const placer = L.icon({
  iconUrl: `${import.meta.env.BASE_URL}/markers/map-pin-red.svg`,
  iconAnchor: [12, 24],
});

function CenterMarker() {
  const mapState = useMapContext();
  const onMove = useCallback(() => {
    const mapCenter = mapState.map.getCenter();
    mapState.setPlantLocation([mapCenter.lat, mapCenter.lng]);
  }, [mapState?.map]);

  useEffect(() => {
    mapState?.map?.on("move", onMove);
    mapState?.map?.on("zoom", onMove);
  }, [onMove]);

  return mapState && mapState.step > 0 ? (
    <Marker position={mapState.plantLocation} icon={placer} />
  ) : null;
}

export default function Map({ data, active = false }) {
  const mapState = useMapContext();

  return (
    <div className="map">
      <div className="status">
        {data.error && <p className="error">{data.error.message}</p>}
        {data.isLoading && <p>Loading...</p>}
      </div>
      <MapContainer
        center={initialCenter}
        maxBounds={bounds}
        maxBoundsViscosity={0.9}
        zoom={13}
        dragging={active}
        scrollWheelZoom={active}
        doubleClickZoom={active}
        boxZoom={active}
        touchZoom={active}
        keyboard={active}
        zoomControl={false}
        attributionControl={false}
        ref={mapState?.setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          minZoom={11}
          maxZoom={21}
        />
        <AttributionControl prefix={false} position="bottomright" />
        {data.plants
          ?.filter((plant) => plant.latitude && plant.longitude)
          .map((plant) => (
            <Marker position={[plant.latitude, plant.longitude]} icon={marker} key={plant.id}>
              <Popup>
                <div style={{ fontWeight: "bold", fontSize: "1.2em" }}>
                  {plant.species.scientificName}
                </div>
                {plant.species.commonName}
                <br />
                <mark>{plant.species.warning}</mark>
                <p>
                  Aggiunta il <data value={plant.date}>{plant.date}</data>
                  <br />
                  da <span style={{ fontStyle: "italic" }}>{plant.user?.name}</span>
                </p>
              </Popup>
            </Marker>
          ))}
        <CenterMarker />
      </MapContainer>
    </div>
  );
}
