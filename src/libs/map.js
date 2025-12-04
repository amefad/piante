export const disableMap = (map) => {
  map.dragging.disable();
  map.scrollWheelZoom.disable();
  map.doubleClickZoom.disable();
  map.boxZoom.disable();
  map.touchZoom.disable();
  map.keyboard.disable();
};

export const enableMap = (map) => {
  map.dragging.enable();
  map.scrollWheelZoom.enable();
  map.doubleClickZoom.enable();
  map.boxZoom.enable();
  map.touchZoom.enable();
  map.keyboard.enable();
};

export const moveMap = (map) => {
  setTimeout(() => {
    const panelHeight = document.getElementsByClassName("panel")[0].clientHeight;
    map.panBy([0, panelHeight / 2]);
  }, 200);
};
