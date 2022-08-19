let weeklyTweetsDisp = document.querySelector(".weeklyTweets");
let weeklyChangeDisp = document.querySelector(".weeklyChange");
let weeklyUserDisp = document.querySelector(".weeklyUsers");


fetch('/src/dailyTweets.json')
        .then(response => response.json())
        .then(dailyData => {

            // Get daily count of tweets
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

            // Function to count unique values in array of objects
            const uniqueItems = (list, keyFn) => list.reduce((resultSet, item) =>
                resultSet.add(typeof keyFn === 'string' ? item[keyFn] : keyFn(item)),new Set).size;

            weeklyTweetsDisp.textContent = thisWeek.length;
            weeklyChangeDisp.textContent = thisWeek.length - lastWeek.length;
            weeklyUserDisp.textContent = uniqueItems(thisWeek, 'screen_name');


            const x = Object.keys(perDay);
            const y = Object.values(perDay);
            new Chart("dailyTweets", {
                type: "line",
                data: {
                  labels: x,
                  datasets: [{
                    fill: true,
                    lineTension: 0.5,
                    backgroundColor: "#586575",
                    data: y
                  }]
                },
                options: {
                    scales:{
                        xAxes:[{
                            gridLines:{
                                drawOnChartArea: false,
                                color: "#000000"
                            }
                        }],
                        yAxes:[{
                            gridLines: {
                                drawOnChartArea: false,
                                color: "#000000"
                            }
                        }]
                    },
                    legend: {display: false},
                }
            });

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

           // Allow object to be sorted 
           let perLocSortable = [];
           for (let loc in perLoc){
                perLocSortable.push([loc, perLoc[loc]]);
           }
           perLocSortable.sort(function(a,b) {
                return b[1] - a[1];
           });

           // Place sorted values in arrays for plotting
           let xLoc = [];
           let yLoc = [];
           perLocSortable.forEach((d) => {
                xLoc.push(d[0]);
                yLoc.push(d[1]);
           })

           //Prep some options and then chart location data
            const locationData = {
                labels: xLoc,
                datasets: [{
                    label: "Test",
                    data: yLoc,
                    backgroundColor: "#586575"
                }]
            };
            new Chart("locationTweets", {
                type: 'horizontalBar',
                data: locationData,
                options: {
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            ticks: {
                              beginAtZero: true
                            }
                        }],
                        xAxes:[{
                            gridLines:{
                                drawOnChartArea: false,
                                color: "#000000"
                            }
                        }],
                        yAxes: [{
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

// Anychart format of data 
// const want2 = Object.keys(perDay).map((key) => ({
//     day : key,
//     count : perDay[key]
// }));

