/*
Save and Load Settings with Chrome Storage (Sync)
v0.6 sen
*/

// layout - create a new custom layout
function layout_create() {
  $('.l_create').prop('disabled', true);
  var columns = parseInt($('.l_columns option:selected').val());
  var rows = parseInt($('.l_rows option:selected').val());

  // create popover
  var html = '';
  var item = 1;
  for (var y = 1; y <= rows; y++) {
    for (var x = 1; x <= columns; x++) {
      html += '<select class="l_itemtype" id="' + item + '"><option value="1">RSS Feed</option>\
        <option value="2">Weather</option><option value="3">Notes</option><option value="4">Bookmarks</option></select>\
         <select class="l_rowspan" id="' + item + '"><option value="1">Span disabled</option>';
      for (var rowspan = 1; rowspan <= (rows - y); rowspan++) {
        html += '<option value="' + (rowspan + 1) + '">Span ' + (rowspan + 1) + ' Rows</option>';
      }
      html += '</select><div class="l_spacer"></div>';
      item++;
    }
    html += '<br>';
  }

  $('.l_createbox').html('<div id="l_pop">' + html + '<hr><button class="l_cancel">Cancel</button><button class="l_save">OK</button><br><br></div>');

  // itemtype - prevent double selection and reset rowspan
  $('.l_itemtype').change(function() {
    var id = $(this).prop('id');
    var option = $(this).val();
    if (option != '1') {
      $('.l_itemtype').each(function(index) {
        if ($(this).val() == option && $(this).prop('id') != id) {
          $(this).val('1');
          $('#' + $(this).prop('id') + '.l_rowspan').prop('disabled', false);
        }
      });
      $('#' + id + '.l_rowspan').val('1');
      $('#' + id + '.l_rowspan').prop('disabled', false);
      rowspan_update($('#' + id + '.l_rowspan'));
    } else {
      $('#' + $(this).prop('id') + '.l_rowspan').prop('disabled', false);
    }
    // create preview
    var out = l_createtable();
    layout_preview(out);
  });

  // rowspan - disable items
  function rowspan_update(object) {
    var disable = parseInt(object.prop('id')) + columns;
    if (object.val() == '2') {
      $('#l_pop #' + disable).val('');
      $('#l_pop #' + disable).prop('disabled', true);
      $('#l_pop #' + (disable + columns)).val('1');
      $('#l_pop #' + (disable + columns)).prop('disabled', false);
      $('#l_pop #' + (disable + (columns * 2))).val('1');
      $('#l_pop #' + (disable + (columns * 2))).prop('disabled', false);
    } else if (object.val() == '3') {
      $('#l_pop #' + disable).val('');
      $('#l_pop #' + disable).prop('disabled', true);
      $('#l_pop #' + (disable + columns)).val('');
      $('#l_pop #' + (disable + columns)).prop('disabled', true);
      $('#l_pop #' + (disable + (columns * 2))).val('1');
      $('#l_pop #' + (disable + (columns * 2))).prop('disabled', false);
    } else if (object.val() == '4') {
      $('#l_pop #' + disable).val('');
      $('#l_pop #' + disable).prop('disabled', true);
      $('#l_pop #' + (disable + columns)).val('');
      $('#l_pop #' + (disable + columns)).prop('disabled', true);
      $('#l_pop #' + (disable + (columns * 2))).val('');
      $('#l_pop #' + (disable + (columns * 2))).prop('disabled', true);
    } else {
      $('#l_pop #' + disable).val('1');
      $('#l_pop #' + disable).prop('disabled', false);
      $('#l_pop #' + (disable + columns)).val('1');
      $('#l_pop #' + (disable + columns)).prop('disabled', false);
      $('#l_pop #' + (disable + (columns * 2))).val('1');
      $('#l_pop #' + (disable + (columns * 2))).prop('disabled', false);
    }
  }
  $('.l_rowspan').change(function() {
    rowspan_update($(this));
    // create preview
    var out = l_createtable();
    layout_preview(out);
  });

  // close popover
  $('.l_cancel').click(function(e) {
    e.preventDefault();
    $('#l_pop').addClass('popkill');
    $('.l_create').prop('disabled', false);
    $('.l_layout').val('default');
    chrome.storage.sync.get({
      layout_default: '',
    }, function(settings) {
      layout_preview(settings.layout_default);
    });
  });

  // save
  $('.l_save').click(function(e) {
    out = l_createtable();
    layout_preview(out);
    $('.f_entry').each(function(index) {
      if (index < out[1]) {
        $(this).children('input').prop('disabled', false);
      } else {
        $(this).children('input').prop('disabled', true);
      }
    });
    chrome.storage.sync.set({
      layout_custom: [out[0], out[1]],
      layout_custom_w: out[2],
      layout_custom_n: out[3],
      layout_custom_bm: out[4],
    }, function() {
      $('#l_pop').addClass('popkill');
      $('.l_create').prop('disabled', false);
    });
  });

  // get settings and create the table layout
  function l_createtable() {
    var html = '';
    var item = 1;
    var feeds = 0;
    var weather = false;
    var notes = false;
    var bookmarks = false;
    for (var y = 1; y <= rows; y++) {
      if (rows == 3) {
        html += '<tr style="height: calc(33.33vh - 2.2em);">';  // height scaling (CSS)
      } else {
        html += '<tr style="height: calc(25vh - 2.2em);">';
      }
      for (var x = 1; x <= columns; x++) {
        if (!$('#l_pop #' + item).prop('disabled')) {
          html += '<td ';
          var span = $('#' + item + '.l_rowspan option:selected').val();
          if (span > 1) {
            html += 'rowspan="' + span + '" ';
          }
          var type = $('#' + item + '.l_itemtype option:selected').val();
          if (type == 1) {
            html += 'class="feed_box"></td>';
            feeds++;
          } else if (type == 2) {
            html += 'class="weather"><div class="head"><a href=""><h3>Weather</h3></a></div><div class="weather_frame"></div></td>';
            weather = true;
          } else if (type == 3) {
            html += 'class="notes"><div class="head"><h3>Notes</h3></div><label class="notes_frame"></label></td>';
            notes = true;
          } else {
            html += 'class="bookmarks"><div class="head"><h3>Bookmarks</h3></div><div class="b_frame"><div class="tbl_b1"></div><div class="tbl_b2"></div></div></td>';
            bookmarks = true;
          }
        }
        item++;
      }
      html += '</tr>';
    }
    return [html, feeds, weather, notes, bookmarks];
  }
}

