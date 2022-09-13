const apiCounts = "https://data.novascotia.ca/resource/mdfn-jkdg.json";

fetch(apiCounts)
    .then(apiResponse => apiResponse.json())
    .then(apiData => { 
        const dataSortable = apiData.map(Object.values);

        dataSortable.sort(function(a,b) {
            return a[0] - b[0];
        });
        console.log(dataSortable);
    });