// GLOBAL VARIABLES
// Stores pulled API weather data
var weatherData = {};
// Stores pulled API location data
var locationData = {};
// Stores searched city name
var cityName = "";
// Stores searched country
var country = "";
// Search button
var searchButton = $("#search-btn");
// Array for storing search results to push and retrieve from 
var searchResultsArray = [];
// Pulls today's date from moment
var todayDate = moment().format('L');
// Displays today's date - used format from previous project
$("#today").text(todayDate);


// FUNCTION TO CREATE AND ADD BUTTONS
var buttonCreator = function(i){
    var buttonText = "";
    // sets the text of the new button to [city, country]
    buttonText = `${searchResultsArray[i].city}, ${searchResultsArray[i].country}`;        
    // variable for search button area
    var searchResultsEl = document.getElementById("search-list");
    // var to create new p element for button
    var newButton = document.createElement("p");
    // sets button text
    $(newButton).text(buttonText);
    // adds class to button for styling
    newButton.classList.add("city-btn");
    // sets data attributes for using in search if button clicked
    newButton.setAttribute("data-city", searchResultsArray[i].city);
    newButton.setAttribute("data-country", searchResultsArray[i].country);
    // sets button ID
    newButton.setAttribute("id", searchResultsArray[i].city+searchResultsArray[i].country);
    // adds new button to search area
    searchResultsEl.appendChild(newButton);
}


// FUNCTION TO LOAD PREVIOUS SEARCH RESULTS
var loadSearches = function(){
    // pulls existing data from local storage
    searchResultsArray = JSON.parse(localStorage.getItem("searchResults"));       
    // if array not saved to local storage already then set blank array
    if(!searchResultsArray){
        searchResultsArray = [];
    }    
    // creates buttons by cycling through array
    for (var i=0; i<searchResultsArray.length; i++){
        buttonCreator(i);
    };
}


// FUNCTION TO SAVE SEARCH TO ARRAY AND LOCAL STORAGE
var saveSearch = function(cityName, countryName){
    // variable for checking if given search parameters already exist
    var exists = false;
    // checks new search against saved array of search parameters
    for (var i=0; i<searchResultsArray.length; i++){
        if (cityName === searchResultsArray[i].city && countryName === searchResultsArray[i].country){
            exists = true;           
        }
    }

    // only creates new object in array if parameters don't already exist
    if (!exists){
        var newObj = {
            city: cityName,
            country: countryName        
        }        
        searchResultsArray.push(newObj);
        // saves array to local storage
        localStorage.setItem("searchResults", JSON.stringify(searchResultsArray));
        // var to correct array location of new item - accounts for zero index
        var x = searchResultsArray.length;
        x=x-1;
        
        buttonCreator(x);
    }
};


// FUNCTION TO CREATE/DISPLAY DATA FOR NEXT 5 DAYS
var displayFiveDay= function(weatherData){
    // for loop - cycles through weatherData.daily[i]    
    for(var i=0; i<weatherData.daily.length;i++){
        // excludes [0] data - as that is for today
        if (i>0 && i<6){
            // Pulls appropriate date from moment.js
            var futureDate = moment().add(i, 'days').format('L');
            // variables for weather data
            var icon = weatherData.daily[i].weather[0].icon
            var icon1Address = "https://openweathermap.org/img/wn/"+icon+"@2x.png";
            var temp = weatherData.daily[i].temp.day;
            var wind = weatherData.daily[i].wind_speed;
            var humidity = weatherData.daily[i].humidity;
            // Sets weather data
            $("#day"+i).text(futureDate);
            $("#icon"+i).attr("src",icon1Address);
            $(".icon-small").css("visibility","visible");
            $("#temp"+i).text(temp + " °C");
            $("#wind"+i).text(wind + " KPH");
            $("#humidity"+i).text(humidity + " %");
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
                // variables for today's weather data
                var icon = weatherData.current.weather[0].icon;
                var iconAddress = "https://openweathermap.org/img/wn/"+icon+"@2x.png";                
                var temp = weatherData.current.temp;
                var wind = weatherData.current.wind_speed;
                var humidity = weatherData.current.humidity;
                var uvi = weatherData.current.uvi;
                
                // Checks UVI and returns appropriately coloured background
                if (uvi>=7){
                    // if high, then red
                    $("#uv-index").attr("class","red")
                } else if (uvi>=4){
                    // if moderate then orange
                    $("#uv-index").attr("class","orange")
                } else {
                    // if low then green
                    $("#uv-index").attr("class","green")
                }               
                
                //Displays current weather data, sets CSS where required
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


// FUNCTION FETCHES LOCATION DATA FOR CITY - documentation advised against using city search with Weather API and suggested this related Geo API
var getWeatherLocation = function(city, country){
    // latitude
    var lat = 0;
    // longitude
    var lon = 0;
    var locationUrl = "https://api.openweathermap.org/geo/1.0/direct?q="+city+","+country+"&appid=8afb55e108bfe22e6df569f88292df63"
    console.log(locationUrl);
    fetch(locationUrl)
    .then(function(response){
        if (response.ok){
            response.json()
            .then(function(data){            
            locationData = data;
            // pull lat and lon data from API results
            if (locationData.length>0){
                cityName = locationData[0].name;
                lat = locationData[0].lat;
                lon = locationData[0].lon;
                // send cordinated to weather search function
                getWeather(lat, lon);
                // send search parameters to save search function
                saveSearch(cityName, country);
                // clear the text input box
                document.querySelector("#city-input").value = "";
            } else {
                alert("Location not found please try again");                
            }  
            })
        }       
    })
};


// Event listener for search button
$(searchButton).on("click", function(event){
    event.preventDefault();
    var city = document.querySelector("#city-input").value;
    country = document.querySelector("#country").value;
    // only searches if text has been input
    if (city){        
        getWeatherLocation(city, country);
    }    
  });


// Event listener for previous search list
$("#search-list").on("click", ".city-btn", function(event){
    var clickItem = $(this);
    // pulls data for search parameters
    cityName = $(clickItem).data("city");    
    country = $(clickItem).data("country");
    // sends search to usual search function
    getWeatherLocation(cityName, country);
})

// loads previous searches from local storage at page start up
loadSearches();