// layout preview
function layout_preview(layout) {
  $('.l_preview').html(layout[0]);
  $('.weather').html('W');
  $('.notes').html('N');
  $('.bookmarks').html('B');
  $('.l_preview tr').removeAttr('style');
  $('.feed_box').each(function(index) {
    $(this).html(index + 1);
  });
  $('.l_feedcount').text(layout[1]);
}

// bookmarks - add a new category
function bookmarks_add() {
  var cat_name = prompt('Enter the Name for the new Bookmark Category: ', 'name here');
  if (cat_name) {
    var cat_num = $('.cat_remove').length + 1;
    $('.b_cats').append('<p class="b_catcount"><b><u><label id="' + cat_name + '">' + cat_name + '</label></u></b><br>\
    Position: <select><option value="left" selected="selected">left</option><option value="right">right</option></select>\
    <button class="cat_remove" id="cat_remove_' + cat_num + '">Remove Category</button><br>\
    <textarea class="b_cattext" rows="5"></textarea><br</p>');
    $('#cat_remove_' + cat_num).click(function() {
      bookmarks_remove($(this));
    });
  }
}

// bookmarks - restore
function bookmarks_restore(cat_num, cat_name, cat_pos, cat_text) {
  var cat_select = '<option value="left" selected="selected">left</option><option value="right">right</option>';
  if (cat_pos == 'right') {
    cat_select = '<option value="left" >left</option><option value="right" selected="selected">right</option>';
  }

  $('.b_cats').append('<p class="b_catcount"><b><u><label id="' + cat_name + '">' + cat_name + '</label></u></b><br>\
  Position: <select>' + cat_select + '</select>\
  <button class="cat_remove" id="cat_remove_' + cat_num + '">Remove Category</button><br>\
  <textarea class="b_cattext" rows="5">' + cat_text + '</textarea><br</p>');
}

