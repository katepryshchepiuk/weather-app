/*---Getting current date and time---*/
function formatDate(timestamp) {
  let date = new Date(timestamp);
  let currentDate = date.getDate();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
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

/*---Getting days of the week---*/
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[date.getDay()];
  return day;
}

/*---Changing default icons to bootstrap icons---*/
function displayIcon(icon) {
  let iconPath = "";
  if (icon === "01d") {
    iconPath = "static/brightness-high-fill.svg";
  } else if (icon === "01n") {
    iconPath = "static/moon-fill.svg";
  } else if (icon === "02d") {
    iconPath = "static/cloud-sun-fill.svg";
  } else if (icon === "02n") {
    iconPath = "static/cloud-moon-fill.svg";
  } else if (icon === "03d" || icon === "03n") {
    iconPath = "static/cloud-fill.svg";
  } else if (icon === "04d" || icon === "04n") {
    iconPath = "static/clouds-fill.svg";
  } else if (icon === "09d" || icon === "09n") {
    iconPath = "static/cloud-rain-heavy-fill.svg";
  } else if (icon === "10d" || icon === "10n") {
    iconPath = "static/cloud-rain-fill.svg";
  } else if (icon === "11d" || icon === "11n") {
    iconPath = "static/cloud-lighting-fill.svg";
  } else if (icon === "13d" || icon === "13n") {
    iconPath = "static/cloud-snow-fill.svg";
  } else if (icon === "50d" || icon === "50n") {
    iconPath = "static/cloud-haze-fill.svg";
  }

  return iconPath;
}

