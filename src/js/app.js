var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var Accel = require('ui/accel');
var Settings = require('settings');

Settings.config(
  { url: 'http://www.yaoyuyang.com/hookautomation/config/' },
  // open
  function(e) {
    console.log('opening configurable');
  },
  // close
  function(e) {
    console.log('closed configurable');
    // Show the parsed response
    console.log(JSON.stringify(e.options));
  }
);


var controlCard = function(item, urlUp, urlDown) {
  var card = new UI.Card({
    title: item.title,
    action: {
      up: 'images/on.png',
      down: 'images/off.png',
      select: 'images/shake.png',
      backgroundColor: 'black'
    },
    body: "Shake to toggle enabled!",
    toggleStatus: true
  });
  card.show();
  card.on('click', 'up', function() {
    hookRequest(urlUp);
    console.log('Up clicked!');
  });
  card.on('click', 'down', function() {
    hookRequest(urlDown);
    console.log('Down clicked!');
  });
  card.on('click', 'select', function() {
    console.log('Select clicked!');
    if (card.toggleStatus) {
      card.body("Shake to toggle disabled!");
      card.toggleStatus = false;
    } else {
      card.body("Shake to toggle enabled!");
      card.toggleStatus = true;
    }
  });
  card.on('click', 'back', function() {
    card.hide();
  });
  var toggle = 0;
  Accel.init();
  Accel.on('tap', function(e) {
    console.log('Tap event on axis: ' + e.axis + ' and direction: ' + e.direction);
    if (card.toggleStatus) {
      if (toggle === 0) {
        hookRequest(urlUp);
        toggle = 1;
      } else if (toggle === 1) {
        hookRequest(urlDown);
        toggle = 0;
      }
    }
  });
};

var menu = new UI.Menu({
  backgroundColor: 'white',
  textColor: 'black',
  highlightBackgroundColor: 'bulgarianRose',
  highlightTextColor: 'white',
  sections: [{
    title: 'HookPebble',
    items: [{
      title: 'First Device',
      subtitle: 'ON or OFF'
    }, {
      title: 'Second Device',
      subtitle: 'ON or OFF'
    }]
  }]
});

menu.show();

menu.on('select', function(e) {
  console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
  console.log('The item is titled "' + e.item.title + '"');
  controlCard(e.item, urlOn, urlOff);
});
// Prepare the accelerometer
var toggle = 0;

var urlOff = 'https://api.gethook.io/v1/device/trigger/dae116066f8f3641ed086c89c2621a02/Off/?token=389230d7ca6a6adf4c7baf2bb4c62042';
var urlOn = 'https://api.gethook.io/v1/device/trigger/dae116066f8f3641ed086c89c2621a02/On/?token=389230d7ca6a6adf4c7baf2bb4c62042';

var hookRequest = function(url) {
  ajax(
    {
      url: url,
    },
    function(data, status, request) {
      console.log('Request sent');
      console.log(data);
    },
    function(error, status, request) {
      console.log('No!!!');
    }
  );
}
