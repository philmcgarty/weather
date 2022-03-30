var weatherData = {};
var locationData = {};
var cityName = "";
var searchButton = $("#search-btn");
var country = "";
var todayDate = moment().format('L');
var searchResultsArray = [];
$("#today").text(todayDate);



// FUNCTION TO CREATE AND ADD BUTTONS
var buttonCreator = function(i){
    var buttonText = "";
        buttonText = `${searchResultsArray[i].city}, ${searchResultsArray[i].country}`;
        console.log(buttonText);
        
        var searchResultsEl = document.getElementById("search-list");
        var newButton = document.createElement("p");
        
        $(newButton).text(buttonText);
        //console.log(newButton);
        newButton.classList.add("city-btn");
        newButton.setAttribute("data-city", searchResultsArray[i].city);
        newButton.setAttribute("data-country", searchResultsArray[i].country);
        newButton.setAttribute("id", searchResultsArray[i].city+searchResultsArray[i].country);
        searchResultsEl.appendChild(newButton);
}


// FUNCTION TO LOAD PREVIOUS SEARCH RESULTS
var loadSearches = function(){
    searchResultsArray = JSON.parse(localStorage.getItem("searchResults"));   
    
    // if array not saved to local storage already
    if(!searchResultsArray){
        searchResultsArray = [];
    }
    
    // creates buttons
    for (var i=0; i<searchResultsArray.length; i++){
        buttonCreator(i);
    };
}


// FUNCTION TO SAVE SEARCH TO ARRAY AND LOCAL STORAGE
var saveSearch = function(cityName, countryName){
    var exists = false;
    
    for (var i=0; i<searchResultsArray.length; i++){
        if (cityName === searchResultsArray[i].city && countryName === searchResultsArray[i].country){
            exists = true;
            
        }
    }

    console.log(exists);

    if (!exists){
        var newObj = {
            city: cityName,
            country: countryName        
        }
        //console.log(newObj);
        searchResultsArray.push(newObj);
        //console.log(searchResultsArray);

        localStorage.setItem("searchResults", JSON.stringify(searchResultsArray));
        var x = searchResultsArray.length;
        x=x-1;
        console.log(x);
        buttonCreator(x);
    }
};



var displayFiveDay= function(weatherData){
    // for loop - cycles through weatherData.daily[i]
    
    for(var i=0; i<weatherData.daily.length;i++){
        // excludes [0] data
        if (i>0 && i<6){
            var futureDate = moment().add(i, 'days').format('L');
            console.log(futureDate)
            var icon = weatherData.daily[i].weather[0].icon
            var icon1Address = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
            var temp = weatherData.daily[i].temp.day;
            var wind = weatherData.daily[i].wind_speed;
            var humidity = weatherData.daily[i].humidity;
            $("#day"+i).text(futureDate);
            $("#icon"+i).attr("src",icon1Address);
            $(".icon-small").css("visibility","visible");
            $("#temp"+i).text(temp + " °C");
            $("#wind"+i).text(wind + " KPH");
            $("#humidity"+i).text(humidity + " %");
        } 
        // else {
        //     console.log("got this far! "+i);
        // }
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
                //console.log(iconAddress);
                var temp = weatherData.current.temp;
                var wind = weatherData.current.wind_speed;
                var humidity = weatherData.current.humidity;
                var uvi = weatherData.current.uvi;
                
                
                if (uvi>7){
                    console.log("high");
                    $("#uv-index").attr("class","red")
                } else if (uvi>4){
                    console.log("medium");
                    $("#uv-index").attr("class","orange")
                } else {
                    console.log("low");
                    $("#uv-index").attr("class","green")
                }
                
                
                //console.log(`${temp} °C, ${wind} KPH, ${humidity} %, ${uvi}`);
                //insertCurrentWeatherData(temp,wind,humidity,uvi);
                $("#city").text(cityName+", "+country);
                $("#icon").attr("src", iconAddress);
                $(".icon-large").css("visibility","visible");
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
            //console.log(data);
            locationData = data;
            if (locationData.length>0){
                cityName = locationData[0].name;
                lat = locationData[0].lat;
                lon = locationData[0].lon;
                getWeather(lat, lon);
                saveSearch(cityName, country);
                document.querySelector("#city-input").value = "";
            } else {
                alert("Location not found please try again");
                
            }  
            })
        }       
    })
};


//getWeatherLocation("london", "GB");


$(searchButton).on("click", function(event){
    event.preventDefault();
    var city = document.querySelector("#city-input").value;
    country = document.querySelector("#country").value;
    if (city){
        console.log(city, country);
        getWeatherLocation(city, country);
    }
    
  });



$("#search-list").on("click", ".city-btn", function(event){
    var clickItem = $(this);
    console.log(clickItem);
    cityName = $(clickItem).data("city");
    console.log(city);
    country = $(clickItem).data("country");
    console.log(country);
    getWeatherLocation(cityName, country);
})



loadSearches();

// search for city - add to local storage

// city name, date
// Weather info :
// * icon rep of weather - .weather[0].icon / .weather[0].description
// * temperature - main.temp&units=metric
// * humidity - .main.humidity
// * wind speed - .wind.speed
// * uv index - colour coded - 

// 5 day forecast - same info as above