/*---Getting forecast weather info from API---*/
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row m-4 gx-2">`;
  forecast.forEach(function(forecastDay, index) {
    if (index < 6) {
    forecastHTML = forecastHTML + `
			<div class="col-12 col-lg-2 py-1 py-lg-0">
			  <div class="card text-center text-white">
					<div class="card-body">
						<h5 clas="card-title day">${formatDay(forecastDay.dt)}</h5>
						<img class="text-white" width="28" height="28" src="${displayIcon(forecastDay.weather[0].icon)}" alt="${forecastDay.weather[0].description}" /img>
						<p class="card-text mt-3">
              <span class="forecast-max">${Math.round(forecastDay.temp.max)}° </span>
              <span class="min forecast-min">${Math.round(forecastDay.temp.min)}°</span>
            </p>
					</div>
				</div>
			</div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
  
  forecastTemperature = forecast;
}

/*---API forecast---*/
function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayForecast);
}

/*---Display current weather in the city---*/
function displayWeather(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#country").innerHTML = response.data.sys.country;
  document.querySelector("#temperature").innerHTML = Math.round(response.data.main.temp);
  document.querySelector("#description").innerHTML = response.data.weather[0].description;
  document.querySelector("#min").innerHTML = Math.round(response.data.main.temp_min);
  document.querySelector("#max").innerHTML = Math.round(response.data.main.temp_max);
  document.querySelector("#real-feel").innerHTML = Math.round(response.data.main.feels_like);
  document.querySelector("#rainfall").innerHTML = response.data.clouds.all;
  document.querySelector("#humidity").innerHTML = Math.round(response.data.main.humidity);
  document.querySelector("#visibility").innerHTML = Math.round(response.data.visibility / 1000);
  document.querySelector("#wind").innerHTML = Math.round(response.data.wind.speed);
  document.querySelector("#pressure").innerHTML = Math.round(response.data.main.pressure);

  document.querySelector("#icon").setAttribute('src', `${displayIcon(response.data.weather[0].icon)}`);
  document.querySelector("#icon").setAttribute('alt', response.data.weather[0].description);

  document.querySelector("#date-time").innerHTML = formatDate(response.data.dt*1000);

  getForecast(response.data.coord);

  celsiusTemperature = Math.round(response.data.main.temp);
  realFeel = Math.round(response.data.main.feels_like);
  minTemp = Math.round(response.data.main.temp_min);
  maxTemp = Math.round(response.data.main.temp_max);

  /*---Display sunrise/sunset time according to city`s timezone---*/
  let cityTimezone = response.data.timezone;
  let sunrise = convertTime(response.data.sys.sunrise, cityTimezone);
  let sunset = convertTime(response.data.sys.sunset, cityTimezone);

  let dateSunrise = sunrise.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  let dateSunset = sunset.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  document.querySelector("#sunrise").innerHTML = dateSunrise;
  document.querySelector("#sunset").innerHTML = dateSunset;

  /*---Changing background according to time in the searched city (day-light/night-dark)---*/
  function backgroundDisplay() {
    let currentCityTime = convertTime(response.data.dt, cityTimezone);
    let currentCityHour = currentCityTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
    let dateSunrise = sunrise.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
    let dateSunset = sunset.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
    let background = document.getElementById("container");
    if (currentCityHour >= dateSunset || currentCityHour < dateSunrise) {
      background.classList.remove('day');
      background.classList.add('night');
    } else {
      background.classList.remove('night');
      background.classList.add('day');
    }
  }
  backgroundDisplay();
}

/*---Converting time of the searched city according to city`s timezone---*/
  function convertTime(time, timezone) {
  let date = new Date(time * 1000);
  let localTime = date.getTime();
  let localOffset = date.getTimezoneOffset() * 60000;
  let utc = localTime + localOffset;
  let localizedTime = utc + timezone * 1000;
  let convertedTime = new Date(localizedTime);

  return convertedTime;
}

/*---API weather in tne searched city---*/
let apiKey = "748b99007354394700eb99611308d6a0";
let unit = "metric";

function searchCity(city) {
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

/*---API weather in tne current location---*/
function currentLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(currentLocation);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);


/*---Converting celsius to fahrenheit---*/
function celsiusToFahreinheit(event) {
  event.preventDefault();
  celsiusLink.classList.remove('active');
  fahrenheitLink.classList.add('active');
  document.querySelector("#temperature").innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32);
  document.querySelector("#max").innerHTML = Math.round((maxTemp * 9) / 5 + 32);
  document.querySelector("#min").innerHTML = Math.round((minTemp * 9) / 5 + 32);
  document.querySelector("#real-feel").innerHTML = Math.round((realFeel * 9) / 5 + 32);
  document.querySelector("#unit-max").innerHTML = `°F`;
  document.querySelector("#unit-min").innerHTML = `°F`;
  document.querySelector("#unit-feel").innerHTML = `°F`;
  let forecastMax = document.getElementsByClassName("forecast-max");
  console.log(forecastMax);
  let forecastMin = document.getElementsByClassName("forecast-min");
  for (i = 0; i < 6; i++) {
    forecastMax[i].innerHTML = `${Math.round((forecastTemperature[i].temp.max * 9) / 5 + 32)}°`;
  }
  for (i = 0; i < 6; i++) {
    forecastMin[i].innerHTML = `${Math.round((forecastTemperature[i].temp.min * 9) / 5 + 32)}°`;
  }
}

/*---Converting fahrenheit to celsius---*/
function fahreinheitToCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add('active');
  fahrenheitLink.classList.remove('active');
  document.querySelector("#temperature").innerHTML = celsiusTemperature;
  document.querySelector("#max").innerHTML = maxTemp;
  document.querySelector("#min").innerHTML = minTemp;
  document.querySelector("#real-feel").innerHTML = realFeel;
  document.querySelector("#unit-max").innerHTML = `°C`;
  document.querySelector("#unit-min").innerHTML = `°C`;
  document.querySelector("#unit-feel").innerHTML = `°C`;
  let forecastMax = document.getElementsByClassName("forecast-max");
  let forecastMin = document.getElementsByClassName("forecast-min");
  for (i = 0; i < 6; i++) {
    forecastMax[i].innerHTML = `${Math.round(forecastTemperature[i].temp.max)}°`;
  }

  for (i = 0; i < 6; i++) {
    forecastMin[i].innerHTML = `${Math.round(forecastTemperature[i].temp.min)}°`;
  }
}

let celsiusTemperature = null;
let realFeel = null;
let maxTemp = null;
let minTemp = null;
let tempWeek = null;
let forecastTemperature = [];

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", celsiusToFahreinheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", fahreinheitToCelsius);