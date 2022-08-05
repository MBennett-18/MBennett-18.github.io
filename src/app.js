let lat;
let long;
//Setting html objects here
let summaryDesc = document.querySelector(".temperature-description");
let tempDegree = document.querySelector(".temperature-degree");
let locationTimezone = document.querySelector(".location-timezone");
let todaysDate = document.querySelector(".welcome-date");
let body = document.getElementById("gradient");

//Create array of month names to use on date
const months = ["Janurary","February", "March", "April", "Mary", "June", "July", "August", "September", "October", "November", "December"];
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const today  = new Date();
//get date sections to create string
const currentMonth = months[today.getMonth()];
const currentWeekday = daysOfWeek[today.getDay()];
const currentDay = today.getDay();
const currentYear = today.getFullYear();
const dateString = `${currentWeekday}, ${currentMonth} ${currentDay}, ${currentYear}`;
//Setting html element
todaysDate.textContent = dateString;

// If location is known, then go ahead with weather conditions
if (navigator.geolocation) {
  // position is the callbal functions
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
        const summaryRaw = apiData.weather["0"].description;
        const summary = summaryRaw.charAt(0).toUpperCase() + summaryRaw.slice(1);
        const timezone = apiData.name;
        //Set icon
        const icon = apiData.weather["0"].icon;
        const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        //console.log(iconURL);
        // Set DOM elements from API call
        tempDegree.textContent = temp;
        summaryDesc.textContent = summary;
        locationTimezone.textContent = timezone;
        document.getElementById("icon").src = iconURL;

        // Change background based on conditions
        //Determine weather


        fetch('src/conditionGradients.json')
        .then(response => response.json())
        .then(gradData => {
          //const currentDesc = apiData.weather["0"].main;
          const currentDesc = "Mist";
          const grad = gradData[currentDesc].startGrad;
          body.style.background = "linear-gradient(" + gradData[currentDesc].startGrad + "," + gradData[currentDesc].endGrad +")";
          body.style.color = gradData[currentDesc].font ;
          CSS.textContent = body.style.background;
          CSS.textContent = body.style.color;

        });
      });
  });
}
