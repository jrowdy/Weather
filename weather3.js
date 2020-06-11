$(document).ready(function () {
  
    var APIKEY = "b5ee90c39da7f786f23fe675936b7028";
    // Set default weather to Laurinburg, NC-- My hometown!
    CurrentWeather("Laurinburg");
    FiveDayForecast("Laurinburg");
    // local storage
    var cityList = [];
    if (localStorage.getItem("cityList")) {
      cityList = JSON.parse(localStorage.getItem("cityList"));
    }
    
  
  
    function CurrentWeather(cityName) {
      $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + cityName+ "&units=imperial" + "&APPID=" + APIKEY,
        method: "GET",
      }).then(function (response) {
        getUVIndex(response.coord.lat, response.coord.lon);
        $("#Icon").attr("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png")
        $("#currLocation").text(response.name);
        $("#currDate").text(moment().format('MMMM Do, YYYY'));
        $("#currTemperature").text("Current Temperature: " + (response.main.temp.toFixed()) + " degrees");
        $("#currHumidity").text("Humidity: " + response.main.humidity + "%");
        $("#currWind").text("Wind Speed: " + response.wind.speed + " mph");
  
      })
    }
  
    function FiveDayForecast(cityName) {
      $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial" + "&APPID=" + APIKEY,
        method: "GET",
      }).then(function (response) {
        var fiveDay = [];
        for (var i = 0; i < response.list.length; i++) {
          var hr = (response.list[i].dt_txt.split(" "))[1]
          if (hr === "21:00:00") {
            fiveDay.push(response.list[i])
          }
        }
        for (var j = 0; j < fiveDay.length; j++) {
          $("#day" + (j + 1)).empty();
          var newDayOfWeek = $("<div>");
          newDayOfWeek.text(moment(fiveDay[j].dt_txt).format("dddd"));
          var newDivDate = $("<div>");
          newDivDate.text((moment(fiveDay[j].dt_txt).format("MM/DD/YYYY")));
          var newImgIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + fiveDay[j].weather[0].icon + "@2x.png")
          var newDivTemp = $("<div>");
          newDivTemp.text((fiveDay[j].main.temp.toFixed()) + "°");
          var newDivHumidity = $("<div>");
          newDivHumidity.text(fiveDay[j].main.humidity + "% Humidity")
          $("#day" + (j + 1)).append(newDayOfWeek, newDivDate, newImgIcon, newDivTemp, newDivHumidity);
        }
      })
    }
  
    function getUVIndex(lat, lon) {
      $.ajax({
        url: "https://api.openweathermap.org/data/2.5/uvi/forecast?&lat=" + lat + "&lon=" + lon + "&cnt=1" + "&APPID=" + APIKEY,
        method: "GET",
      }).then(function (response) {
        $("#currentUV").text("UV Index: " + response[0].value);
      })
    }
  
    function recentlySearched(cityName) {
     cityList.push(cityName);
      localStorage.setItem("cityList", JSON.stringify(cityList))
      var newCity = $("<a>");
      newCity.text(cityName);
      newCity.attr("id", cityName);
      $("#prevSearch").append(newCity);
    }
  
    function clear() {
      $("#prevSearch").text("");
      localStorage.clear();
    }
  
    $("#search").on('keydown', function (e) {
      if (e.keyCode == 13) {
        e.preventDefault();
        var cityName = $(this).val()
        $(this).val('');
        recentlySearched(cityName);
        CurrentWeather(cityName);
        FiveDayForecast(cityName);
        console.log(cityName);
    }
    })
  
    $("#prevSearch").on('click', function (e) {
      if (e.target.matches('a')) {
        e.preventDefault();
        var cityName = (e.target.id);
        CurrentWeather(cityName);
        FiveDayForecast(cityName);
      }
    })
  
    $("#clear").on('click', function (e) {
      clear();
    })
  
  })
