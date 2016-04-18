var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var Accel = require('ui/accel');

var main = new UI.Card({
  title: 'HookPebble',
  icon: 'images/menu_icon.png',
  body: 'Welcome to Hook for Pebble!',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});
// Prepare the accelerometer
var toggle = 0;
Accel.init();
Accel.on('tap', function(e) {
  console.log('Tap event on axis: ' + e.axis + ' and direction: ' + e.direction);
  if (toggle === 0) {
    turnON();
    toggle = 1;
  } else if (toggle === 1) {
    turnOFF();
    toggle = 0;
  }
});

var turnOFF = function() {
  ajax(
    {
      url: 'https://api.gethook.io/v1/device/trigger/dae116066f8f3641ed086c89c2621a02/Off/?token=389230d7ca6a6adf4c7baf2bb4c62042',
    },
    function(data, status, request) {
      console.log('Turned OFF');
      console.log(data);
    },
    function(error, status, request) {
      console.log('No!!!');
    }
  );
}

var turnON = function() {
  ajax(
    {
      url: 'https://api.gethook.io/v1/device/trigger/dae116066f8f3641ed086c89c2621a02/On/?token=389230d7ca6a6adf4c7baf2bb4c62042',
    },
    function(data, status, request) {
      console.log('Turned ON');
      console.log(data);
    },
    function(error, status, request) {
      console.log('No!!!');
    }
  );
}

main.show();
