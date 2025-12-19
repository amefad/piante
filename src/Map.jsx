import { useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, AttributionControl } from "react-leaflet";
import { useApp } from "./AppContext";
import { useMap } from "./MapContext";
import { timeAgo } from "./libs/various";
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
const selectedMarker = L.icon({
  iconUrl: `${import.meta.env.BASE_URL}/markers/map-pin-selected.svg`,
  iconAnchor: [9, 9],
});
const placer = L.icon({
  iconUrl: `${import.meta.env.BASE_URL}/markers/map-pin-red.svg`,
  iconAnchor: [12, 24],
});

export default function Map({ data, active = false }) {
  const { mapView, setMapView } = useApp();
  const mapState = useMap();
  const location = useLocation();

  const onMove = useCallback(() => {
    const mapZoom = mapState.map.getZoom();
    const mapCenter = mapState.map.getCenter();
    mapState.setPlantLocation([mapCenter.lat, mapCenter.lng]);
    if (location.pathname == "/map") {
      setMapView({ zoom: mapZoom, coords: [mapCenter.lat, mapCenter.lng] });
    }
  }, [mapState?.map]);

  useEffect(() => {
    mapState?.map?.on("move", onMove);
    mapState?.map?.on("zoom", onMove);
  }, [onMove]);

  // Sets map zoom and position at loading
  useEffect(() => {
    if (data.selected) {
      mapState?.map?.setView([data.selected.latitude, data.selected.longitude], 19);
    } else {
      mapState?.map?.setView([mapView.coords[0], mapView.coords[1]], mapView.zoom);
    }
  }, [mapState?.map]);

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
          .filter((plant) => {
            return !(mapState?.step > 0 && plant.id == data.selected?.id);
          })
          .map((plant) => (
            <Marker
              position={[plant.latitude, plant.longitude]}
              icon={plant.id == data.selected?.id ? selectedMarker : marker}
              key={plant.id}
            >
              {active && (
                <Popup>
                  <div style={{ fontWeight: "bold", fontSize: "1.2em" }}>
                    {plant.species.scientificName}
                  </div>
                  {plant.species.commonName}
                  <br />
                  <mark>{plant.species.warning}</mark>
                  <p>
                    Aggiunta {timeAgo(plant.date)} da <strong>{plant.user?.name}</strong>
                  </p>
                  <Link to={`/plant/${plant.id}`}>Dettagli</Link>
                </Popup>
              )}
            </Marker>
          ))}
        {mapState?.step > 0 && <Marker position={mapState.plantLocation} icon={placer} />}
      </MapContainer>
    </div>
  );
}
