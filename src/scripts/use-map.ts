import L from "leaflet";

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

//  Layers
// base layers
const osmLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});
const baseMaps = { OpenStreetMap: osmLayer };

// Icons
const greenIconUrl = "/markers/map-pin.svg";
const redIconUrl = "/markers/map-pin-red.svg";
let defaultIconSize = L.Icon.Default.prototype.options.iconSize as [
  number,
  number,
];

let iconSizeNormal = defaultIconSize.map((pts) => pts + 5) as [number, number];
let iconSizeBigger = defaultIconSize.map((pts) => pts + 10) as [number, number];

const customIconOpts: L.IconOptions = {
  ...L.Icon.Default.prototype.options,
  iconSize: iconSizeNormal,
  iconUrl: greenIconUrl,
  iconRetinaUrl: greenIconUrl,
  shadowUrl: "/markers/custom-shadow.png",
};

const biggerCustomIconOpts: L.IconOptions = {
  ...L.Icon.Default.prototype.options,
  iconSize: iconSizeBigger,
  iconUrl: redIconUrl,
  iconRetinaUrl: redIconUrl,
  shadowUrl: "/markers/custom-shadow.png",
};

const customIcon = L.icon(customIconOpts);
const biggerCustomIcon = L.icon(biggerCustomIconOpts);

// set new default icon
L.Marker.prototype.options.icon = customIcon;

// TODO try to set icons defaults for layer groups
//  Groups and overlays layers
const formMarkers = L.layerGroup();
const trees = L.layerGroup();

// Controls
const layersControl = L.control.layers(baseMaps);

// Maps
let map: any;
map = L.map("map", { layers: [osmLayer, formMarkers] }).fitBounds(
  CONEGLIANO.bounds
);
layersControl.addTo(map);

/**
 *
 *
 *
 * sample item from response:
 *
 * {
 *   "id": 5,
 *   "number": 123,
 *   "latitude": 45.8851066,
 *   "longitude": 12.2921521,
 *   "height": "15.0",
 *   "circumference": 50,
 *   "common-name": "Quercia",
 *   "scientific-name": "Quercus ilex",
 *   "date": "2025-03-16 11:24:39",
 *   "user": {
 *     "id": 3,
 *     "name": "amedeo",
 *     "email": "fame@libero.it"
 *   },
 *   "images": [
 *     {
 *       "id": 4,
 *       "file-path": "../uploads/picture.jpg"
 *     }
 *   ]
 * }
 */
async function getData() {
  const url = "/api/alberi.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    populate(json.data);
  } catch (error: any) {
    console.error(error.message);
  }
}

// TODO import type
type TreePlant = {
  latitude: string;
  longitude: string;
  "scientific-name": string;
  circumference: string;
  height: string;
};

// TODO
function addNewLayerToTrees(tree: TreePlant) {
  const latitude = parseFloat(tree.latitude);
  const longitude = parseFloat(tree.longitude);
  if (latitude && longitude) {
    trees.addLayer(
      L.marker([latitude, longitude]).bindPopup(
        `its a ${tree["scientific-name"] || "boh"}`
      )
    );
  }
}

function populate(data: TreePlant[]) {
  data.forEach(addNewLayerToTrees);
  trees.addTo(map);
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

getData();

export { CONEGLIANO, registerClickFunc, addNewLayerToTrees, cleanFormLayer };
export type { TreePlant };
