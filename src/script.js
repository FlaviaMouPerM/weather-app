const form = document.querySelector(".form");
let unitMeasure;

export function getLatAndLong(e) {
  e.preventDefault();

  const data = new FormData(form);

  const city = data.get("city");
  unitMeasure = data.get("temperature");

  fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
    .then((response) => response.json())
    .then((jsonResponse) =>
      getTemperatureData(jsonResponse, unitMeasure),
    );
}

 function getTemperatureData(jsonResponse, temperature) {
  console.log(jsonResponse);

  const latitude = jsonResponse.results[0].latitude;
  const longitude = jsonResponse.results[0].longitude;

  console.log(longitude);
  console.log(latitude);

  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,precipitation_sum&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation,rain,showers,snowfall,cloud_cover,visibility,wind_speed_10m,weather_code&timezone=auto&temperature_unit=${temperature}`,
  )
    .then((response) => response.json())
    .then((data) => getLocationData(data));
}

function getLocationData(data) {
  console.log(data);

  const index = 0;
  const today = data.daily.time[index];
  const temperatureMax = data.daily.temperature_2m_max[index];
  const temperatureMin = data.daily.temperature_2m_min[index];
  const weatherCode = data.daily.weather_code[index];
  const hora = new Date().getHours();
  const temperatureNow = data.hourly.temperature_2m[hora];
  const apparentTemperature = data.hourly.apparent_temperature[hora];
  const relativeHumidity = data.hourly.relative_humidity_2m[hora];
  const windSpeed = data.hourly.wind_speed_10m[hora];
  const dewPoint = data.hourly.dew_point_2m[hora];
  const visibility = data.hourly.visibility[hora];
  const cloudCover = data.hourly.cloud_cover[hora];
  const isDay = data.hourly.time[hora];
  const rain = data.hourly.rain[hora];
  const snowfall = data.hourly.snowfall[hora];
  console.log("Eu sou ", weatherCode);
  updateWeatherUI(
    temperatureNow,
    temperatureMax,
    temperatureMin,
    weatherCode,
    apparentTemperature,
    relativeHumidity,
    windSpeed,
    snowfall,
    dewPoint,
    visibility,
    rain,
    cloudCover,
    isDay,
  );
}

export function updateWeatherUI(
  temperatureNow,
  temperatureMax,
  temperatureMin,
  weatherCode,
  apparentTemperature,
  relativeHumidity,
  windSpeed,
  snowfall,
  dewPoint,
  visibility,
  rain,
  cloudCover,
  isDay,
) {
  const temperatureValue = document.querySelector(".temperature-value");
  const temperatureUnit = document.querySelector(".temperature-unit");
  const feelsLikevalue = document.querySelector(".feels-like-value");
  const detailValueHumidity = document.querySelector(".humidity");
  const wind = document.querySelector(".wind-speed");
  const dewPointNow = document.querySelector(".dew-point");
  const visibilityNow = document.querySelector(".visibility");
  const maximumTemperature = document.querySelector(".maximum-temperature");
  const minimumTemperature = document.querySelector(".minimum-temperature");
  const img = document.querySelector("img");
  const summaryCondition = document.querySelector(".summary-condition");
  const currentTime = document.querySelector(".current-time");

  temperatureValue.firstChild.textContent = Math.floor(temperatureNow);
  temperatureUnit.textContent =
    unitMeasure === "fahrenheit" ? "ºF" : "ºC";
  feelsLikevalue.textContent = Math.floor(apparentTemperature);
  detailValueHumidity.textContent = relativeHumidity + " %";
  wind.textContent = Math.floor(windSpeed) + " %";
  dewPointNow.textContent = Math.floor(dewPoint) + "º";
  visibilityNow.textContent =
    Math.floor(visibility / 1000) + " Km";
  maximumTemperature.textContent =
    Math.floor(temperatureMax) + "º";
  minimumTemperature.textContent =
    Math.floor(temperatureMin) + "º";
  const horas = new Date().getHours();
  const minutos = new Date().getMinutes();
  const horaNow = horas + ":" + minutos;
  currentTime.textContent = horaNow;
  console.log(isDay);

  getWeatherImage(
    weatherCode,
    horas,
    img,
    summaryCondition,
  );
}


function getWeatherImage(
  weatherCode,
  horas,
  img,
  summaryCondition,
) {
  switch (weatherCode) {
    case 0:
      img.src =
        horas < 18
          ? "./src/assets/son.png"
          : "./src/assets/noiteLimpa.png";

      summaryCondition.textContent = "Sol";
      break;

    case 1:
    case 2:
      img.src =
        horas < 18
          ? "./src/assets/diaParcialmenteNublado.png"
          : "./src/assets/noiteParcialmenteNublado.png";

      summaryCondition.textContent =
        "Parcialmente Nublado";
      break;

    case 3:
    case 48:
      img.src =
        horas < 18
          ? "./src/assets/diaNublado.png"
          : "./src/assets/noiteNublada.png";

      summaryCondition.textContent = "Nublado";
      break;

    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      img.src =
        horas < 18
          ? "./src/assets/diaChuva.png"
          : "./src/assets/noiteChuva.png";

      summaryCondition.textContent = "Chuvoso";
      break;

    case 71:
    case 73:
    case 75:
    case 77:
      img.src =
        horas < 18
          ? "./src/assets/diaNeve.png"
          : "./src/assets/noiteNeve.png";

      summaryCondition.textContent = "Neve";
      break;

    case 80:
    case 81:
    case 82:
      img.src =
        horas < 18
          ? "./src/assets/diaChuva.png"
          : "./src/assets/noiteChuva.png";

      summaryCondition.textContent =
        "Pancadas de chuva";
      break;

    case 95:
    case 96:
    case 99:
      img.src = "./src/assets/trovoada.png";

      summaryCondition.textContent = "Trovoada";
      break;

    default:
      return "unknown";
  }
}


//localização
 export function localization (){
    if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition((position) => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,precipitation_sum&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation,rain,showers,snowfall,cloud_cover,visibility,wind_speed_10m,weather_code&timezone=auto&temperature_unit=celsius`,
    )
      .then((response) => response.json())
      .then((data) => {
        unitMeasure = "celsius";
        getLocationData(data);
      });
  });
}
}