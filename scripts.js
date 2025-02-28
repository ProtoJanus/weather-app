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
  const location = await weatherDataJSON.address;
  const days = [];

  for (let i = 0; i < 7; i++) {
    let day = {
      temp: weatherDataJSON.days[i].temp,
      weatherStatus: weatherDataJSON.days[i].description,
      tempMin: weatherDataJSON.days[i].tempmin,
      tempMax: weatherDataJSON.days[i].tempmax,
    };

    days.push(day);
  }

  let processedData = {
    currentLocation: location,
    sevenDays: days,
  };
  return processedData;
}

async function renderTopDiv() {
  const data = await processData();
  const topDiv = document.createElement("div");
  topDiv.classList.add("top-div");

  const searchBar = document.createElement("div");
  const input = document.createElement("input");
  const button = document.createElement("button");

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

  const tempMinDiv = document.createElement("div");
  tempMinDiv.classList.add("temp-min-div");
  tempMinDiv.textContent = data.sevenDays[0].tempMin;

  const tempMaxDiv = document.createElement("div");
  tempMaxDiv.classList.add("temp-max-div");
  tempMaxDiv.textContent = data.sevenDays[0].tempMax;

  minMaxTempDiv.appendChild(tempMinDiv);
  minMaxTempDiv.appendChild(tempMaxDiv);

  topDiv.appendChild(searchBar);
  topDiv.appendChild(locationDiv);
  topDiv.appendChild(currentTempDiv);
  topDiv.appendChild(minMaxTempDiv);

  document.body.appendChild(topDiv);
}

renderTopDiv();

// Top Div
// Search Bar
// Location
// Current Temp
// Weather Status
// H: L: (High and low for day)
