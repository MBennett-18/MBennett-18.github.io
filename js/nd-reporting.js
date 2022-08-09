
const apiCall = "https://data.novascotia.ca/resource/mdfn-jkdg.json";

const typeName = "Chlamydia"

const margin = {top: 10, right: 30, bottom: 30, left: 60};
const width = 460 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;


//     // append the svg object to the body of the page
// const svg = d3.select("#theViz")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`);

// d3.csv("https://data.novascotia.ca/resource/mdfn-jkdg.csv")
//     .then(function (data) {
//     console.log(data.cases.max);
//     const x = d3.scaleLinear()
//     .domain([0,data.cases.max])
// })


    // fetch(apiCall) https://d3-graph-gallery.com/graph/scatter_basic.html
    // .then(apiResponse => apiResponse.json())
    // .then(apiData => {
    //     const diseaseData = apiData.filter(function (entry){
    //         return entry.disease === "Pertussis" || entry.disease === "Campylobacteriosis";
    //     })
    //     const apiFormat = Object.values(diseaseData.reduce((acc, {year, disease, number_of_cases, rate_per_100_000_population}) => {
    //         acc[disease]??={disease, year:[], cases:[], rate:[]};
    //         acc[disease].year.push(parseInt(year));
    //         acc[disease].cases.push(parseInt(number_of_cases));
    //         acc[disease].rate.push(parseFloat(rate_per_100_000_population));
    //         return acc
    //     },{}))

    //     console.log(apiFormat);