// bookmarks - remove a category
function bookmarks_remove(cat) {
  if (confirm('Do you really want to remove this category?') == true) {
    cat.closest('p').remove();
  }
}

// restore settings on document
function restore_settings() {
  // themes
  for (var i = 0; i < css_themes.length; i++) {
    $('.t_theme').append('<option value="' + css_themes[i] + '">' + css_themes[i] + '.css</option>');
  }
  // get stored settings or load defaults
  chrome.storage.sync.get({
    version: 'fresh',
    title: 'Start ▬▬▶',
    pin: false,
    layout: 'default',
    layout_default: layout_init,
    layout_custom: layout_init,
    css_theme: 'Solid(sen).min',
    weather: ['c', true, '1118370', 'http://forecast.io'],
    b_favicons: true,
    b_catlist: [['Chat','left','Telegram,https://web.telegram.org/#/im'],['CNTP','left','Options,chrome-extension://jajbaigdfabgadnbmogpoichmgogbjmo/options.html'],
    ['Fun','left','4chan,https://www.4chan.org\n9GAG,http://9gag.com\n/R/Funny,https://www.reddit.com/r/funny/\nImgur,https://imgur.com/hot/time'],['Gaming','left','Steam,http://store.steampowered.com'],
    ['GFX','left','deviantART,http://www.deviantart.com/?order=11\npixiv,http://www.pixiv.net/ranking.php?mode=daily\nwallhaven,http://alpha.wallhaven.cc/latest'],
    ['Music','left','Discogs,http://www.discogs.com\nLast.FM,http://www.last.fm\nSoundCloud,https://soundcloud.com/stream'],
    ['Search','right','DuckDuckGo,https://duckduckgo.com\nGoogle,https://www.google.com\nWikipedia,https://www.wikipedia.org'],
    ['Service','right','anonym.to,http://anonym.to\nDNSStuff,http://www.dnsstuff.com/tools\nDown?,http://www.downforeveryoneorjustme.com\nDropbox,https://www.dropbox.com/home\nProxy,http://www.proxynova.com/proxy-server-list/\nunblock,http://unblocksit.es'],
    ['Videos','right','AniDB,http://anidb.net\nepguides,http://epguides.com\nIMDB,http://www.imdb.com\nYouTube,https://www.youtube.com/feed/subscriptions']],
    f_itemcount: '20',
    f_feedlist: [['DeviantArt','http://www.deviantart.com/browse/all/?order=11','http://backend.deviantart.com/rss.xml?q=boost%3Apopular+meta%3Aall+max_age%3A24h&type=deviation','m'],
    ['Phoronix','http://www.phoronix.com','http://www.phoronix.com/rss.php','d'],['Heise','http://www.heise.de','http://www.heise.de/newsticker/heise-atom.xml','d'],
    ['LWN','https://lwn.net','https://lwn.net/headlines/rss','d'],['Netzpolitik','https://netzpolitik.org','https://netzpolitik.org/feed','d'],
    ['Arch Linux','https://www.archlinux.org','https://planet.archlinux.org/rss20.xml','d'],['AnandTech','http://www.anandtech.com/pipeline','http://www.anandtech.com/rss/','d'],
    ['','','','d'],['','','','d'],['','','','d'],['','','','d'],['','','','d'],['','','','d'],['','','','d'],['','','','d'],['','','','d'],['','','','d'],['','','','d'],['','','','d'],['','','','d']]
  }, function(settings) {
    // general
    $('.g_title').val(settings.title);
    $('.g_pin').prop('checked', settings.pin);
    // layout
    if (settings.layout == 'default') {
      var layout = settings.layout_default;
    } else {
      var layout = settings.layout_custom;
      $('.l_layout').val('custom');
    }
    layout_preview(layout);
    $('.l_feedcount').text(layout[1]);
    // theme
    $('.t_theme').val(settings.css_theme);
    // weather
    $('.w_tempunit').val(settings.weather[0]);
    $('.w_forecast').prop('checked', settings.weather[1]);
    $('.w_woeid').val(settings.weather[2]);
    $('.w_link').val(settings.weather[3]);
    // bookmarks
    $('.b_favicons').prop('checked', settings.b_favicons);
    for (var x = 0; x < settings.b_catlist.length; x++) {
      bookmarks_restore(x, settings.b_catlist[x][0], settings.b_catlist[x][1], settings.b_catlist[x][2]);
    }
    for (var y = 0; y < settings.b_catlist.length; y++) {
      $('#cat_remove_' + y).click(function() {
        bookmarks_remove($(this));
      });
    }
    // rss
    $('.f_itemcount').val(settings.f_itemcount);
    $('.f_entry').each(function(index) {
      if (index < layout[1]) {
        $(this).children('input').prop('disabled', false);
        $(this).children('.f_imgtype').prop('disabled', false);
      }
      if (index < settings.f_feedlist.length) {
        $(this).children('.f_name').val(settings.f_feedlist[index][0]);
        $(this).children('.f_link').val(settings.f_feedlist[index][1]);
        $(this).children('.f_url').val(settings.f_feedlist[index][2]);
        $(this).children('.f_imgtype').val(settings.f_feedlist[index][3]);
      }
    });
    if (settings.version == 'fresh') {
      $('.save').trigger('click');
    }
    // status
    $('.status').text('Settings restored.');
    setTimeout(function() {
      $('.status').text('');
    }, 1200);
  });
}

