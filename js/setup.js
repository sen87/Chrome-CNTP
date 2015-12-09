/*
Load HTML Layout and FirstRun Check
v0.3 sen
*/

function setup() {
  var layout_init = ['<tr style="height: calc(33.33vh - 2.2em);"><td class="weather"><div class="head"><a href=""><h3>Weather</h3></a></div><div class="weather_frame"></div></td>\
    <td rowspan="3" class="feed_box"></td><td class="feed_box"></td><td class="feed_box"></td>\
    <td rowspan="3" class="bookmarks"><div class="head"><h3>Bookmarks</h3></div><div class="b_frame"><div class="tbl_b1"></div><div class="tbl_b2"></div></div></td></tr>\
    <tr style="height: calc(33.33vh - 2.2em);"><td rowspan="2" class="notes"><div class="head"><h3>Notes</h3></div><label class="notes_frame"></label></td>\
    <td class="feed_box"></td><td class="feed_box"></td></tr><tr style="height: calc(33.33vh - 2.2em);">><td class="feed_box"></td><td class="feed_box"></td></tr>','7'];
  try {
    chrome.storage.sync.get({
      version: 'fresh',
      layout: 'default',
      layout_default: layout_init,
      layout_custom: layout_init
    }, function(settings) {
      // set layout
      var html = '';
      if (settings.layout == 'custom') {
        html = settings.layout_custom[0];
      } else {
        html = settings.layout_default[0];
      }
      $('.window_tab').html(html);
      // first run check
      if (settings.version == 'fresh') {
        window.open('chrome-extension://' + chrome.runtime.id + '/options.html');
      }
    });
  }
  catch (error) {
    console.log('ERROR: Page Setup failed!');
  }
}

// reload page with delay on size change
$(window).resize(function() {
  var delay = (function() {
    var timer = 0;
    return function(callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();
  delay(function() {
    location.reload();
  }, 300);
});

// init
$(document).ready(function() {setup();});
