/*
Text Notes Script
Save and Load Notes with Chrome Storage (Sync)
v0.6 sen
*/

// load notes
function notes_load() {
  try {
    chrome.storage.sync.get({
      notes: '<b>^^^^^^^^^^^^^^^^^^\nclick on "Notes" to edit / save</b>\n\n\nURLs will be converted to links:\nhttps://duckduckgo.com\n\n\n<img src="../favicon/icon128_wg.png"></img>\n━━━━━━━━━━━━━━━━━━━\nCustom New Tab Page\n------- Version 1.1 -------\n━━━━━━━━━━━━━━━━━━━'
    }, function(load) {
      var text = load.notes;
      var target = $('.notes_frame');
      // textarea
      if (target.is('textarea')) {
        target.val(text);
      } else {
        // label
        text = text.replace(/\n/g, '<br \>'); // line breaks
        text = text.replace(/\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim, '<a href="$&">$&</a>'); // match URLs
        target.html(text);
      }
    });
  }
  catch (error) {
    console.log('ERROR: Notes could not be loaded!');
  }
}

// save notes
function notes_save() {
  try {
    chrome.storage.sync.set({
      notes: $('.notes_frame').val()
    }, function() {});
  }
  catch (error) {
    console.log('ERROR: Notes could not be saved!');
  }
}

// init
$(document).ready(function() {
  chrome.storage.sync.get({
    layout: 'default',
    layout_custom_n: true,
  }, function(settings) {
    if (!(settings.layout == 'custom' && !settings.layout_custom_n)) {
      notes_load();
      // click
      $('.notes .head').on('click', function()  {
        var mode = $(this).find('h3');
        if (mode.text() == 'Notes') {
          // switch to edit mode
          $('.notes_frame').replaceWith('<textarea class="notes_frame"></textarea>');
          notes_load();
          $('.notes_frame').focus();
          mode.text('>>> Save <<<');
        } else {
          // switch to view mode
          notes_save();
          $('.notes_frame').replaceWith('<label class="notes_frame"></label>');
          notes_load();
          mode.text('Notes');
        }
      });
    }
  });
});
