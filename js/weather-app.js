let lat;
let long;
//Setting html objects here
let summaryDesc = document.querySelector(".temperature-description");
let tempDegree = document.querySelector(".temperature-degree");
let locationTimezone = document.querySelector(".location-timezone");
let todaysDate = document.querySelector(".welcome-date");
let body = document.getElementById("gradient");
let color1 = document.getElementById("circle1");
let color2 = document.getElementById("circle2");
let color3 = document.getElementById("circle3");
let color4 = document.getElementById("circle4");
let color5 = document.getElementById("circle5");

//Create array of month names to use on date
const months = ["Janurary","February", "March", "April", "Mary", "June", "July", "August", "September", "October", "November", "December"];
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const today  = new Date();
const dateString = daysOfWeek[today.getDay()] + ", " + months[today.getMonth()] + " " + today.getDate() +", " +today.getFullYear();
//Setting html element
todaysDate.textContent = dateString;

// position is the callbal functions
navigator.geolocation.getCurrentPosition(position => {
  lat = position.coords.latitude;
  long = position.coords.longitude;

  // Using key and coords, create the api call
  const apiKey = "84548dc707117dbfac6bb61bb142f517";
  const apiCall = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`;

  // waiting for response from API and returning json
  fetch(apiCall)
    .then(apiResponse => apiResponse.json())
    .then(apiData => { 
      //parse out data and convert to C
      const temp = Math.round((apiData.main.feels_like - 273) * 10) / 10;
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
      fetch('/src/conditionGradients.json')
        .then(response => response.json())
        .then(gradData => {
          const currentDesc = apiData.weather["0"].main;
          //const currentDesc = "Clouds";
          body.style.background = "linear-gradient(" + gradData[currentDesc].startGrad + "," + gradData[currentDesc].endGrad +")";
          body.style.color = gradData[currentDesc].font ;
          CSS.textContent = body.style.background;
          CSS.textContent = body.style.color;
        });
      // Get seed for pallete, and then generator pallete from seed
      const weatherMain = apiData.weather["0"].main.toLowerCase();
      const apiSeedCall = `https://www.colr.org/json/tag/${weatherMain}`;
      fetch(apiSeedCall)
        .then(responseSeed => responseSeed.json())
        .then(seedData => {
          let seedArr = [];
          //console.log(seedData);
          for(let color in seedData.colors){
            let curHex = seedData.colors[color].hex;
            seedArr.push(curHex); 
          }
          //Select random color from seed array
          const inputHex = seedArr[Math.floor(Math.random() *  seedArr.length)];
          const schemes = ['monochrome', 'monochrome-dark', 'monochrome-dark','analogic','complement', 'analogic-complement','triad','quad'];

          const randScheme = Math.floor(Math.random() * (schemes.length - 0));
          const currScheme = schemes[randScheme];
          // Using starting hex as seed, generate random pallete
          const apiColorCall = `https://www.thecolorapi.com/scheme?hex=${inputHex}&format=json&mode=${currScheme}&count=5`;
          fetch(apiColorCall)
            .then(responseCol => responseCol.json())
            .then(colorData => { 
              let hexArr = [];
              for(let color in colorData.colors){
                let curHex = colorData.colors[color].hex.value;
                hexArr.push(curHex);
              }
              //Adjust DOM objects here, TODO: come back to loop later
              // Changing color
              color1.style.background = hexArr[0];
              color2.style.background = hexArr[1];
              color3.style.background = hexArr[2];
              color4.style.background = hexArr[3];
              color5.style.background = hexArr[4];
              CSS.textContent = color1.style.color;
              CSS.textContent = color2.style.color;
              CSS.textContent = color3.style.color;
              CSS.textContent = color4.style.color;
              CSS.textContent = color5.style.color;
              //Hover over for hex code
              color1.title = hexArr[0];
              color2.title = hexArr[1];
              color3.title = hexArr[2];
              color4.title = hexArr[3];
              color5.title = hexArr[4];
            });
        });
    });
},geoFail(),{timeout:50000});

// Catch when location services off
function geoFail() {
  console.log("rough");
  body.style.color = "black";
  CSS.textContent = body.style.color;
  locationTimezone.textContent = "Unknown Location";
  tempDegree.textContent = "Allow location services"
}