weatherData = {};
locationData = {};
cityName = "";


var getWeather = function(lat, lon){
    var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=metric&appid=8afb55e108bfe22e6df569f88292df63"   
    console.log(weatherUrl);
    fetch(weatherUrl)
    .then(function(response){
        if (response.ok){
            response.json()
            .then(function(data){
                console.log(data);
                weatherData=data;
            })
        } else {
            alert("Something went wrong!");
        }
    })
};

var getWeatherLocation = function(city, country){
    var lat = 0;
    var lon = 0;
    var locationUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+city+","+country+"&appid=8afb55e108bfe22e6df569f88292df63"
    console.log(locationUrl);
    fetch(locationUrl)
    .then(function(response){
        if (response.ok){
            response.json()
            .then(function(data){
            console.log(data);
            locationData = data;
            cityName = locationData[0].name;
            lat = locationData[0].lat;
            lon = locationData[0].lon;
            getWeather(lat, lon);   
            })
        } else {
            alert("Not found please try again");
        }
        
        
    })
};


//getWeather("london");

// search for city - add to local storage

// city name, date
// Weather info :
// * icon rep of weather - .weather[0].icon / .weather[0].description
// * temperature - main.temp&units=metric
// * humidity - .main.humidity
// * wind speed - .wind.speed
// * uv index - colour coded - 

// 5 day forecast - same info as above