//GeoJson API url
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//Set base map
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

//loads tilt layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//initiate function with connection of GeoJson
d3.json(url). then(function(data) {
    createEathquakeVis(data.features);
    console.log(data.features[0].geometry.coordinates[2])
});

//define color with respect to earthquake depth level
function depthColor(depth) {
    if (depth <= 10) return "lime";
    else if (depth > 10 && depth <= 30) return "yellow";
    else if (depth > 30 && depth <= 50) return "orange";
    else if (depth > 50 && depth <= 70) return "pink";
    else if (depth > 70 && depth <= 90) return "red";
    else return "maroon";
};


function createEathquakeVis(data) {
//function to change point data to circle marker
    function pointToLayer(feature, latlng) {
        return L.circleMarker(latlng,{
            radius: feature.properties.mag*10,
            fillColor: depthColor(feature.geometry.coordinates[2]),
            color: "white",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        })
    };

    //give pop-up message for each data point (information about location, time, magnitude and depth)
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}<br>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]}</p>`);
    };

    //call both function with geoJson and add it to map
    L.geoJSON(data, {
        pointToLayer: pointToLayer,
        onEachFeature: onEachFeature
    }).addTo(myMap);
};


//set legend position - see README for legend reference
let legend = L.control({position: 'bottomright'});

//Function to generate the legend content *(need additioanl style to CSS file)
legend.onAdd = function(map) {
    let div = L.DomUtil.create('div', 'info legend');
    let groups = [10,30,50,70,90,110];
    let labels = ["<=10","10-30","30-50","50-70","70-90","90+"];
    
    //Add title to the legend
    div.innerHTML += '<h4>Depth Indicators</h4>';
    
    //Add categories and corresponding colors
    for (let i = 0; i < groups.length; i++) {
        div.innerHTML += '<i style="background:' + depthColor(groups[i]) + '"></i> '
            + labels[i] + '<br>';
    }

    return div;
};

//Add legend to the map
legend.addTo(myMap);