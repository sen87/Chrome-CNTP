/*
Weather Script using 'jquery.simpleWeather.js'
http://monkeecreate.github.io/jquery.simpleWeather/
v0.5 sen
*/

// get weather data
function weather_load(w_unit, w_forecast, w_woeid, w_link) {
  $.simpleWeather({
    woeid: w_woeid,
    unit: w_unit,
    success: function(weather) {
      // link
      $('.weather a').attr('href',w_link);
      var html = '<a href="' + w_link + '"><table class="weather_tbl"><tr><td>';
      // today
      html += '<h1>' + weather.temp + '&deg;' + weather.units.temp + '</h1>';
      html += '<p><span class="weather_symbol">⚑</span> ' + weather.city + '</p>';
      html += '<p><span class="weather_symbol">☀</span> ' + weather.currently + '</p>';
      html += '<p><span class="weather_symbol">≋</span> ' + weather.wind.speed + ' ' + weather.units.speed + '</p>';
      html += '<p><span class="weather_symbol">☔</span> ' + weather.humidity + '%</p>';
      html += '</td><td><img src="weather/' + weather.code + '.png"></td></tr>';
      // forecast
      if (w_forecast) {
        html += '<tr><td colspan="2" class="weather_tbl_hline"><table class="weather_tbl_forecast"><tr>';
        for (var i = 1; i <= 3; i++) {
          if (i == 2) {
            html += '<td class="weather_tbl_vline">';
          } else {
            html += '<td>';
          }
          html += '<p><span class="weather_symbol">◷</span> ' + weather.forecast[i].day + '</p>';
          html += '<p><span class="weather_symbol">☀</span> ' + weather.forecast[i].text + '</p>';
          html += '<p><span class="weather_symbol">⚪</span> ' + weather.forecast[i].low + '&deg;' + weather.units.temp + ' - ' + weather.forecast[i].high + '&deg;' + weather.units.temp + '</p>';
          html += '<img src="weather/' + weather.forecast[i].code + '.png"></td>';
        }
        html += '</tr>';
      }
      html += '</table></td></tr></table></a>';
      // html output
      $('.weather_frame').html(html);
    },
    error: function(error) {
      console.log('ERROR: Could not load the Weather Forecast!');
    }
  });
}

// get weather config
function weather_init() {
  chrome.storage.sync.get({
    weather: ['c', true, '1118370', 'http://forecast.io']
  }, function(settings) {
    var w_unit = settings.weather[0];
    var w_forecast = settings.weather[1];
    var w_woeid = settings.weather[2];
    var w_link = settings.weather[3];
    weather_load(w_unit, w_forecast, w_woeid, w_link);
  });
}

// init
$(document).ready(function() {
  chrome.storage.sync.get({
    layout: 'default',
    layout_custom_w: true,
  }, function(settings) {
    if (!(settings.layout == 'custom' && !settings.layout_custom_w)) {
      weather_init();
    }
  });
});