// save settings
function save_settings() {
  // version
  var version = chrome.app.getDetails().version;
  // get settings from document -->
  // general
  var g_title = $('.g_title').val();
  var g_pin = $('.g_pin').prop('checked');
  // layout
  var l_layout = $('.l_layout option:selected').val();
  var l_feedcount = $('.l_layout option:selected').attr('feeds');
  // theme
  var t_theme = $('.t_theme option:selected').val();
  // weather
  var w_tempunit = $('.w_tempunit').val();
  var w_forecast = $('.w_forecast').prop('checked');
  var w_woeid = $('.w_woeid').val();
  var w_link = $('.w_link').val();
  var weather = [w_tempunit, w_forecast, w_woeid, w_link];
  // bookmarks
  var b_favicons = $('.b_favicons').prop('checked');
  var catlist = [];
  var catcount = $('.b_cats .b_catcount').length;
  for (var x = 0; x < catcount; x++) {
    catlist[x] = [$('.b_cats label')[x].id, $('.b_cats select')[x].value, $('.b_cats textarea')[x].value];
  }
  // sort bookmark categories alphabetically and case insensitive
  catlist.sort(function(x, y) {
    var a = String(x).toUpperCase();
    var b = String(y).toUpperCase();
    if (a > b) {return 1;}
    if (a < b) {return -1;}
    return 0;
  });
  // rss
  var f_itemcount = $('.f_itemcount').val();
  var feedlist = [];
  $('.f_entry').each(function(index) {
    feedlist[index] = [$(this).children('.f_name').val(),$(this).children('.f_link').val(),$(this).children('.f_url').val(),$(this).children('.f_imgtype').val()];
  });
  // store settings in chrome.storage
  try {
    chrome.storage.sync.set({
      version: version,
      title: g_title,
      pin: g_pin,
      layout: l_layout,
      layout_default: layout_init,
      css_theme: t_theme,
      weather: weather,
      b_favicons: b_favicons,
      b_catlist: catlist,
      f_itemcount: f_itemcount,
      f_feedlist: feedlist
    }, function() {
      // update status to let user know options were saved.
      $('.status').text('Settings saved.');
      setTimeout(function() {
        $('.status').text('');
      }, 1200);
    });
  }
  catch (error) {
    console.log('ERROR: Something went wrong while saving the configuration!');
    $('.status').text('ERROR: Something went wrong while saving the configuration!');
  }
}

