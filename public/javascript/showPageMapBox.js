mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/satellite-streets-v12",
  center: locationMap.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 4, // starting zoom
});