let currentTime = new Date();

function formatDate(date) {
  let currentDate = date.getDate();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Saturday"
  ];
  let currentDay = days[date.getDay()];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  let currentMonth = months[date.getMonth()];
  let currentHours = date.getHours();
  let currentMinutes = date.getMinutes();
  let amPm = "AM";
  if (currentHours > 13) {
    amPm = "PM";
    currentHours = `${currentHours}` - 12;
  }
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }
  let formattedDate = `${currentDay} ${currentDate} ${currentMonth}, ${currentHours}:${currentMinutes} ${amPm}`;
  return formattedDate;
}

let dateTime = document.querySelector("#date-time");
dateTime.innerHTML = formatDate(currentTime);

function displayWeather(response) {
  console.log(response);
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#country").innerHTML = response.data.sys.country;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#min").innerHTML = Math.round(
    response.data.main.temp_min
  );
  document.querySelector("#max").innerHTML = Math.round(
    response.data.main.temp_max
  );
  document.querySelector("#real-feel").innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector("#rainfall").innerHTML = response.data.clouds.all;
  document.querySelector("#humidity").innerHTML = Math.round(
    response.data.main.humidity
  );
  document.querySelector("#visibility").innerHTML = Math.round(
    response.data.visibility / 1000
  );
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#pressure").innerHTML = Math.round(
    response.data.main.pressure
  );

  let unixTimestampSunrise = response.data.sys.sunrise;
  let dateSunrise = new Date(unixTimestampSunrise * 1000);
  let hoursSunrise = dateSunrise.getHours();
  let minutesSunrise = "0" + dateSunrise.getMinutes();
  let formattedTimeSunrise = `${hoursSunrise} : ${minutesSunrise.substr(-2)}`;

  let unixTimestampSunset = response.data.sys.sunset;
  let dateSunset = new Date(unixTimestampSunset * 1000);
  let hoursSunset = dateSunset.getHours() - 12;
  let minutesSunset = "0" + dateSunset.getMinutes();
  let formattedTimeSunset = `${hoursSunset} : ${minutesSunset.substr(-2)}`;

  document.querySelector("#sunrise").innerHTML = formattedTimeSunrise;
  document.querySelector("#sunset").innerHTML = formattedTimeSunset;
}

function searchCity(city) {
  let apiKey = "748b99007354394700eb99611308d6a0";
  let unit = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

let citySearch = document.querySelector("#city-search");
citySearch.addEventListener("submit", handleSubmit);

searchCity("Rotterdam");

function currentLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "748b99007354394700eb99611308d6a0";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(currentLocation);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

function fahrenheitDisplay(event) {
  event.preventDefault();
  let celsiusTemp = 21;
  let fahrenheitTemp = Math.round((celsiusTemp * 9) / 5 + 32);
  let currentFahrenheitTemp = document.querySelector("#temperature");
  currentFahrenheitTemp.innerHTML = fahrenheitTemp;
}

let fahrenheitSearch = document.querySelector("#fahrenheit-link");
fahrenheitSearch.addEventListener("click", fahrenheitDisplay);

function celsiusDisplay(event) {
  event.preventDefault();
  let fahrenheitTemp = 70;
  let celsiusTemp = Math.round((fahrenheitTemp - 32) / 1.8);
  let currentCelsiusTemp = document.querySelector("#temperature");
  currentCelsiusTemp.innerHTML = celsiusTemp;
}

let celsiusSearch = document.querySelector("#celsius-link");
celsiusSearch.addEventListener("click", celsiusDisplay);
