



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
  
    const sunriseTimeString = `${sunriseHours < 10 ? "0" : ""}${sunriseHours}:${sunriseMinutes < 10 ? "0" : ""}${sunriseMinutes}`;
    const sunsetTimeString = `${sunsetHours < 10 ? "0" : ""}${sunsetHours}:${sunsetMinutes < 10 ? "0" : ""}${sunsetMinutes}`;
  
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
  
    // Change background based on temperature
    changeBackground();
  };
  
  // Update the existing fetchWeatherData function to call displayWeatherData
  const fetchWeatherData = (city) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`;
    return fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        getFiveDaysForecast(data.coord);
        displayWeatherData(data);
        return data;
      })
      .catch((err) => {
        errorMsg.textContent = `Network response was not ok (${err})`;
        container.append(errorMsg);
      });
  };
  
  // Update the geolocation-based fetch function to call displayWeatherData
  const fetchWeatherDataByGeolocation = (latitude, longitude) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${apiKey}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        displayWeatherData(data);
      })
      .catch((err) => {
        errorMsg.textContent = `Network response was not ok (${err})`;
        container.append(errorMsg);
      });
  };
  
  
  
  
  
  
  