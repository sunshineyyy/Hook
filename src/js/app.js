var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var Accel = require('ui/accel');
var Settings = require('settings');

var newDevice = {};

var mainMenu = function() {
  var menuItems = [];
  var devices = Settings.data('devices') || [];
  for (var i = 0; i < devices.length; i++) {
    if (devices[i]['device_name']) {
      menuItems.push({
        title: devices[i]['device_name'],
        urlOn: devices[i]['on_url'],
        urlOff: devices[i]['off_url']
      });
    }
  }
  menuItems.push({
    title: "Settings"
  });

  var menu = new UI.Menu({
    backgroundColor: 'white',
    textColor: 'black',
    highlightBackgroundColor: 'bulgarianRose',
    highlightTextColor: 'white',
    sections: [{
      title: 'HookPebble',
      items: menuItems,
    }]
  });

  menu.show();

  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
    if (e.item.title === "Settings") {
      appSettings();
    } else {
      controlCard(e.item);
    }
  });
  return menu;
};

var mainPage = mainMenu();

Settings.config(
  { url: 'http://www.yaoyuyang.com/hook/config/' },
  // open
  function(e) {
    console.log('opening configurable');
  },
  // close
  function(e) {
    console.log('closed configurable');
    // Show the parsed response
    console.log(JSON.stringify(e.options));
    newDevice = e.options;
    var devices = Settings.data('devices') || [];
    // Each device name has to be unique, if receive new options, it will overide the old options['devices'] that has the same name;
    var duplicate = false;
    for (var i = 0; i < devices.length; i++) {
      if (devices[i]['device_name'] === newDevice['device_name']) {
        devices[i] = newDevice;
        duplicate = true;
        console.log("Reached here for checking duplicates.");
      }
    }
    if (!duplicate) {
      devices.push(newDevice);
    }
    Settings.data('devices', devices);
    console.log(JSON.stringify(Settings.data()));
    var newPage = mainMenu();
    mainPage.hide();
    mainPage = newPage;
  }
);

var controlCard = function(item) {
  var card = new UI.Card({
    title: item.title,
    action: {
      up: 'images/on.png',
      down: 'images/off.png',
      select: 'images/shake.png',
      backgroundColor: 'black'
    },
    body: "Press UP or DOWN to switch your Hook device"
  });
  var toggleEnabled = true;
  card.show();
  card.on('click', 'up', function() {
    hookRequest(item.urlOn);
    console.log('Up clicked!');
  });
  card.on('click', 'down', function() {
    hookRequest(item.urlOff);
    console.log('Down clicked!');
  });
  card.on('click', 'back', function() {
    card.hide();
    toggleEnabled = false;
  });
  card.on('click', 'select', function() {
    console.log('Select clicked!');
    if (toggleEnabled) {
      card.body("Shake to toggle disabled!");
      toggleEnabled = false;
    } else {
      card.body("Shake to toggle enabled!");
      toggleEnabled = true;
    }
  });
  // var toggle = 0;
  // Accel.init();
  // Accel.on('tap', function(e) {
  //   console.log('toggleEnabled ' + toggleEnabled + 'Tap event on axis: ' + e.axis + ' and direction: ' + e.direction);
  //   if (toggleEnabled) {
  //     if (toggle === 0) {
  //       hookRequest(item.urlOn);
  //       toggle = 1;
  //     } else if (toggle === 1) {
  //       hookRequest(item.urlOff);
  //       toggle = 0;
  //     }
  //   }
  // });
};

var appSettings = function() {
  var settingItems = [];
  settingItems.push({
    title: "Clear Devices",
    subtitle: "Clear all devices!"
  });
  settingItems.push({
    title: "About"
  });
  settingItems.push({
    title: "Version"
  });
  var settingPage = new UI.Menu({
    sections: [{ title: "Settings", items: settingItems }],
  });
  settingPage.show();
  settingPage.on('select', function(e) {
    if (e.item.title === "Clear Devices") {
      clearDevices();
    }
    if (e.item.title === "About") {
      // implement about page
    }
    if (e.item.title === "Version") {
      // implement version page;
    }
  });
};

var clearDevices = function() {
  var card = new UI.Card({
    title: "Clear Devices",
    action: {
      up: 'images/on.png',
      down: 'images/off.png',
      backgroundColor: 'black'
    },
    body: "Are you sure you want to clear all devices? Noting this is irreversible.",
    toggleStatus: true
  });
  card.show();
  card.on('click', 'up', function() {
    Settings.data('devices', []);
    console.log('Devices cleared!');
    var newPage = mainMenu();
    mainPage.hide();
    mainPage = newPage;
  });
  card.on('click', 'down', function() {
    card.hide();
  });
};
// var urlOff = 'https://api.gethook.io/v1/device/trigger/dae116066f8f3641ed086c89c2621a02/Off/?token=389230d7ca6a6adf4c7baf2bb4c62042';
// var urlOn = 'https://api.gethook.io/v1/device/trigger/dae116066f8f3641ed086c89c2621a02/On/?token=389230d7ca6a6adf4c7baf2bb4c62042';

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
};
