const apiKey = "6675145806c7290b2d43a240155a964d";

const container = document.querySelector(".weather-container");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const searchExitBtn = document.getElementById("search-exit-btn");
const citiesSearchBtn = document.getElementById("cities-search-btn");
const favouriteCitiesBtn = document.getElementById("fav-cities-btn");
const loadingSpinner = document.getElementById("loading-spinner");

const errorMsg = document.createElement("div");
errorMsg.classList.add("error-msg");

// Favourite cities
const favouriteCities = [
  "Vancouver",
  "New York",
  "San Fransisco",
  "Madrid",
  "Sydney",
  "Dubai",
  "Tokyo",
];
// Starting index for favourite cities array should be 0
let currentCity = 0;

// Function to display weather data
const displayWeatherData = (data) => {
  const cityName = data.name;
  const temperature = Math.floor(data.main.temp);
  const description = data.weather[0].description;

  // Sunrise and sunset times
  const sunrise = data.sys.sunrise * 1000;
  const sunset = data.sys.sunset * 1000;
  const sunriseTime = new Date(sunrise);
  const sunsetTime = new Date(sunset);
  const sunriseHours = sunriseTime.getHours();
  const sunriseMinutes = sunriseTime.getMinutes();
  const sunsetHours = sunsetTime.getHours();
  const sunsetMinutes = sunsetTime.getMinutes();

  const sunriseTimeString = `${sunriseHours < 10 ? "0" : ""}${sunriseHours}:${
    sunriseMinutes < 10 ? "0" : ""
  }${sunriseMinutes}`;
  const sunsetTimeString = `${sunsetHours < 10 ? "0" : ""}${sunsetHours}:${
    sunsetMinutes < 10 ? "0" : ""
  }${sunsetMinutes}`;

  const heading = document.createElement("h1");
  const temp = document.createElement("h2");
  const weatherDescription = document.createElement("p");
  const sunriseElement = document.createElement("p");
  const sunsetElement = document.createElement("p");
  const divElement = document.createElement("div");
  divElement.classList.add("sunrise-sunset");

  heading.textContent = cityName;
  temp.textContent = `${temperature}°C`;
  weatherDescription.textContent = description;
  sunriseElement.textContent = `Sunrise   ${sunriseTimeString}`;
  sunsetElement.textContent = `Sunset   ${sunsetTimeString}`;
  divElement.append(sunriseElement, sunsetElement);

  container.textContent = "";
  container.append(temp, heading, weatherDescription, divElement);

  //change background color as per tempreture
  function changeBackground() {
    if (temperature >= 25) {
      // Warm colors for higher temperatures
      container.style.background = "linear-gradient(#ffffff, #8589FF)";
    } else if (temperature < 25 && temperature >= 13) {
      // Neutral color for temperatures between 13 and 25 degrees
      container.style.background = "linear-gradient(#ffffff, #4895ef)";
    } else {
      // Cold colors for temperatures less than 13 degrees
      container.style.background = "linear-gradient(#ffffff, #64a6bd)";
    }
  }

  changeBackground();
};

//Adding CSS Animations
// Function to insert the weather image based on the weather condition
const insertWeatherImage = (data) => {
  const weatherCondition = data.weather[0].main.toLowerCase();
  const weatherImagesContainer = document.querySelector(
    ".weather-images-container"
  );
  weatherImagesContainer.innerHTML = "";
  // Create an image element for the weather and insert weather images
  const weatherImage = document.createElement("img");
  // Check the weather condition and set the appropriate image
  if (weatherCondition === "sunny" || weatherCondition === "clear") {
    weatherImage.src = "design/design1/assets/sunny.svg";
    weatherImage.alt = "Sunny";
    // Animation class for sunny images
    weatherImage.classList.add("sunny-animation");
  } else if (
    weatherCondition === "cloudy" ||
    weatherCondition === "clouds" ||
    weatherCondition === "fog"
  ) {
    weatherImage.src = "design/design1/assets/cloudy.svg";
    weatherImage.alt = "Cloudy";
    // Animation class for cloudy images
    weatherImage.classList.add("cloudy-animation");
  } else if (
    weatherCondition === "rain" ||
    weatherCondition === "moderate rain"
  ) {
    weatherImage.src = "design/design1/assets/rainy.svg";
    weatherImage.alt = "Rainy";
    // Animation class for rainy images
    weatherImage.classList.add("rainy-animation");
  } else if (weatherCondition === "snow") {
    weatherImage.src = "design/design1/assets/snow.svg";
    weatherImage.alt = "Snowing";
  }
  // Show the weather images container
  weatherImagesContainer.style.display = "block";
  // Append the weather image to the weather images container
  weatherImagesContainer.appendChild(weatherImage);
};

// Fetch air quality data
const fetchAirQualityData = (lat, long) => {
  const airQualityApiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${long}&appid=${apiKey}`;

  fetch(airQualityApiUrl)
    .then((response) => response.json())
    .then((airQualityData) => {
      const airQuality = airQualityData.list[0];
      const airQualityValue = airQuality.main.aqi;
      console.log("AIR:", airQualityValue);

      // Out put of air quality. Add condition based on the value of air quality
      const airQualityValueElement = document.createElement("h4");
      if (airQualityValue >= 0 && airQualityValue <= 50) {
        container.append(
          (airQualityValueElement.textContent = `Air quality: Good`)
        );
      } else if (airQualityValue >= 51 && airQualityValue <= 100) {
        container.append(
          (airQualityValueElement.textContent = `Air quality: Moderate`)
        );
      } else if (airQualityValue >= 151 && airQualityValue <= 200) {
        container.append(
          (airQualityValueElement.textContent = `Air quality: Unhealthy`)
        );
      } else if (airQualityValue >= 201 && airQualityValue <= 300) {
        container.append(
          (airQualityValueElement.textContent = `Air quality: Very unhealthy`)
        );
      } else if (airQualityValue > 300) {
        container.append(
          (airQualityValueElement.textContent = `Air quality: Hazardous`)
        );
      } else {
        return "Data not available";
      }
    })
    .catch((error) => {
      console.error("Error fetching air quality data:", error);
    });
};

// Fetch Data
const fetchWeatherData = (city) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`;
  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      getFiveDaysForecast(data.coord);
      displayWeatherData(data);
      insertWeatherImage(data);
      fetchAirQualityData(data.coord.lat, data.coord.lon);
      return data;
    })
    .catch((err) => {
      errorMsg.textContent = `Oops! Something went wrong with the network.`;
      console.log(err);
      container.append(errorMsg);
    });
};

