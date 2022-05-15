// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

function updateChart(){
  // Create a map object.
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 1.5
});

// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

  d3.json(queryUrl).then(data => {
    var fullList = data.features;



  var locList = [];
  var placeList = [];
  var depthList = [];
  var titleList = [];
  var newList = [];
  var magList = [];

 for (i = 0; i < fullList.length; i++) {
   locTemp = fullList[i].geometry.coordinates;

  locList.push([fullList[i].geometry.coordinates[1], fullList[i].geometry.coordinates[0]]);
  placeList.push([fullList[i].properties.place]);
  depthList.push([fullList[i].geometry.coordinates[2]]);
  titleList.push([fullList[i].properties.title]);
  magList.push([fullList[i].properties.mag]);


 }
 newList.push({"location": locList, "place": placeList, "Depth": depthList, "title": titleList, "magnitude": magList});
 console.log("Data", fullList);
 console.log("Location", locList);
 console.log("Place", placeList);
 console.log("Depth", depthList);
 console.log("Magnitude", magList);
 console.log("New List", newList);
 console.log("----", newList[0].location.length);
 for (j = 0; j<newList[0].location.length; j++) {
   // Add circles to the map.
   L.circle(newList[0].location[j], {
    
    fillColor: cdepth(newList[0].Depth[j]),
    color: "#000",
    weight: 0.3,
    opacity: 0.5,
    fillOpacity: 10,
     // Adjust the radius.
     radius: (newList[0].magnitude[j])*50000
     }).bindPopup(`<h1>${newList[0].place[j]}</h1> <h2>Magnitude: ${newList[0].magnitude[j]}</br> Depth: ${newList[0].Depth[j]}<hr>`).addTo(myMap);

     
    }
});
  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var depths = [-10, 10, 30, 70, 90];
      var labels = [];
      var legendInfo = "<h5>Depth</h5>";

      div.innerHTML = legendInfo;

      // go through each magnitude item to label and color the legend
      // push to labels array as list item
      var depReturn = [];
      var depInput = [];
      for (var i = 0; i < depths.length; i++) {
        
        depReturn.push(cdepth([depths[i]+1]));
        depInput.push(cdepth[i]+1);

          labels.push('<li style="background-color:' + depReturn[i]+ '"> <span>' + depths[i] + (depInput ? '&ndash;' + depths[i + 1] + '' : '+') + '</span></li>');
          console.log("test", depReturn);
          console.log("input", depInput);
          
      }

      // add each label list item to the div under the <ul> tag
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";

      return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

function cdepth(sample) {

console.log("Sample", sample[0]);


if (sample[0] <10) {
  return  "#896FDF";
} else if (sample[0] <= 30) {
  return "#ED2939";
} else if (sample[0] <= 50) {
return  "#FFF200";
} else if (sample[0] <= 70) {
return  "#F9A602";
} else if (sample[0] <= 90) {
return  "#98FB98";
} else {
return "#0018F9";
}

 }


  }
updateChart();