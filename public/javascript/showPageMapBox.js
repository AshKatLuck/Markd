mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/standard",
  center: locationMap.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 4, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl(), "top-right");

const marker = new mapboxgl.Marker()
  .setLngLat(locationMap.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${locationMap.title}</h3><p>${locationMap.city}</p>`
    )
  )
  .addTo(map);