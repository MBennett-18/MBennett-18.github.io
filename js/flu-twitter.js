let weeklyTweetsDisp = document.querySelector(".weeklyTweets");
let weeklyChangeDisp = document.querySelector(".weeklyChange");
let totalTweetsDisp = document.querySelector(".totalTweets");

let weeklyUsersDisp = document.querySelector(".weeklyUsers");
let weeklyUserChange = document.querySelector(".weeklyUserChange");
let totalUserDisp = document.querySelector(".totalUsers");
let topUserN = document.querySelector(".topN");

let weeklyLocationsDisp = document.querySelector(".weeklyLocations");
let weeklyLocationsChange = document.querySelector(".weeklyLocationChange");
let totalLocations = document.querySelector(".totalLocations");

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

fetch('/src/dailyTweets.json')
        .then(response => response.json())
        .then(dailyData => {
            // ************ Daily aggregatation *********
            let perDay = new Object();
            dailyData.forEach((d) => {
                perDay[d.dateStr] = perDay[d.dateStr] ? ++perDay[d.dateStr]:1;
            })

            // Get ranges for week calcs
            const weekStart = new Date();
            const weekEnd = new Date();
            const priorweekStart = new Date();
            weekStart.setDate(weekStart.getDate() - 7);
            weekEnd.setDate(weekEnd.getDate());
            priorweekStart.setDate(priorweekStart.getDate()-14);

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
            
            // Data for tweet count section
            const xTweets = Object.keys(perDay);
            const yTweets = Object.values(perDay);

            // ************ User aggregatation *********

            let perUser = new Object();
            dailyData.forEach((d) => {
                perUser[d.screen_name] = perUser[d.screen_name] ? ++perUser[d.screen_name]:1;
            })

            let perUserSortable = [];
            for (let user in perUser){
                if(perUser[user]>=15) {
                    perUserSortable.push([user, perUser[user]]);
                }
           };
           // Sorting the array of arrays
            perUserSortable.sort(function(a,b) {
                return b[1] - a[1];
            });

            const xUser = [];
            const yUser = [];
            perUserSortable.forEach((d) => {
                xUser.push(d[0]);
                yUser.push(d[1]);
            })

            // ************ Location aggregatation *********
            // Clean up some of the locations
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

           // Allow object to be sorted, and filter for more frequenct locations
           let perLocSortable = [];
           for (let loc in perLoc){
                if(perLoc[loc]>=5) {
                    perLocSortable.push([loc, perLoc[loc]]);
                }
           }
           // Sorting the array of arrays
           perLocSortable.sort(function(a,b) {
                return b[1] - a[1];
           });

           // Data for location count section
           let xLoc = [];
           let yLoc = [];
           perLocSortable.forEach((d) => {
                xLoc.push(titleCase(d[0]));
                yLoc.push(d[1]);
           })
            //*************** Display key banners *************
            //Tweets
            weeklyTweetsDisp.textContent = thisWeek.length;
            weeklyChangeDisp.textContent = thisWeek.length - lastWeek.length;
            totalTweetsDisp.textContent = dailyData.length;
            //Users
            weeklyUsersDisp.textContent = uniqueItems(thisWeek, 'screen_name');
            weeklyUserChange.textContent = uniqueItems(thisWeek, 'screen_name') - uniqueItems(lastWeek, 'screen_name')
            totalUserDisp.textContent = uniqueItems(dailyData, "screen_name");
            topUserN.textContent = xUser.length;
            
            //Locations
            weeklyLocationsDisp.textContent = uniqueItems(thisWeek,'location');
            weeklyLocationsChange.textContent = uniqueItems(thisWeek,'location') - uniqueItems(lastWeek, 'location');
            totalLocations.textContent = uniqueItems(dailyData, 'location');
           


            new Chart("dailyTweets", {
                type: "line",
                data: {
                  labels: xTweets,
                  datasets: [{
                    label: "Tweets",
                    fill: true,
                    lineTension: 0.5,
                    backgroundColor: "#586575",
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: "#323f4f",
                    data: yTweets
                  }]
                },
                options: {
                    scales:{
                        xAxes:[{
                            ticks: {
                                fontColor: "#002b36",
                                fontSize: 12
                              },
                            gridLines:{
                                drawOnChartArea: false,
                                color: "#000000"
                            }
                        }],
                        yAxes:[{
                            ticks: {
                                fontColor: "#002b36",
                                fontSize: 14
                              },
                            gridLines: {
                                drawOnChartArea: false,
                                color: "#000000"
                            }
                        }]
                    },
                    legend: {display: false},
                }
            });
            
            
            new Chart("top-users", {
                type: 'polarArea',
                data: {
                    labels: xUser,
                    datasets: [{
                        label: "Tweets",
                        data: yUser,
                        backgroundColor: "rgba(12, 104, 88,0.7)",
                        hoverBackgroundColor: "rgba(12, 104, 88)",
                    }]
                },
                options: {
                    legend: {
                        display: false
                    }
                }
            });

            new Chart("locationTweets", {
                type: 'horizontalBar',
                data: {
                    labels: xLoc,
                    datasets: [{
                        label: "Tweets",
                        data: yLoc,
                        backgroundColor: "rgba(63, 36, 53,0.7)",
                        hoverBackgroundColor: "rgba(63, 36, 53)"
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            ticks: {
                              beginAtZero: true,
                              fontColor: "#002b36",
                              fontSize: 14
                            },
                            gridLines:{
                                drawOnChartArea: false,
                                color: "#000000"
                            }
                        }],
                        yAxes: [{
                            ticks: {    
                                beginAtZero: true,
                                fontColor: "#002b36",
                                fontSize: 12
                            },
                           stacked: true,
                           gridLines:{
                            drawOnChartArea:false,
                            color: "#000000"
                           }
                        }]
                    }
                }
            });
            
    });
