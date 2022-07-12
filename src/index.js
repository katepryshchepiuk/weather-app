function formatDate(timestamp) {
  let date = new Date(timestamp);
  let currentDate = date.getDate();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Saturday"
  ];
  let day = days[date.getDay()];
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
  let month = months[date.getMonth()];
  let time = new Date(timestamp).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  return `${day} ${currentDate} ${month}, ${time}`;
}

function displayWeather(response) {
  console.log(response);
  celsiusTemperature = Math.round(response.data.main.temp);
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
  document.querySelector("#icon").setAttribute('src', `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  document.querySelector("#icon").setAttribute('alt', response.data.weather[0].description);

  document.querySelector("#date-time").innerHTML = formatDate(response.data.dt*1000);



  let unixTimestampSunrise = response.data.sys.sunrise;
  let dateSunrise = new Date(unixTimestampSunrise * 1000);
  let hoursSunrise = dateSunrise.getHours();
  let minutesSunrise = "0" + dateSunrise.getMinutes();
  let formattedTimeSunrise = `${hoursSunrise}:${minutesSunrise(-2)}`;

  let unixTimestampSunset = response.data.sys.sunset;
  let dateSunset = new Date(unixTimestampSunset * 1000);
  let hoursSunset = dateSunset.getHours() - 12;
  let minutesSunset = "0" + dateSunset.getMinutes();
  let formattedTimeSunset = `${hoursSunset}:${minutesSunset(-2)}`;

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

function showFahrenheitTemperature(event) {
  event.preventDefault();
  let fahrenheitTemperature = Math.round((celsiusTemperature * 9) / 5 + 32);
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = fahrenheitTemperature;
  celsiusLink.classList.remove('active');
  fahrenheitLink.classList.add('active');
}

function showCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = celsiusTemperature;
  celsiusLink.classList.add('active');
  fahrenheitLink.classList.remove('active');
}

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheitTemperature);


let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsiusTemperature);

let celsiusTemperature = null;