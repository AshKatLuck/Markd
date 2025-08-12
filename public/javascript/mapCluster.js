mapboxgl.accessToken = mapboxToken;

let feat=[]


for(let i=0;i<locationsMap.features.length;i++){
    feat[i]={
        type:'Feature',
        properties:{
            title:locationsMap.features[i].title,
            description:`<a href="/locations/${locationsMap.features[i]._id}">${locationsMap.features[i].title},${locationsMap.features[i].city}</a>`,
            hasVisited:locationsMap.features[i].hasTravelled,
        },
        geometry:locationsMap.features[i].geometry,
    }

}


const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/standard",
  center: locationsMap.features[0].geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 2, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl(), "top-right");

//custom markers
// add markers to map
// for (const feature of feat) {
  
//   // code from step 7-1 will go here
  
//     // create a HTML element for each feature
//     const el = document.createElement('div');
//     el.className = 'marker';

//   // make a marker for each feature and add to the map
// //   new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);  // Replace this line with code from step 7-2

//    //code from step 8 will go here
//    new mapboxgl.Marker(el)
//   .setLngLat(feature.geometry.coordinates)
//   .setPopup(
//     new mapboxgl.Popup({ offset: 25 }) // add popups
//       .setHTML(
//         `<h4>${feature.properties.title}</h4><p>${feature.properties.description}</p>`
//       )
//   )
//   .addTo(map);
// }


//  map.on('load', () => {
//         map.addSource('places', {
//             'type': 'geojson',
//             'generateId': true,
//             'data': {
//                 'type': 'FeatureCollection',
//                 'features': feat,
//             }
//         });
   

// // Add a layer showing the places.
//         map.addLayer({
//             'id': 'places',
//             'type': 'circle',
//             'source': 'places',
//             'paint': {
//                 'circle-color': '#4264fb',
//                 'circle-radius': 6,
//                 'circle-stroke-width': 2,
//                 'circle-stroke-color': '#ffffff'
//             }
//         });
      
        

//         const popup = new mapboxgl.Popup({
//                     closeButton: false,
//                     closeOnClick: false,
//                 });

//         map.addInteraction('places-click-interaction', {
//             type: 'click',
//             target: { layerId: 'places' },
//             handler: (e) => {
//                 // Copy coordinates array.
//                 const coordinates = e.feature.geometry.coordinates.slice();
//                 const description = e.feature.properties.description;

//                 new mapboxgl.Popup()
//                     .setLngLat(coordinates)
//                     .setHTML(description)
//                     .addTo(map);
//             }
//         });

//         map.addInteraction('places-mouseenter-interaction', {
//             type: 'mouseenter',
//             target: { layerId: 'places' },
//             handler: (e) => {
//                 map.getCanvas().style.cursor = 'pointer';

//                 // // Copy the coordinates from the POI underneath the cursor
//                 // const coordinates = e.feature.geometry.coordinates.slice();
//                 // const description = e.feature.properties.description;

//                 // // Populate the popup and set its coordinates based on the feature found.
//                 // popup.setLngLat(coordinates).setHTML(description).addTo(map);
//             }
//         });

//         map.addInteraction('places-mouseleave-interaction', {
//             type: 'mouseleave',
//             target: { layerId: 'places' },
//             handler: () => {
//                 map.getCanvas().style.cursor = '';
//                 // popup.remove();
//             }
//         });
// });



feat.forEach(item=>{
    let color="#000000"
    color=(item.properties.hasVisited)?"#09861aff":"#b40219"
    const marker = new mapboxgl.Marker({
        color:color
    })
  .setLngLat(item.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 10, className:"popup", closeButton:false }).setHTML(
      `<div><p>${item.properties.description}</p><div>`
    )
  )
  .addTo(map);
});




  