// Output data: Set default city to Stockholm when page first loads
fetchWeatherData("Stockholm");

// Search cities when clicking search button
citiesSearchBtn.addEventListener("click", () => {
  if (searchInput.value) {
    fetchWeatherData(searchInput.value);
  }
});

//Toggle search button
searchBtn.addEventListener("click", () => {
  searchInput.style.visibility = "initial";
  citiesSearchBtn.style.display = "initial";
  searchBtn.style.display = "none";
  searchExitBtn.style.display = "initial";
});
//Toggle exit button
searchExitBtn.addEventListener("click", () => {
  searchInput.style.visibility = "hidden";
  citiesSearchBtn.style.display = "none";
  searchBtn.style.display = "initial";
  searchExitBtn.style.display = "none";
});
favouriteCitiesBtn.addEventListener("click", () => {
  fetchWeatherData(favouriteCities[currentCity]);
  currentCity++;
  if (currentCity === favouriteCities.length) {
    currentCity = 0;
  }
});

//5 days weather forecast

const weatherForecastContainer = document.querySelector(".weather-forecast");

const getFiveDaysForecast = ({ lat, lon }) => {
  const exclude = "current,hourly,minutely,alerts";
  const units = "metric";
  const weatherForcastApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&units=${units}&appid=6675145806c7290b2d43a240155a964d`;

  const table = document.getElementById("weather-forecast");
  table.textContent = "";

  fetch(weatherForcastApi)
    .then((response) => {
      return response.json();
    })
    .then((forecastData) => {
      // check if the response contains forecast data
      const forecast = forecastData.daily.slice(1, 6); // get the 5 days data
      console.log(forecast);
      console.log(`5 days weather forecast`);
      forecast.forEach((day) => {
        //convert timestamp to date and display the short day name
        const date = new Date(day.dt * 1000);
        const options = { weekday: "short" };
        const dayOfWeek = date.toLocaleDateString("en-US", options);

        // get data from api and store into a variable

        const weatherDes = day.weather[0].main;
        const maxDegree = Math.floor(day.temp.max);
        const minDegree = Math.floor(day.temp.min);
        console.log(
          `${date.toDateString()}: ${weatherDes}, Temperature: ${maxDegree}/ ${minDegree}°C`
        );
        // create rows and store in a variable
        const row = table.insertRow();
        const daysCell = row.insertCell(0);
        const descriptionCell = row.insertCell(1);
        const temperatureCell = row.insertCell(2);

        //insert class name for weatherIcon
        descriptionCell.classList.add("weather-icon");

        //create function that show icon as per weather condition
        let weatherIcon;

        switch (weatherDes.toLowerCase()) {
          case "clear":
          case "sunny":
            weatherIcon = "☀️";
            break;
          case "rain":
            weatherIcon = "🌧️";
            break;
          case "cloudy":
          case "clouds":
            weatherIcon = "☁️";
            break;
          case "partly cloudy":
            weatherIcon = "⛅️";
            break;
          case "windy":
            weatherIcon = "💨";
            break;
          case "thunderstorm":
            weatherIcon = "🌩️";
            break;
          case "snow":
            weatherIcon = "❄️";
            break;
          default:
            weatherIcon = "";
        }
        //insert the value from the data in the created rows

        daysCell.textContent = dayOfWeek;
        descriptionCell.textContent = weatherIcon;
        temperatureCell.textContent = `${maxDegree}° / ${minDegree} °C`;
      });
    })
    .catch((error) => {
      console.log("Error fetching data:", error);
    });
};

// Function to fetch weather data using geolocation
const fetchWeatherByGeolocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Fetch weather data using the obtained latitude and longitude
        fetchWeatherDataByGeolocation(latitude, longitude);
      },
      (error) => {
        console.error("Geolocation error:", error.message);
      }
    );
    // Show the loading spinner while waiting for geolocation data
    loadingSpinner.style.display = "block";

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Geolocation data is available, so hide the loading spinner
        loadingSpinner.style.display = "none";
        const { latitude, longitude } = position.coords;

        // Fetch weather data using the obtained latitude and longitude
        fetchWeatherDataByGeolocation(latitude, longitude);
      },
      (error) => {
        // Hide the loading spinner in case of errors
        loadingSpinner.style.display = "none";
        console.error("Geolocation error:", error.message);
      }
    );
  } else {
    console.error("Geolocation is not supported by your browser.");
  }
};

// Function to fetch weather data using latitude and longitude
const fetchWeatherDataByGeolocation = (latitude, longitude) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${apiKey}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayWeatherData(data);
      getFiveDaysForecast({ lat: latitude, lon: longitude });
    })
    .catch((err) => {
      errorMsg.textContent = `Network response was not ok (${err})`;
      container.append(errorMsg);
    });
};

// Add an event listener to the button for user's location
const userLocationBtn = document.getElementById("user-location-btn");
userLocationBtn.addEventListener("click", () => {
  fetchWeatherByGeolocation();
});
