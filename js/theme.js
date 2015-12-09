/*
Load CSS Theme
v0.2 sen
*/

function theme() {
  try {
    chrome.storage.sync.get({
      title: 'Start ▬▬▶',
      pin: false,
      css_theme: 'Solid(sen).min'
    }, function(load) {

      // set page title
      document.title = load.title;

      // pinn tab
      if (load.pin) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          var current = tabs[0];
          chrome.tabs.update(current.id, {pinned: !current.pinned});
        });
      }

      // set css theme
      document.getElementById('css_theme').href = 'css/themes/' + load.css_theme + '.css';
    });
  }
  catch (error) {
    console.log('ERROR: Could not set the CSS Theme!');
  }
}

// init
$(document).ready(function() {theme();});