function clear_settings() {
  if (confirm('Do you really want to restore the default config?\n(All your Settings will be cleared!)') == true) {
    chrome.storage.sync.clear(function() {});
    window.location.reload();
  }
}

// init
$(document).ready(function() {
  restore_settings();
  // tabs
  $('.tabs .tab_general').show().siblings().hide();
  // change tab
  $('.tabs .tab-links a').on('click', function(e)  {
    var currentAttrValue = $(this).attr('href');
    $('.tabs ' + currentAttrValue).show().siblings().hide();
    $(this).parent('li').addClass('active').siblings().removeClass('active');
    e.preventDefault();
  });
  // save settings
  $('.save').on('click', function() {save_settings();});
  // load defaults
  $('.defaults').on('click', function() {clear_settings();});
  // layout change
  $('.l_layout').change(function() {
    if ($('.l_layout option:selected').val() == 'custom') {
      $('.l_createbox').html('Create a new Custom Layout: <select class="l_rows"><option value="4">4 Rows</option><option value="3">3 Rows</option></select> <select class="l_columns"><option value="5">5 Columns</option><option value="4">4 Columns</option><option value="3">3 Columns</option></select> <button class="l_create">Create</button><br><br>');
      $('.l_create').on('click', function() {layout_create();});
    } else {
      $('.l_createbox').html('');
    }
    // update preview + feed counter & disable feeds
    chrome.storage.sync.get({
      layout_default: '',
      layout_custom: ''
    }, function(settings) {
      var feed_count = '';
      if ($('.l_layout option:selected').val() == 'custom') {
        layout_preview(settings.layout_custom);
      } else {
        layout_preview(settings.layout_default);
      }
      $('.l_feedcount').text(feed_count);
      $('.f_entry').each(function(index) {
        if (index < feed_count) {
          $(this).children('input').prop('disabled', false);
        } else {
          $(this).children('input').prop('disabled', true);
        }
      });
    });
  });
  // show theme info
  $('.t_pop_show').on('click', function() {
    $('.t_pop_show').prop('disabled', true);
    $('.t_info').html('<div class="t_pop">You can create themes for the CNTP with pure CSS!<br>\
    The best way to start is to use one of the already existing themes as a template.<br><hr>\
    The <b>location</b> of the directory containing the themes <a class="t_link" href="#">depends on your OS</a>.<br><br>\
    <b>Linux:</b> ~/.config/chromium/Default/Extensions/<label class="t_id"></label>/<label class="t_version"></label>/css/themes/<br>\
    <b>OSX:</b> ~/Library/Application Support/Chromium/Default/Extensions/<label class="t_id"></label>/<label class="t_version"></label>/css/themes/<br>\
    <b>Windows:</b> C:&#92Users&#92<b>YourUser</b>&#92AppData&#92Local&#92Chromium&#92User Data&#92Default&#92Extensions&#92<label class="t_id"></label>&#92<label class="t_version"></label>&#92css&#92themes&#92<br><hr>\
    To make your theme available here in the settings menu, go into the <b>"js"</b> folder of the extension and open the file <b>"options.js"</b>.<br>\
    On the last line of this file you can find the <b>"css_themes"</b> array that contains all the theme names.\
    Simply add your theme to this list and save the file in the subfolder "min" as "options.min.js" and reload the settings page.<br><hr>\
    If you created a nice theme that you would like to see included in this release drop me an <a href="mailto:sen@archlinux.us">email</a> or check out the <a href="https://github.com/sen87/Chrome-CNTP">git repo</a><br>\
    Have fun! :D<br><br>\
    <button class="t_pop_cancel">✔</button></div>');
    // extension location help link
    $('.t_link').on('click', function() {
      window.open('http://www.chromium.org/user-experience/user-data-directory');
    });
    // runtime id
    $('.t_id').text(chrome.runtime.id);
    // version
    $('.t_version').text(chrome.app.getDetails().version);
    $('.t_pop_cancel').click(function(e) {
      e.preventDefault();
      $('.t_pop').addClass('popkill');
      $('.t_pop_show').prop('disabled', false);
    });
  });
  // add a new bookmark category
  $('.b_addcategory').on('click', function() {bookmarks_add();});
  // show feed info
  $('.f_pop_show').on('click', function() {
    $('.f_pop_show').prop('disabled', true);
    $('.f_info').html('<div class="f_pop">Most websites these days offer some kind of <a class="f_link" href="#">news feed</a>. Message boards, social networking platforms, dedicated news sites, shops... you name it!<br>\
    You can use these feeds to get content updates and basically build your own digital newspaper.<br><hr>\
    While some websites give you a direct link to an rss feed (mostly in form of the orange rss icon) many will not. Even if they support it!<br><br>\
    <b>So how do I find the URL to a feed?</b><br>\
    One way is to just google for it (yeah...) or to check the page source.<br>\
    To check the page source of the website in question, all you need to do is: <b> right click --> View page source</b><br>\
    Then search (press STRG+F) for <b>"rss"</b>, <b>"feed"</b> or <b>"xml"</b> and look or an URL.<br>\
    Here an example feed URL (from reddit): https://www.reddit.com/r/funny/.rss<br><hr>\
    <b>YouTube Channel Feed</b><br>\
    First you need to extract the Channel ID of the YouTube Channel you want to view from its URL.<br><br>\
    Example Channel: https://www.youtube.com/channel/<b>UCSfNQtA4Qd3NLMBAPp3FP5A</b><br><br>\
    Append this ID to the following URL: https://www.youtube.com/feeds/videos.xml?channel_id=<br>\
    Result: https://www.youtube.com/feeds/videos.xml?channel_id=UCSfNQtA4Qd3NLMBAPp3FP5A<br><br>\
    <button class="f_pop_cancel">✔</button></div>');
    // feed help link
    $('.f_link').on('click', function() {
      window.open('http://en.wikipedia.org/wiki/Web_feed');
    });
    $('.f_pop_cancel').click(function(e) {
      e.preventDefault();
      $('.f_pop').addClass('popkill');
      $('.f_pop_show').prop('disabled', false);
    });
  });
});

// global var
var layout_init = ['<tr style="height: calc(33.33vh - 2.2em);"><td class="weather"><div class="head"><a href=""><h3>Weather</h3></a></div><div class="weather_frame"></div></td>\
  <td rowspan="3" class="feed_box"></td><td class="feed_box"></td><td class="feed_box"></td>\
  <td rowspan="3" class="bookmarks"><div class="head"><h3>Bookmarks</h3></div><div class="b_frame"><div class="tbl_b1"></div><div class="tbl_b2"></div></div></td></tr>\
  <tr style="height: calc(33.33vh - 2.2em);"><td rowspan="2" class="notes"><div class="head"><h3>Notes</h3></div><label class="notes_frame"></label></td>\
  <td class="feed_box"></td><td class="feed_box"></td></tr><tr style="height: calc(33.33vh - 2.2em);">><td class="feed_box"></td><td class="feed_box"></td></tr>','7'];

var css_themes = ['Clean&Simple(sen).min', 'Coffee(sen).min', 'PreciousPurple(SiCKHEAD).min', 'Solid(sen).min', 'Solid_Flat(sen).min'];
