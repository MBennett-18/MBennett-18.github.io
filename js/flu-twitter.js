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

//let awsLink = 'https://tweetscrapestorage.s3.ca-central-1.amazonaws.com/dailyCovidTweets.json';
let apiDailyTweets = 'https://tweetscrapestorage.s3.ca-central-1.amazonaws.com/dailyTweets.json';
let apiCorpus = 'https://tweetscrapestorage.s3.ca-central-1.amazonaws.com/fluCorpus.json';
let apiSentiment = 'https://tweetscrapestorage.s3.ca-central-1.amazonaws.com/dailyTweets.json';

fetch(apiDailyTweets,{method: "GET",mode: 'cors'})
.then(response => response.json())
.then(dailyData => {
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
   const perUserData = perUserSortable.slice(0,5).map(val =>({
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
 
    const xUserWeek = [];
    const yUserWeek = []
    perUserSortWeek.slice(0,Math.floor((perUserSortWeek.length)*0.1)).forEach((d) => {
        xUserWeek.push(d[0]);
        yUserWeek.push(d[1]);
    })

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
            }
            else if(d.location.includes('the ocean')){
                d.location = 'the ocean';
            }
        }
    })
    // Count tweets by location
    let perLoc = new Object();
    dailyData.forEach((d) => {
        perLoc[d.location] = perLoc[d.location] ? ++perLoc[d.location]:1;
    })

    let perLocSortable = [];
    for (let loc in perLoc){
        if(perLoc[loc]>=5) {
            perLocSortable.push([titleCase(loc), perLoc[loc]]);
        }
    };
    perLocSortable.sort(function(a,b) {
        return b[1] - a[1];
    });
    //********************* Charting below *******************

    // ****** Per Location charting ********
    dailyChart = anychart.area();
    const dailySeries = dailyChart.splineArea(dailyArray);
    // Settings
    dailySeries.fill('#002b36');
    dailySeries.stroke('#000000');
    dailySeries.name("Tweets");
    dailyChart.xAxis().labels().rotation(-45);
    //Draw
    dailyChart.container("dailyTweetsViz");
    dailyChart.draw();

    // ********* All users charting ********
    // create data

    
      // create a chart
      var chart = anychart.polar();
      // create a column series and set the data
      var series = chart.column(perUserData);
      // set the type of the x-scale
      chart.xScale("ordinal");
      // enable sorting points by x
      chart.sortPointsByX(true);
      // set the inner radius
      chart.innerRadius(50);
      // set the chart title
      chart.title("Polar Column Chart");
      // set the container id
      chart.container("allUsers");
      // initiate drawing the chart
      chart.draw();
    
      // create a chart
      var chart = anychart.polar();
      // create a column series and set the data
      var series = chart.column(perUserData);
      // set the type of the x-scale
      chart.xScale("ordinal");
      // enable sorting points by x
      chart.sortPointsByX(true);
      // set the inner radius
      chart.innerRadius(50);
      // set the chart title
      chart.title("Polar Column Chart");
      // set the container id
      chart.container("weekUsers");
      // initiate drawing the chart
      chart.draw();
 
    // ****** Per Location charting ********
    locationChart = anychart.bar();
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
    //topUserN.textContent = xUser.length;
    //topUserNWeek.textContent = xUserWeek.length;
    //Locations
    weeklyLocationsDisp.textContent = uniqueItems(thisWeek,'location');
    weeklyLocationsChange.textContent = uniqueItems(thisWeek,'location') - uniqueItems(lastWeek, 'location');
    totalLocations.textContent = uniqueItems(dailyData, 'location'); 
});

fetch(apiCorpus,{method: "GET",mode: 'cors'})
.then(response => response.json())
.then(corpusData => {
    
});


