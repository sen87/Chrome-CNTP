/*
JS JQuery Feed Reader
v0.5 sen
*/

function rss_init() {
  // get rss settings
  try {
    chrome.storage.sync.get({
      f_itemcount: '20',
      f_feedlist: [['DeviantArt','http://www.deviantart.com/browse/all/?order=11','http://backend.deviantart.com/rss.xml?q=boost%3Apopular+meta%3Aall+max_age%3A24h&type=deviation','m'],
      ['Phoronix','http://www.phoronix.com','http://www.phoronix.com/rss.php','d'],['Heise','http://www.heise.de','http://www.heise.de/newsticker/heise-atom.xml','d'],
      ['LWN','https://lwn.net','https://lwn.net/headlines/rss','d'],['Netzpolitik','https://netzpolitik.org','https://netzpolitik.org/feed','d'],
      ['Arch Linux','https://www.archlinux.org','https://planet.archlinux.org/rss20.xml','d'],['AnandTech','http://www.anandtech.com/pipeline','http://www.anandtech.com/rss/','d'],
      ['','','','d'],['','','','d'],['','','','d'],['','','','d'],['','','','d'],['','','','d'],['','','','d'],['','','','d'],['','','','d'],['','','','d'],['','','','d'],['','','','d'],['','','','d']]
    }, function(settings) {
      $('.feed_box').each(function(index) {
        var feed_name = settings.f_feedlist[index][0];
        var web_url = settings.f_feedlist[index][1];
        var feed_url = settings.f_feedlist[index][2];
        var feed_imgtype = settings.f_feedlist[index][3];
        // html setup
        $(this).html('<div class="head"><a href="' + web_url + '"><h3>' + feed_name + '</h3></a></div><div class="feed_frame"></div>');
        var html_rssout = '';
        var feed_frame = $(this).children('.feed_frame');
        // try loading feed
        $.get(feed_url)
        // success
        .done(function(feed) {
          var item_def = 'item';
          if (!$(feed).find(item_def).length) {
            item_def = 'entry';
          };
          // load feed items
          var count = 0;
          $(feed).find(item_def).each(function() {
            // init
            var feed_item = $(this);
            // get feed content
            feed_title = feed_item.find('title').text();
            feed_link = feed_item.find('link').text();
            // check date
            feed_date = '';
            if (feed_item.find('pubDate').length) {
              var d = new Date(feed_item.find('pubDate').text());
              feed_date = d.toDateString() + ' | ' + d.toLocaleTimeString();
            } else if (feed_item.find('dc\\:date,date').length) {
              var d = new Date(feed_item.find('dc\\:date,date').text());
              feed_date = d.toDateString() + ' | ' + d.toLocaleTimeString();
            }
            // check author
            var feed_author = '';
            if (feed_item.find('dc\\:creator,creator').length) {
              feed_author = 'by ' + feed_item.find('dc\\:creator,creator').text();
            } else if (feed_item.find('media\\:credit,credit').eq('0').length) {
              feed_author = 'by ' + feed_item.find('media\\:credit,credit').eq('0').text();
            }
            if (feed_date && feed_author) {
              feed_date += ' | ';
            };
            // check feed media
            var feed_image = '';
            if (feed_imgtype != 'd') {
              if (feed_imgtype == 's' && feed_item.find('media\\:thumbnail,thumbnail').eq('0').length) {
                image = feed_item.find('media\\:thumbnail,thumbnail').eq('0').attr('url');
              } else if (feed_imgtype == 'm' && feed_item.find('media\\:thumbnail,thumbnail').eq('1').length) {
                image = feed_item.find('media\\:thumbnail,thumbnail').eq('1').attr('url');
              } else if (feed_imgtype == 'l' && feed_item.find('media\\:content,content').length) {
                image = feed_item.find('media\\:content,content').attr('url');
              }
              feed_image = '<div class="feed_image_shadow"><img class="feed_image" src="' + image + '"/></div>';
            }
            // html output
            html_rssout += '<a class="feed_entry" href="' + feed_link + '">' + feed_title + '<p>' + feed_date + feed_author + feed_image + '</p></a>';
            // max feed items
            count++;
            return (count < settings.f_itemcount);
          });
          feed_frame.html(html_rssout);
        })
        // failed loading feed
        .fail(function() {
          console.log('Could not load the RSS Feed: ' + feed_name);
        });
      });
    });
  }
  catch (error) {
    console.log('ERROR: RSS Settings could not be loaded!');
  }
}

// init
$(document).ready(function() {rss_init();});
