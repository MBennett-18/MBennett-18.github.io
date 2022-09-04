let weeklyTweetsDisp = document.querySelector(".weeklyTweets");
let weeklyChangeDisp = document.querySelector(".weeklyChange");
let totalTweetsDisp = document.querySelector(".totalTweets");

let weeklyUsersDisp = document.querySelector(".weeklyUsers");
let weeklyUserChange = document.querySelector(".weeklyUserChange");
let totalUserDisp = document.querySelector(".totalUsers");
let topUserN = document.querySelector(".topN");

let topUserNWeek = document.querySelector(".topN-week");

let weeklyLocationsDisp = document.querySelector(".weeklyLocations");
let weeklyLocationsChange = document.querySelector(".weeklyLocationChange");
let totalLocations = document.querySelector(".totalLocations");

let dailyTitleDisp = document.getElementById("dailyTitle");

// ******** Functions used throughout
// Function to count unique values in array of objects
const uniqueItems = (list, keyFn) => list.reduce((resultSet, item) =>
resultSet.add(typeof keyFn === 'string' ? item[keyFn] : keyFn(item)),new Set).size;

// Title case is prettier
function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return splitStr.join(' '); 
}

// Get ranges for week calcs
const weekStart = new Date();
const weekEnd = new Date();
const priorweekStart = new Date();
weekStart.setDate(weekStart.getDate() - 7);
weekEnd.setDate(weekEnd.getDate());
priorweekStart.setDate(priorweekStart.getDate()-14);


const fetchDailyFlu = fetch('https://tweetscrapestorage.s3.ca-central-1.amazonaws.com/dailyTweets.json').then((response) => response.json());
const fetchDailyCovid = fetch('https://tweetscrapestorage.s3.ca-central-1.amazonaws.com/dailyCovidTweets.json').then((response) => response.json());
const fetchedData = Promise.all([fetchDailyFlu, fetchDailyCovid]);

