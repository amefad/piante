import L from "leaflet";
// import greenIconRef from "../assets/markers/map-pin.svg";
// import redIconRef from "../assets/markers/map-pin-red.svg";
// import shadowRef from "../assets/markers/custom-shadow.png";

// Well Known Coords
const CONEGLIANO = {
  center: L.latLng([45.887222, 12.296944]),
  bounds: L.latLngBounds(
    Object.values({
      easternmost: L.latLng([45.866446, 12.333395]),
      northernmost: L.latLng([45.947274, 12.323518]),
      southernmost: L.latLng([45.860204, 12.326402]),
      westernmost: L.latLng([45.903145, 12.24726]),
    })
  ),
};

// Icons
let defaultIconSize = L.Icon.Default.prototype.options.iconSize as [
  number,
  number,
];

let iconSizeNormal = defaultIconSize.map((pts) => pts + 5) as [number, number];
let iconSizeBigger = defaultIconSize.map((pts) => pts + 10) as [number, number];

const customIconOpts: L.IconOptions = {
  ...L.Icon.Default.prototype.options,
  iconSize: iconSizeNormal,
  iconUrl: "./markers/map-pin.svg",
  iconRetinaUrl: "./markers/map-pin.svg",
  shadowUrl: "./markers/custom-shadow.png",
};

const biggerCustomIconOpts: L.IconOptions = {
  ...L.Icon.Default.prototype.options,
  iconSize: iconSizeBigger,
  iconUrl: "./markers/map-pin-red.svg",
  iconRetinaUrl: "./markers/map-pin-red.svg",
  shadowUrl: "./markers/custom-shadow.png",
};

const customIcon = L.icon(customIconOpts);
const biggerCustomIcon = L.icon(biggerCustomIconOpts);

// TODO try to set icons defaults for layer groups
// L.Marker.prototype.options.icon = customIcon;

//  Layers
// base layers
const osmLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: 12,
  maxZoom: 21,
  maxNativeZoom: 19, // OSM tiles max available zoom
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});
const baseMaps = { 
  OpenStreetMap: osmLayer,
  // TODO add satellite
};

//  Groups and overlays layers
const formMarkers = L.layerGroup();
const trees = L.layerGroup();

// Maps
let map: any;
map = L.map("map", { layers: [osmLayer, formMarkers, trees] }).fitBounds(
  CONEGLIANO.bounds
);

// Controls
L.control.layers(baseMaps).addTo(map);



import type { TreePlant } from "src/consts";

// TODO
function addNewLayerToTrees(tree: TreePlant) {
  // const latitude = parseFloat(tree.latitude);
  const latitude = tree.latitude;
  const longitude = tree.longitude;
  console.log(`addNewLayer: ${tree.latitude}, ${tree.longitude}`);

  if (latitude && longitude) {
    trees.addLayer(
      L.marker([latitude, longitude], { icon: customIcon }).bindPopup(
        `its a ${tree["scientific-name"] || "boh"}`
      )
    );
  }
}

/**
 *
 * @param aFunction
 * @returns
 */
function registerClickFunc(aFunction: (lat: number, lng: number) => void) {
  const handler = (e: L.LeafletMouseEvent) => {
    const inLat = e.latlng.lat;
    const inLng = e.latlng.lng;
    // show a marker only for the last click
    formMarkers.clearLayers();
    // add a marker on the clicked location
    formMarkers.addLayer(L.marker([inLat, inLng], { icon: biggerCustomIcon }));
    // call
    aFunction(inLat, inLng);
  };
  //
  map.on("click", handler);
  // return a fun to unregister this same listener
  const unregisterClickFunc = () => {
    map.off("click", handler);
  };
  return unregisterClickFunc;
}

function cleanFormLayer() {
  formMarkers.clearLayers();
}


export { CONEGLIANO, registerClickFunc, addNewLayerToTrees, cleanFormLayer };
