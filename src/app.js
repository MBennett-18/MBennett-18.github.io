let lat;
let long;
//Setting html objects here
let summaryDesc = document.querySelector(".temperature-description");
let tempDegree = document.querySelector(".temperature-degree");
let locationTimezone = document.querySelector(".location-timezone");
let todaysDate = document.querySelector(".date");

//Create array of month names to use on date
const months = ["Janurary","February", "March", "April", "Mary", "June", "July", "August", "September", "October", "November", "December"];
const today  = new Date();
const currentMonth = months[today.getMonth()];
const currentDay = today.getDay();
const currentYear = today.getFullYear();
const dateString = `${currentMonth} ${currentDay}, ${currentYear}`;
console.log(dateString);

todaysDate.textContent = dateString;

// If location is known, then go ahead
if (navigator.geolocation) {
  // position is the callbal function
  navigator.geolocation.getCurrentPosition((position) => {
    lat = position.coords.latitude;
    long = position.coords.longitude;

    // Using key and coords, create the api call
    const apiKey = "84548dc707117dbfac6bb61bb142f517";
    const apiCall = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`;

    // waiting for response from API and returning json
    fetch(apiCall)
      .then((apiResponse) => {
        return apiResponse.json();
      })
      .then((apiData) => {
        //parse out data and convert to C
        const temp = Math.round((apiData.main.temp - 273) * 10) / 10;
        const summary = apiData.weather["0"].main;
        const timezone = apiData.name;
        const icon = apiData.weather["0"].icon;
        const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        //console.log(iconURL);
        // Set DOM elements from API call
        tempDegree.textContent = temp;
        summaryDesc.textContent = summary;
        locationTimezone.textContent = timezone;
        document.getElementById("icon").src = iconURL;
      });
  });
}
//function setIcons(icon, iconID){
//const skycons = new skycons({color: "white"});
//const currentIcon =
//}
