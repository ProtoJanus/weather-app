async function getData() {
  const url =
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/houston?key=4XZ4WAEYDVM5PYXMJF8YVQXLP";
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
      temp: weatherDataJSON.days[i].temp,
      weatherStatus: weatherDataJSON.days[i].description,
      tempMin: weatherDataJSON.days[i].tempmin,
      tempMax: weatherDataJSON.days[i].tempmax,
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
  topDiv.classList.add("top-div");

  const searchBar = document.createElement("div");
  searchBar.classList.add("search-bar");
  const input = document.createElement("input");

  const button = document.createElement("button");
  button.textContent = "Search";

  searchBar.appendChild(input);
  searchBar.appendChild(button);

  const locationDiv = document.createElement("div");
  locationDiv.classList.add("location-div");
  locationDiv.textContent = data.currentLocation;

  const currentTempDiv = document.createElement("div");
  currentTempDiv.classList.add("current-temp-div");
  currentTempDiv.textContent = data.sevenDays[0].temp;

  const minMaxTempDiv = document.createElement("div");
  minMaxTempDiv.classList.add("min-max-temp-div");

  const tempMaxDiv = document.createElement("div");
  tempMaxDiv.classList.add("temp-max-div");
  tempMaxDiv.textContent = `H: ${data.sevenDays[0].tempMax}`;

  const tempMinDiv = document.createElement("div");
  tempMinDiv.classList.add("temp-min-div");
  tempMinDiv.textContent = `L: ${data.sevenDays[0].tempMin}`;

  minMaxTempDiv.appendChild(tempMaxDiv);
  minMaxTempDiv.appendChild(tempMinDiv);

  topDiv.appendChild(searchBar);
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

  for (let i = 0; i < data.sevenDays.length; i++) {
    const date = new Date(data.sevenDays[i].dateTime);

    const row = document.createElement("div");

    const dayOfWeek = document.createElement("div");
    dayOfWeek.textContent = days[date.getDay()];

    const weatherStatus = document.createElement("div");
    weatherStatus.textContent = data.sevenDays[i].weatherStatus;

    row.appendChild(dayOfWeek);
    row.appendChild(weatherStatus);

    mainContent.appendChild(row);
  }

  return mainContent;
}

async function renderPage() {
  const topDiv = await createPageHeader();
  const mainContent = await createMainContent();

  document.body.appendChild(topDiv);
  document.body.appendChild(mainContent);
}

renderPage();
