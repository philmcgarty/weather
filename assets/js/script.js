weatherData = {};
locationData = {};
cityName = "";

// // FUNCTION INSERTS CURRENT DAY WEATHER
// var insertCurrentWeatherData = function(temp,wind,humidity,uvi){
//     $("#temperature").text(temp + " °C");
//     $("#wind-speed").text(wind + " KPH");
//     $("#humidity-percent").text(humidity + " %");
//     $("#uv-index").text(uvi);
// };

var displayFiveDay= function(weatherData){
    // for loop - cycles through weatherData.daily[i]
    
    for(var i=0; i<weatherData.daily.length;i++){
        // excludes [0] data
        if (i>0 && i<6){
            var icon = weatherData.daily[i].weather[0].icon
            var icon1Address = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
            var temp = weatherData.daily[i].temp.day;
            var wind = weatherData.daily[i].wind_speed;
            var humidity = weatherData.daily[i].humidity;
            $("#icon"+i).attr("src",icon1Address);
            $("#temp"+i).text(temp + " °C");
            $("#wind"+i).text(wind + " KPH");
            $("#humidity"+i).text(humidity + " %");
        } else {
            console.log("got this far! "+i);
        }
    }
};



// FUNCTION FETCHES WEATHER DATA
var getWeather = function(lat, lon){
    var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=minutely,hourly,alerts&units=metric&appid=8afb55e108bfe22e6df569f88292df63"   
    console.log(weatherUrl);
    fetch(weatherUrl)
    .then(function(response){
        if (response.ok){
            response.json()
            .then(function(data){
                console.log(data);
                weatherData=data;
                var icon = weatherData.current.weather[0].icon;
                var iconAddress = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
                console.log(iconAddress);
                var temp = weatherData.current.temp;
                var wind = weatherData.current.wind_speed;
                var humidity = weatherData.current.humidity;
                var uvi = weatherData.current.uvi;
                
                console.log(`${temp} °C, ${wind} KPH, ${humidity} %, ${uvi}`);
                //insertCurrentWeatherData(temp,wind,humidity,uvi);
                $("#icon").attr("src", iconAddress);
                $("#temperature").text(temp + " °C");
                $("#wind-speed").text(wind + " KPH");
                $("#humidity-percent").text(humidity + " %");
                $("#uv-index").text(uvi);
                displayFiveDay(weatherData);
            })
        } else {
            alert("Something went wrong!");
        }
    })
};


// FUNCTION FETCHES LOCATION DATA FOR CITY
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


getWeatherLocation("london", "GB");

// search for city - add to local storage

// city name, date
// Weather info :
// * icon rep of weather - .weather[0].icon / .weather[0].description
// * temperature - main.temp&units=metric
// * humidity - .main.humidity
// * wind speed - .wind.speed
// * uv index - colour coded - 

// 5 day forecast - same info as above