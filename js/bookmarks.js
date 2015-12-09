/*
Load Bookmarks from chrome.storage into HTML
v0.3 sen
*/

// get stored Bookmarks or load defaults
function bookmarks_load() {
  try {
    chrome.storage.sync.get({
      b_favicons: true,
      b_catlist: [['Chat','left','Telegram,https://web.telegram.org/#/im'],['CNTP','left','Options,chrome-extension://jajbaigdfabgadnbmogpoichmgogbjmo/options.html'],
      ['Fun','left','4chan,https://www.4chan.org\n9GAG,http://9gag.com\n/R/Funny,https://www.reddit.com/r/funny/\nImgur,https://imgur.com/hot/time'],['Gaming','left','Steam,http://store.steampowered.com'],
      ['GFX','left','deviantART,http://www.deviantart.com/?order=11\npixiv,http://www.pixiv.net/ranking.php?mode=daily\nwallhaven,http://alpha.wallhaven.cc/latest'],
      ['Music','left','Discogs,http://www.discogs.com\nLast.FM,http://www.last.fm\nSoundCloud,https://soundcloud.com/stream'],
      ['Search','right','DuckDuckGo,https://duckduckgo.com\nGoogle,https://www.google.com\nWikipedia,https://www.wikipedia.org'],
      ['Service','right','anonym.to,http://anonym.to\nDNSStuff,http://www.dnsstuff.com/tools\nDown?,http://www.downforeveryoneorjustme.com\nDropbox,https://www.dropbox.com/home\nProxy,http://www.proxynova.com/proxy-server-list/\nunblock,http://unblocksit.es'],
      ['Videos','right','AniDB,http://anidb.net\nepguides,http://epguides.com\nIMDB,http://www.imdb.com\nYouTube,https://www.youtube.com/feed/subscriptions']],
    }, function(settings) {
      for (var x = 0; x < settings.b_catlist.length; x++) {
        bookmarks_restore(settings.b_favicons, settings.b_catlist[x][0], settings.b_catlist[x][1], settings.b_catlist[x][2]);
      }
    });
  }
  catch (error) {
    console.log('ERROR: Bookmarks could not be loaded!');
  }
}

// bookmarks - restore
function bookmarks_restore(favicons, cat_name, cat_pos, cat_text) {
  // position
  div = $('.tbl_b1');
  if (cat_pos == 'right') {
    div = $('.tbl_b2');
  }
  // category title
  var html = '<p class="space"><h4>' + cat_name + '</h4>';
  // setup links
  var lines = cat_text.split('\n');
  for (var x = 0; x < lines.length; x++) {
    var elements = lines[x].split(',');
    html += '<a href="' + elements[1] + '">';
    // favicons
    if (favicons) {
      //html += '<img src="http://www.google.com/s2/favicons?domain=' + elements[1] + '" alt="error" width="16" height="16"> ';
      html += '<img src="chrome://favicon/' + elements[1] + '" alt="error" width="16" height="16"> ';
    }
    html += elements[0] + '</a></p>';
  }
  // write html
  div.append(html);
}

// init
$(document).ready(function() {
  chrome.storage.sync.get({
    layout: 'default',
    layout_custom_bm: true
  }, function(settings) {
    if (!(settings.layout == 'custom' && !settings.layout_custom_bm)) {
      bookmarks_load();
    }
  });
});
