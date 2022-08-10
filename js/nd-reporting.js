
const csvLink = "https://data.novascotia.ca/resource/mdfn-jkdg.csv";

const typeName = "Chlamydia"

d3.csv(csvLink, function(d){
    return d.disease === "Chlamydia";})