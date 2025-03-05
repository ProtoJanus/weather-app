let isCelsius = false;
let firstRun = true;
let url =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Houston?key=4XZ4WAEYDVM5PYXMJF8YVQXLP";

async function getData() {
  const currentURL = url;
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log("error");
  }
}

async function processData() {
  const weatherDataJSON = await getData();
  const location = weatherDataJSON.address;
  const days = [];

  for (let i = 0; i < 7; i++) {
    let day = {
      tempF: weatherDataJSON.days[i].temp,
      tempC: parseFloat(
        (((weatherDataJSON.days[i].temp - 32) * 5) / 9).toFixed(1)
      ),
      weatherStatus: weatherDataJSON.days[i].description,
      tempMinF: weatherDataJSON.days[i].tempmin,
      tempMinC: parseFloat(
        (((weatherDataJSON.days[i].tempmin - 32) * 5) / 9).toFixed(1)
      ),
      tempMaxF: weatherDataJSON.days[i].tempmax,
      tempMaxC: parseFloat(
        (((weatherDataJSON.days[i].tempmax - 32) * 5) / 9).toFixed(1)
      ),
      dateTime: weatherDataJSON.days[i].datetime,
    };

    days.push(day);
  }

  let processedData = {
    currentLocation: location,
    sevenDays: days,
  };
  return processedData;
}

async function createPageHeader() {
  const data = await processData();
  const topDiv = document.createElement("div");
  topDiv.classList.add("page-header");

  const searchBar = document.createElement("div");
  searchBar.classList.add("search-bar");
  const input = document.createElement("input");

  const button = document.createElement("button");
  button.textContent = "Search";
  button.addEventListener("click", (e) => {
    url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${input.value}?key=4XZ4WAEYDVM5PYXMJF8YVQXLP`;
    renderPage();
  });

  searchBar.appendChild(input);
  searchBar.appendChild(button);

  const toggleTemp = document.createElement("button");
  toggleTemp.textContent = "Toggle Temperature";
  toggleTemp.classList.add("toggle-temperature");

  toggleTemp.addEventListener("click", () => {
    isCelsius = !isCelsius;
    renderPage();
  });

  const locationDiv = document.createElement("div");
  locationDiv.classList.add("location-div");
  locationDiv.textContent = data.currentLocation;

  const currentTempDiv = document.createElement("div");
  currentTempDiv.classList.add("current-temp-div");

  const minMaxTempDiv = document.createElement("div");
  minMaxTempDiv.classList.add("min-max-temp-div");

  const tempMaxDiv = document.createElement("div");
  tempMaxDiv.classList.add("temp-max-div");

  const tempMinDiv = document.createElement("div");
  tempMinDiv.classList.add("temp-min-div");

  if (isCelsius) {
    currentTempDiv.textContent = `${data.sevenDays[0].tempC}C`;
    tempMaxDiv.textContent = `H: ${data.sevenDays[0].tempMaxC}C`;
    tempMinDiv.textContent = `L: ${data.sevenDays[0].tempMinC}C`;
  } else {
    currentTempDiv.textContent = `${data.sevenDays[0].tempF}F`;
    tempMaxDiv.textContent = `H: ${data.sevenDays[0].tempMaxF}F`;
    tempMinDiv.textContent = `L: ${data.sevenDays[0].tempMinF}F`;
  }

  minMaxTempDiv.appendChild(tempMaxDiv);
  minMaxTempDiv.appendChild(tempMinDiv);

  topDiv.appendChild(searchBar);
  topDiv.appendChild(toggleTemp);
  topDiv.appendChild(locationDiv);
  topDiv.appendChild(currentTempDiv);
  topDiv.appendChild(minMaxTempDiv);

  return topDiv;
}

async function createMainContent() {
  const data = await processData();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const mainContent = document.createElement("div");
  mainContent.classList.add("main-content");

  const mainContentHeader = document.createElement("div");
  mainContentHeader.classList.add("main-content-header");
  mainContentHeader.textContent = "7 Day Outlook";

  mainContent.appendChild(mainContentHeader);

  for (let i = 0; i < data.sevenDays.length; i++) {
    const date = new Date(data.sevenDays[i].dateTime);

    const row = document.createElement("div");
    row.classList.add("row");

    const dayOfWeek = document.createElement("div");
    dayOfWeek.classList.add("day-of-week");
    dayOfWeek.textContent = days[date.getDay()];

    const weatherStatus = document.createElement("div");
    weatherStatus.textContent = data.sevenDays[i].weatherStatus;
    weatherStatus.classList.add("weather-status");

    const tempRange = document.createElement("div");
    tempRange.classList.add("temp-range");

    const tempMin = document.createElement("div");
    tempMin.classList.add("temp-min");
    const tempMax = document.createElement("div");
    tempMax.classList.add("temp-max");

    if (isCelsius) {
      tempMin.textContent = `L: ${data.sevenDays[i].tempMinC}C`;
      tempMax.textContent = `H: ${data.sevenDays[i].tempMaxC}C`;
    } else {
      tempMin.textContent = `L: ${data.sevenDays[i].tempMinF}F`;
      tempMax.textContent = `H: ${data.sevenDays[i].tempMaxF}F`;
    }

    tempRange.appendChild(tempMin);
    tempRange.appendChild(tempMax);

    row.appendChild(dayOfWeek);
    row.appendChild(weatherStatus);
    row.appendChild(tempRange);

    mainContent.appendChild(row);
  }

  return mainContent;
}

async function renderPage() {
  document.body.innerHTML = "";
  const topDiv = await createPageHeader();
  const mainContent = await createMainContent();

  document.body.appendChild(topDiv);
  document.body.appendChild(mainContent);
}

renderPage();
