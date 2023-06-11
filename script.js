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
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth();
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var firstDayOfWeek = new Date(year, month, 1).getDay();
  var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  var calendarHTML = "<table>";
  calendarHTML += "<tr>";
  // 曜日をヘッダーとして表示
  for (var i = 0; i < weekdays.length; i++) {
    calendarHTML += "<th>" + weekdays[i] + "</th>";
  }
  calendarHTML += "</tr>";

  var dayCount = 1;
  var rowCount = Math.ceil((daysInMonth + firstDayOfWeek) / 7);

  // カレンダーの日付を表示
  for (var row = 0; row < rowCount; row++) {
    calendarHTML += "<tr>";
    for (var col = 0; col < 7; col++) {
      if (row === 0 && col < firstDayOfWeek) {
        calendarHTML += "<td></td>";
      } else if (dayCount > daysInMonth) {
        break;
      } else {
        calendarHTML += "<td>" + dayCount + "</td>";
        dayCount++;
      }
    }
    calendarHTML += "</tr>";
  }

  calendarHTML += "</table>";
  // カレンダーを表示
  calendarElement.innerHTML = calendarHTML;

  monthElement.textContent = months[month];
}

// 1秒ごとに現在時刻を更新
setInterval(displayCurrentTime, 1000);

// 初回の表示
displayCurrentTime();
displayCalendar();

// Google Calendar APIのクライアントID
var CLIENT_ID = '1031632072663-9il7ot960qb2abh7m75jdl3p5htpktoe.apps.googleusercontent.com';

// APIキーを指定するときは以下のコメントを外して、APIキーを入力してください
// var API_KEY = 'YOUR_API_KEY';

// Google Calendar APIのスコープ
var SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

// 認証後のコールバック関数
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

// Google Calendar APIクライアントの初期化
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    scope: SCOPES
  }).then(function () {
    // 認証状態を確認
    if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
      // ユーザー認証ダイアログを表示
      gapi.auth2.getAuthInstance().signIn().then(function () {
        // 認証成功後に予定を取得して表示
        listUpcomingEvents();
      });
    } else {
      // 認証済みの場合、予定を取得して表示
      listUpcomingEvents();
    }
  });
}

// Google Calendar APIから予定を取得して表示
function listUpcomingEvents() {
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'maxResults': 5,
    'orderBy': 'startTime',
    'singleEvents': true
  }).then(function (response) {
    var events = response.result.items;

    var eventsElement = document.getElementById("events");
    var eventsHTML = "";

    if (events.length > 0) {
      eventsHTML += "<h2>Upcoming Events:</h2>";

      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        var start = event.start.dateTime || event.start.date;
        eventsHTML += "<p>" + event.summary + " - " + start + "</p>";
      }
    } else {
      eventsHTML += "<p>No upcoming events found.</p>";
    }

    eventsElement.innerHTML = eventsHTML;
  });
}

// 1秒ごとに現在時刻を更新
setInterval(displayCurrentTime, 1000);

// 初回の表示
displayCurrentTime();
displayCalendar();

// Google Calendar APIのクライアントライブラリを非同期に読み込む
(function () {
  var script = document.createElement('script');
  script.src = 'https://apis.google.com/js/api.js';
  script.onload = handleClientLoad;
  document.body.appendChild(script);
})();

// 先程のコードに以下を追加します
/*
// OpenWeatherMap APIのAPIキー
var API_KEY = 'abf45a6326ace821efb1c5dd7e7bb186';

// 1週間の天気予報を取得して表示
function getWeatherForecast() {
  var forecastElement = document.getElementById("weather-forecast");
  var forecastHTML = "<h2>Weather Forecast:</h2>";

  var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=Hitachinaka,JP&units=metric&appid=" + API_KEY;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      var forecasts = data.list;

      for (var i = 0; i < forecasts.length; i++) {
        var forecast = forecasts[i];
        var dateTime = new Date(forecast.dt * 1000);
        var date = dateTime.toLocaleDateString();
        var time = dateTime.toLocaleTimeString();
        var temperature = forecast.main.temp;
        var description = forecast.weather[0].description;

        forecastHTML += "<p>" + date + " " + time + " - " + temperature + "°C, " + description + "</p>";
      }

      forecastElement.innerHTML = forecastHTML;
    })
    .catch(error => {
      console.error('Error:', error);
      forecastElement.innerHTML = "<p>Failed to fetch weather forecast.</p>";
    });
}

*/

// 1秒ごとに現在時刻を更新
setInterval(displayCurrentTime, 1000);

// 初回の表示
displayCurrentTime();
displayCalendar();
//getWeatherForecast();
