const PROVIDER_ENDPOINT = "<PROVIDER_ENDPOINT>";
const socket            = require('socket.io-client')(PROVIDER_ENDPOINT);
const ip                = require('quick-local-ip');
const pigpio            = require('pigpio');
const DEVICE_INTERFACE  = require('../devices-interface').interface;
const exec              = require('child_process').exec;

const WATERING_TIMEOUT  = 5000;
const LIGHTS_1_PIN      = 23;
const LIGHTS_2_PIN      = 15;
const LIGHTS_3_PIN      = 18;
const VALVE_PIN         = 14;
const ENABLE_LEVEL      = 1;
const DISABLE_LEVEL     = 0;

pigpio.configureSocketPort(8889);

const Gpio              = pigpio.Gpio;
var valve               = new Gpio(VALVE_PIN, {mode: Gpio.OUTPUT});
var highLight           = new Gpio(LIGHTS_1_PIN, {mode: Gpio.OUTPUT});
var mediumLight         = new Gpio(LIGHTS_2_PIN, {mode: Gpio.OUTPUT});
var lowLight            = new Gpio(LIGHTS_3_PIN, {mode: Gpio.OUTPUT});
var lights              = [lowLight, mediumLight, highLight];
var timeouts            = [];

socket.on('connect', function() {
  socket.emit(DEVICE_INTERFACE.COMMANDS.REGISTER, {key: DEVICE_INTERFACE.STATES.IP, value: ip.getLocalIP4(), deviceType: DEVICE_INTERFACE.DEVICES.PLANTER});
});

socket.on(DEVICE_INTERFACE.DEVICES.PLANTER, function(data) {

  if (data.length > 0) {
    switch(data[0].command) {
      case DEVICE_INTERFACE.SMART_HOME_COMMANDS.ACTIVATE:
        if (data[0].params.deactivate == false) {
          daylight();
          playMusic();
          startWatering();
        } else if (data[0].params.deactivate == true) {
          stopWaterFlow();
          try {
            exec("sudo pkill omx", function() {})
          } catch (e) {
            console.log('could not kill music process');
          }
        }
        break;
      case DEVICE_INTERFACE.SMART_HOME_COMMANDS.COLOR:
        if (data[0].params.color) {
          var colorName = data[0].params.color.name;
          if (colorName == "sunset") {
            sunset();
          } else if (colorName == "daylight") {
            daylight();
          }
        }
        break;
      case DEVICE_INTERFACE.SMART_HOME_COMMANDS.START_STOP:
        var startStop = data[0].params.start;
        if (startStop == true) {
          startWatering();
        } else {
          stopWaterFlow();
        }
        break;
      case DEVICE_INTERFACE.SMART_HOME_COMMANDS.BRIGHTNESS:
        var brightness = data[0].params[DEVICE_INTERFACE.EXEC_COMMANDS.BRIGHTNESS];
        var numLights = 0;
        if (brightness > 66) {
          numLights = 3;
        } else if (brightness > 33) {
          numLights = 2;
        } else if (brightness > 0) {
          numLights = 1;
        }

        for (var i = 0; i < lights.length; i++) {
          console.log((numLights >= (i + 1) ? ENABLE_LEVEL : DISABLE_LEVEL))
          lights[i].digitalWrite((numLights >= (i + 1) ? ENABLE_LEVEL : DISABLE_LEVEL));
        }
        break;
    }
  }  
});

function playMusic() {
  exec('omxplayer -o local io_smart_home_mozart.mp3', function() {});
}

function sunset() {
  lights[0].digitalWrite(ENABLE_LEVEL);
  lights[1].digitalWrite(DISABLE_LEVEL);
  lights[2].digitalWrite(DISABLE_LEVEL);
}

function daylight() {
  lights[0].digitalWrite(ENABLE_LEVEL);
  lights[1].digitalWrite(ENABLE_LEVEL);
  lights[2].digitalWrite(ENABLE_LEVEL);
}

function sendPlanterState() {
  socket.emit(DEVICE_INTERFACE.COMMANDS.STATE, {deviceType: DEVICE_INTERFACE.IDS.PLANTER, payload: {
    "on": lightsOn,
    "online": true
  }})
}

function startWatering() {
  valve.digitalWrite(ENABLE_LEVEL);
  timeouts.push(setTimeout(function() {
    stopWaterFlow()
  }, WATERING_TIMEOUT));
}

function stopWaterFlow() {
  valve.digitalWrite(DISABLE_LEVEL);
}

function clearTimeouts() {
  var timeoutsNum = timeouts.length;
  for (var i = 0; i < timeoutsNum; i++) {
    clearTimeout(timeouts.shift());
  }
}