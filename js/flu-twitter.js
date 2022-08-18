fetch('/src/dailyTweets.json')
        .then(response => response.json())
        .then(dailyData => {

            // Get daily count of tweets
            let perDay = new Object();
            dailyData.forEach((d) => {
                perDay[d.dateStr] = perDay[d.dateStr] ? ++perDay[d.dateStr]:1;
            })

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
                    title:{
                        display:true,
                        fontSize: 18,
                        fontColor: '#002b36',
                        text: "Number of Daily Tweets in Nova Scotia Containing Flu or Influenza"
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