function loadAndDisplay (dropdownIndex) {
    fetchedData.then((response) => {
        const dailyData = response[dropdownIndex];
        const diseaseName = dropdownIndex === 0 ? 'Flu' : 'COVID';
        // ************ Daily aggregatation *********
        let perDay = new Object();
        dailyData.forEach((d) => {
            perDay[d.dateStr] = perDay[d.dateStr] ? ++perDay[d.dateStr]:1;
        })
        // Filtered array for current week
        const thisWeek = dailyData.filter(function(itm){
            currDate = new Date(itm.dateStr);
            return currDate >= weekStart;
            
        });
        // Filtered array of last week
        const lastWeek = dailyData.filter(function(itm){
            currDate = new Date(itm.dateStr);
            return currDate >= priorweekStart && currDate <=weekStart;
            
        });

        let dailyArray = []
        for (let day in perDay){
            dailyArray.push([day, perDay[day]]);
        };

        // ************ User aggregatation *********
        //*** Starting with overall user counts */
        let perUser = new Object();
        dailyData.forEach((d) => {
            perUser[d.screen_name] = perUser[d.screen_name] ? ++perUser[d.screen_name]:1;
        })
        
        //Push top array so it can be sorted
        let perUserSortable = [];
        for (let user in perUser){
                perUserSortable.push([user, perUser[user]]);
        };
        perUserSortable.sort(function(a,b) {
            return b[1] - a[1];
        });
        //Put back in this format for charting
        const allUserLength = Math.floor(perUserSortable.length*0.01);
        const perUserData = perUserSortable.slice(0,allUserLength).map(val =>({
            'x': val[0],
            'value': val[1]
        }))
        //***Now doing for this week counts 
        let perUserWeek = new Object();
        thisWeek.forEach((d) => {
            perUserWeek[d.screen_name] = perUserWeek[d.screen_name] ? ++perUserWeek[d.screen_name]:1;
        })
        
        let perUserSortWeek = [];
        for (let user in perUserWeek){
                perUserSortWeek.push([user, perUserWeek[user]]);
        };
        perUserSortWeek.sort(function(a,b) {
            return b[1] - a[1];
        });
        //Put back in this format for charting
        const weekUserLength = Math.floor(perUserSortWeek.length*0.09);
        const perUserWeekData = perUserSortWeek.slice(0,weekUserLength).map(val =>({
            'x': val[0],
            'value': val[1]
        }))

        // ************ Location aggregatation *********
        dailyData.forEach((d) => {
            if (d.location) {
                d.location = d.location.toLowerCase();
                if (d.location.includes('halifax')){
                    d.location ='halifax'
                }else if(d.location.includes('moncton')){
                    d.location = 'moncton';
                }else if(d.location.includes('dartmouth')){
                    d.location = 'dartmouth';
                }else if(d.location.includes('the ocean')){
                    d.location = 'the ocean';
                }else if(d.location.includes('cole harbour')){
                    d.location = 'cole harbour';
                }
            }
        })
        // Count tweets by location
        let perLoc = new Object();
        dailyData.forEach((d) => {
            perLoc[d.location] = perLoc[d.location] ? ++perLoc[d.location]:1;
        })
        //Get number of tweets per location to display
        let minTweets = diseaseName==='Flu' ? 5 : 3;
        let perLocSortable = [];
        for (let loc in perLoc){
            if(perLoc[loc]>=minTweets) {
                perLocSortable.push([titleCase(loc), perLoc[loc]]);
            }
        };
        perLocSortable.sort(function(a,b) {
            return b[1] - a[1];
        });
        //********************* Charting below *******************

        // ****** Tweets per Day ********
        const dailyChart = anychart.area();
        const dailySeries = dailyChart.splineArea(dailyArray);
        // Settings
        dailySeries.fill('#002b36');
        dailySeries.stroke('#000000');
        dailySeries.name("Tweets");
        dailyChart.xAxis().labels().rotation(-45);
        //Draw
        dailyChart.container("dailyTweetsViz");
        dailyChart.draw();

        // ***** All users charting ****
        const allUsersChart = anychart.polar();
        const allUsersSeries = allUsersChart.column(perUserData);
        //SETTINGS
        allUsersSeries.fill('#0c6858');
        allUsersSeries.stroke('#000000');
        allUsersSeries.name("Tweets");
        allUsersChart.xScale("ordinal");
        allUsersChart.sortPointsByX(true);
        allUsersChart.innerRadius(50);
        //Draw
        allUsersChart.container("allUsers");
        allUsersChart.draw();
        
        // **** Top weekly users ****
        const weeklyUsersChart = anychart.polar();
        const weeklyUsersSeries = weeklyUsersChart.column(perUserWeekData);
        // Settings
        weeklyUsersSeries.fill('#0c6858');
        weeklyUsersSeries.stroke('#000000');
        weeklyUsersSeries.name("Tweets");
        weeklyUsersChart.xScale("ordinal");
        weeklyUsersChart.yScale().ticks().interval(3);
        weeklyUsersChart.sortPointsByX(true);
        weeklyUsersChart.innerRadius(50);
        // Draw
        weeklyUsersChart.container("weekUsers");
        weeklyUsersChart.draw();
        
        // ****** Per Location charting ********
        const locationChart = anychart.bar();
        const locationSeries = locationChart.bar(perLocSortable);
        // Settings
        locationSeries.fill("#3f2435");
        locationSeries.stroke("#000000");
        locationSeries.name("Tweets");
        //Draw
        locationChart.container("locationGraphViz");
        locationChart.draw();

        //*************** Display key banners *************
        //Tweets
        weeklyTweetsDisp.textContent = thisWeek.length;
        weeklyChangeDisp.textContent = thisWeek.length - lastWeek.length;
        totalTweetsDisp.textContent = dailyData.length;
        //Users
        weeklyUsersDisp.textContent = uniqueItems(thisWeek, 'screen_name');
        weeklyUserChange.textContent = uniqueItems(thisWeek, 'screen_name') - uniqueItems(lastWeek, 'screen_name')
        totalUserDisp.textContent = uniqueItems(dailyData, "screen_name");
        topUserN.textContent = allUserLength;
        topUserNWeek.textContent = weekUserLength;
        //Locations
        weeklyLocationsDisp.textContent = uniqueItems(thisWeek,'location');
        weeklyLocationsChange.textContent = uniqueItems(thisWeek,'location') - uniqueItems(lastWeek, 'location');
        totalLocations.textContent = uniqueItems(dailyData, 'location'); 
        //Setting titles
        document.getElementById('dailyTitle').textContent = diseaseName==='Flu' ? "Number of Daily Flu Tweets in the Maritimes" : "Number of Daily COVID-19 Tweets in HRM";
        document.getElementById("diseaseHeader1").textContent = diseaseName;
        document.getElementById("diseaseHeader2").textContent = diseaseName;
    });
}

let apiFluCorpus = 'https://tweetscrapestorage.s3.ca-central-1.amazonaws.com/fluCorpus.json';
let apiCovidCorpus = 'https://tweetscrapestorage.s3.ca-central-1.amazonaws.com/covidCorpus.json';
function createWordCloud(apiCorpus, htmlID){
    fetch(apiCorpus,{method: "GET",mode: 'cors'})
    .then(response => response.json())
    .then(corpusData => {
        //Change object keys to keys in anychart
        const corpusKeyFormat = corpusData.map(e => ({x: e.word, value:e.n , category:e.sentiment}));
        const corpusFormat = corpusKeyFormat.slice(0,100);
        
        //Create chart and color scale
        const corpusChart = anychart.tagCloud(corpusFormat);
        const customColorScale = anychart.scales.ordinalColor();
        //Settings
        customColorScale.colors(["#6f6f6f", "#8a0000", "#3e733d"]);
        corpusChart.angles([0,0]);
        corpusChart.colorScale(customColorScale);
        corpusChart.colorRange().enabled(true);
        // Draw
        corpusChart.container(htmlID);
        corpusChart.draw();    
    });
}

let dropDown = document.getElementById("diseaseDropdown");
dropDown.onchange = function(){
    document.getElementById('allUsers').textContent = '';
    document.getElementById('weekUsers').textContent = '';
    document.getElementById('dailyTweetsViz').textContent = '';
    document.getElementById('locationGraphViz').textContent = '';
    let newVal = dropDown.value;
    loadAndDisplay(newVal);
}

loadAndDisplay(0);

createWordCloud(apiFluCorpus, 'fluCloud');
createWordCloud(apiCovidCorpus, 'covidCloud');
