var apiKey = "913b361d776df419e4694f2e9f1cb728"
var searchHistory = []

if (localStorage.getItem("searchHistory")){
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"))
}

for (var i = 0; i < searchHistory.length; i++){
    var city = searchHistory[i]
    document.querySelector(".history").innerHTML +=`<li>
    <button onClick="searchWeather('${city}')" class="btn btn-primary mb-2">${city}</button>
    </li>`
}
// if (searchHistory.length > 0) {
//     searchWeather(searchHistory[searchHistory.length - 1]);
// }

document.querySelector("#search-button").onclick = function () {
    let searchValue = document.querySelector("#search-value").value;
    if (searchValue) {
        document.querySelector("#search-value").value = "";
        searchWeather(searchValue);
    }
};

function convertTemp(temp) {
    return Math.round(temp - 273.15) + '°C'
}

function makeRow(text) {
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    $("#weatherForecast").append(li)
}

async function searchWeather(searchValue) {
    console.log(searchHistory)
    if (searchHistory.indexOf(searchValue) === -1) {
        searchHistory.push(searchValue)
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
        makeRow(searchValue)
    }

    var apiURL = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${searchValue}`
    var data = await fetch(apiURL).then(r => r.json())
    console.log(`[searchWeather] searchValue(${searchValue}) data:`, data)
    var lat = data.coord.lat
    var lon = data.coord.lon

    // write current weather
    var cityName = data.name
    document.querySelector("#cityName").textContent = cityName;
    var cityTemp = data.main.temp
    document.querySelector("#currentTemperature").textContent = convertTemp(cityTemp);
    var cityHum = data.main.humidity
    document.querySelector("#cityHum").textContent = cityHum
    var cityWind = data.wind.speed
    document.querySelector("#cityWind").textContent = cityWind

    document.querySelector("#weatherIcon").src = `http://openweathermap.org/img/wn/10d@2x.png`

    // get 5 day forecast
    var apiURL = `https://api.openweathermap.org/data/2.5/onecall?appid=${apiKey}&lat=${lat}&lon=${lon}`
    var data = await fetch(apiURL).then(r => r.json())
    console.log(`one-call-api: `, data)
    document.querySelector("#uvIndex").textContent = data.current.uvi
    if (Number (data.current.uvi) > .5) {
        console.log("adding icon")
        document.querySelector("#uvIndex").innerHTML += '<i class="far fa-sun text-warning"></i>'
    }

    // loop through the 5 days
    document.querySelector("#weatherForecast").innerHTML = ''
    for (var i = 0; i < 5; i++) {
        var dayData = data.daily[i]
        var imgUrl = `http://openweathermap.org/img/wn/${dayData.weather[0].icon}@2x.png`
        document.querySelector("#weatherForecast").innerHTML += `
      <div class="col card float-start">
      <div class="card-body">
        <img src="${imgUrl}" class="float-end" />
        Temp: ${convertTemp(dayData.temp.day)}
        Humdity: ${dayData.humidity}
        UVI: ${dayData.uvi}
      </div>
      </div>
    `
    }
    // weatherForecast
}


