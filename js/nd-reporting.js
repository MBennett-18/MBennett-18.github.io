

const apiCounts = "https://data.novascotia.ca/resource/mdfn-jkdg.json";
fetch(apiCounts)
.then(apiResponse => apiResponse.json())
.then(apiData => { 
    const filteredData = apiData.filter(function (el) {
        return el.disease === "Chlamydia";
      });
    const dataSortable = filteredData.map(Object.values);

    dataSortable.sort(function(a,b) {
        return a[0] - b[0];
    });

// const seriesName = dataSortable[0][1]
// create a chart
const data = anychart.data.set(dataSortable)
var seriesData = data.mapAs({x: 0, value: 2});
var chart = anychart.line();
var series = chart.line(seriesData);

// set the titles of the axes
// set the container id
chart.container("annualCounts-id");

// initiate drawing the chart
chart.draw();
});




