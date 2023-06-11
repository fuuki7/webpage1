// 現在時刻を表示する関数
function displayCurrentTime() {
  var currentTimeElement = document.getElementById("current-time");
  var currentDateElement = document.getElementById("current-date");
  var currentWeatherElement = document.getElementById("current-weather");
  var currentWeatherDescElement = document.getElementById("current-weatherDesc");
  var currentTime = new Date();
  var hours = currentTime.getHours();
  var minutes = currentTime.getMinutes();
  var seconds = currentTime.getSeconds();
  var month = currentTime.getMonth() + 1;
  var day = currentTime.getDate();
  var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var weekday = weekdays[currentTime.getDay()];

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  // 時刻を表示
  currentTimeElement.textContent = hours + ":" + minutes + ":" + seconds;
  // 日付を表示
  currentDateElement.textContent =  month + "/" + day + " " + weekday;

  // 天気情報を取得
  var apiKey = "abf45a6326ace821efb1c5dd7e7bb186"; // OpenWeatherMapのAPIキーを入力してください
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=Hitachinaka,JP&units=metric&appid=" + apiKey;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      var weatherDescription = data.weather[0].description;
      var weather = data.main.temp + "°C";
      // 天気を表示
      currentWeatherElement.textContent = weather;
      currentWeatherDescElement.textContent = weatherDescription;
    })
    .catch(error => {
      console.log("Error fetching weather data:", error);
    });
}

// カレンダーを表示する関数
function displayCalendar() {
  var calendarElement = document.getElementById("calendar");
  var monthElement = document.getElementById("month");
  var currentDate = new Date();
  var month = currentDate.getMonth();
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  // カレンダーのHTMLを生成
  var calendarHTML = "<table>";

  // カレンダーのヘッダー行
  calendarHTML += "<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>";

  // カレンダーの日付部分
  var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  var startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstDay.getDay()); // 前月分の日付を取得

  var endDate = new Date(lastDay);
  endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay())); // 来月分の日付を取得

  var currentDateMarker = new Date();

  while (startDate <= endDate) {
    calendarHTML += "<tr>";

    for (var i = 0; i < 7; i++) {
      var dateClass = "";
      if (startDate.getMonth() === currentDate.getMonth() && startDate.getDate() === currentDate.getDate()) {
        dateClass = "current-date"; // 今日の日付に適用するクラス
      }

      calendarHTML += "<td class='" + dateClass + "'>" + startDate.getDate() + "</td>";
      startDate.setDate(startDate.getDate() + 1);
    }

    calendarHTML += "</tr>";
  }

  calendarHTML += "</table>";

  calendarElement.innerHTML = calendarHTML;

  monthElement.textContent = months[month];
}

// OpenWeatherMap APIのAPIキー
var API_KEY = 'abf45a6326ace821efb1c5dd7e7bb186';

function formatDate(date) {
  const options = {
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    hour12: true,
  };
  return date.toLocaleString('jp', options);
}

// 1週間の天気予報を取得して表示
function getWeatherForecast() {
  var forecastElement = document.getElementById("weather-forecast");
  var forecastHTML = "<h3>Weather Forecast:</h3>";

  var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=Hitachinaka,JP&units=metric&appid=" + API_KEY;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      var forecasts = data.list;

      for (var i = 0; i < forecasts.length; i++) {
        var forecast = forecasts[i];
        var dateTime = new Date(forecast.dt * 1000);
        var date = formatDate(dateTime);
        var temperature = forecast.main.temp;
        var description = forecast.weather[0].description;

        forecastHTML += "<p>" + date + " " + temperature + "°C, " + description + "</p>";
      }

      forecastElement.innerHTML = forecastHTML;
    })
    .catch(error => {
      console.error('Error:', error);
      forecastElement.innerHTML = "<p>Failed to fetch weather forecast.</p>";
    });
}

// 1秒ごとに現在時刻を更新
setInterval(displayCurrentTime, 1000);
setInterval(getWeatherForecast, 1800000);

// 初回の表示
displayCurrentTime();
displayCalendar();
getWeatherForecast();
