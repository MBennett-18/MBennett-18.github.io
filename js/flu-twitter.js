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

    });

// Anychart format of data 
// const want2 = Object.keys(perDay).map((key) => ({
//     day : key,
//     count : perDay[key]
// }));

