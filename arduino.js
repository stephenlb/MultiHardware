
/*
 *  PubNub EON Demo with Arduino
 *  Displaying the data sent by Arduino with DS18B20 temperature sensor using Johnny-Five
 *  https://github.com/pubnub/johnnyfive-eon
 *
 *  Tomomi Imura @girlie_mac
 *  License: MIT
 */


// Init PubNub - Please use your own keys. Get them from https://admin.pubnub.com
var pubnub = require('pubnub')({
  subscribe_key: 'sub-c-2a73818c-d2d3-11e3-9244-02ee2ddab7fe',
  publish_key:   'pub-c-6dbe7bfd-6408-430a-add4-85cdfe856b47',
});

var channel = 'Arduino-node';

var temp = 0;

function publish() {
  var data = {
    'temperature': temp,
    'username': 'Arduino'
  };
  pubnub.publish({
    channel: channel,
    message: data,
  });
}

// Johnny-Five
// Using a temperature sensor, type DS18B20
// This requires OneWire support using the ConfigurableFirmata

var five = require('johnny-five');

five.Board().on('ready', function() {
  var temperature = new five.Thermometer({
    controller: 'DS18B20',
    pin: 2
  });

  temperature.on('data', function() {
    console.log(this.celsius + '°C', this.fahrenheit + '°F');
    //console.log('Address: 0x' + this.address.toString(16));
    temp = this.celsius;
  });

  setInterval(publish, 3000);
});
