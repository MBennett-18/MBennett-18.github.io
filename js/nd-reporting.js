let meanMetricDisp = document.querySelector(".meanMetric");
let metricDisp = document.getElementById("ndMetric")

const apiCounts = "https://data.novascotia.ca/resource/mdfn-jkdg.json";
const dropDownDisease = document.getElementById("diseaseDropdown");
const dropDownMetric= document.getElementById("metricDropdown");


function makeViz(dropDownDisease, dropDownMetric){
    fetch(apiCounts)
    .then(apiResponse => apiResponse.json())
    .then(apiData => { 
        const metric = dropDownMetric === "Counts" ? 2 : 3;
        const filteredData = apiData.filter(function (el) {
            return el.disease === dropDownDisease;
        });
        const dataSortable = filteredData.map(Object.values);

        dataSortable.sort(function(a,b) {
            return a[0] - b[0];
        });

        const parseMetric = dataSortable.map(x => {
            getStr = x[metric];
            return Number(getStr);
        });

        const annualMean = parseMetric.reduce((a,b)=> a+b,0)/parseMetric.length;

        meanMetricDisp.textContent = Math.round(annualMean*100)/100;
        metricDisp.textContent = dropDownMetric;
        
        // create a chart
        const data = anychart.data.set(dataSortable)
        const seriesData = data.mapAs({x: 0, value: metric});
        const chart = anychart.area();
        const series = chart.area(seriesData);

        series.name(dataSortable[0][1]);
        chart.yScale().minimum(0);
        chart.xScale().mode('continuous');
        chart.xAxis().title("Year");
        chart.yAxis().title(dropDownMetric);

        chart.container("annualCounts-id");

        // initiate drawing the chart
        chart.draw();
    });
}

makeViz(dropDownDisease.value, dropDownMetric.value);

dropDownDisease.onchange = function(){
    document.getElementById('annualCounts-id').textContent = '';
    let newValDisease = dropDownDisease.value;
    let newValMetric = dropDownMetric.value;
    makeViz(newValDisease,newValMetric);
}
dropDownMetric.onchange = function(){
    document.getElementById('annualCounts-id').textContent = '';
    let newValDisease = dropDownDisease.value;
    let newValMetric = dropDownMetric.value;
    makeViz(newValDisease,newValMetric);
}