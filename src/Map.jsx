import { useContext, useCallback } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, AttributionControl } from "react-leaflet";
import { MapContext } from "./MapContext";
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
  const mapState = useContext(MapContext);
  const onMove = useCallback(() => {
    const mapCenter = mapState.map.getCenter();
    mapState.setCenter([mapCenter.lat, mapCenter.lng]);
  }, [mapState?.map]);
  mapState?.map?.on("move", onMove);
  mapState?.map?.on("zoom", onMove);

  return mapState && mapState.step > 0 ? (
    <Marker position={mapState.map.getCenter()} icon={placer} />
  ) : null;
}

export default function Map({ data, active = false }) {
  const mapState = useContext(MapContext);

  return (
    <>
      {data.isError && <div>failed to load</div>}
      {data.isLoading && <div>loading...</div>}
      <MapContainer
        center={initialCenter}
        maxBounds={bounds}
        maxBoundsViscosity={0.9}
        zoom={13}
        zoomControl={active}
        dragging={active}
        scrollWheelZoom={active}
        doubleClickZoom={active}
        boxZoom={active}
        touchZoom={active}
        keyboard={active}
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
    </>
  );
}
