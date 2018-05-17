const PROVIDER_ENDPOINT       = "<PROVIDER_ENDPOINT>";
const pigpio                  = require('pigpio');
const socket                  = require('socket.io-client')(PROVIDER_ENDPOINT);
const DEVICE_INTERFACE        = require('../devices-interface').interface;
const ip                      = require('quick-local-ip');

const DOOR_BUTTON_PIN         = 23;
const LIGHTS_ENABLE_PIN       = 21;
const MAILBOX_DOWN_SWITCH     = 16;
const MAILBOX_UP_SWITCH       = 24;
const FLAG_PWM_PIN            = 15;
const FLAG_ENABLE_PIN         = 14;
const FLAG_DIR_PIN            = 18;
const MOTOR_MAX_DUTY_CYCLE    = 255;
const MOTOR_FREQUENCY         = 10;
const ENABLE_LEVEL            = 0;
const DISABLE_LEVEL           = 1;
const DIR_FORWARD             = 0;
const DIR_BACKWARD            = 1;
const OPTICAL_PIN             = 20;

var interval                  = 0;
var motorDirection            = 0;
var readingOptical            = false;
var allowChimeNotification    = true;
var shouldReadOptical         = true;

pigpio.configureSocketPort(8889);

const Gpio                    = pigpio.Gpio;

var motor                     = new Gpio(FLAG_PWM_PIN, {mode: Gpio.OUTPUT});
var flagDirection             = new Gpio(FLAG_DIR_PIN, {mode: Gpio.OUTPUT});
var flagEnable                = new Gpio(FLAG_ENABLE_PIN, {mode: Gpio.OUTPUT});
var lights                    = new Gpio(LIGHTS_ENABLE_PIN, {mode: Gpio.OUTPUT});
var runMotor                  = false;
var lastTicks                 = 0;
var totalLastTicks            = 0;
var flagUp                    = false;
var lightsOn                  = false;


socket.on('connect', function() {
  socket.emit(DEVICE_INTERFACE.COMMANDS.REGISTER, {key: DEVICE_INTERFACE.STATES.IP, value: ip.getLocalIP4(), deviceType: DEVICE_INTERFACE.DEVICES.MAILBOX});
  sendMailState();
});

socket.on(DEVICE_INTERFACE.DEVICES.MAILBOX, function(data) {

  if (data.length > 0) {
    console.log(data);
    switch(data[0].command) {
      case DEVICE_INTERFACE.SMART_HOME_COMMANDS.ON:
        var onSetting = data[0].params[DEVICE_INTERFACE.EXEC_COMMANDS.ON];
        toggleLights(onSetting);
        break;
      case DEVICE_INTERFACE.SMART_HOME_COMMANDS.TOGGLE:
        if (data[0].params[DEVICE_INTERFACE.EXEC_COMMANDS.TOGGLE]) {
          var outgoingMail = data[0].params[DEVICE_INTERFACE.EXEC_COMMANDS.TOGGLE]["outgoing mail"];
          if (outgoingMail == true) {
            setFlagUp();
          } else if (outgoingMail == false) {
            setFlagDown();
          }
        }
        break;
    }
  }
});

function sendMailState() {
  socket.emit(DEVICE_INTERFACE.COMMANDS.STATE, {deviceType: DEVICE_INTERFACE.IDS.MAILBOX, payload: {
    "on": lightsOn,
    "online": true,
    "currentToggleSettings": {
      "outgoing mail": flagUp
    }
  }})
}

flagEnable.digitalWrite(DISABLE_LEVEL)

function runMotor(dir) {
  flagDirection.digitalWrite(dir);
  for (var i = 0; i < 10; i++) {
    motor.trigger(100, 1);
  }
}

function toggleLights(on) {
  lights.digitalWrite(on ? 1 : 0);
}

var direction = 0;
var iteration = 0;
flagDirection.digitalWrite(motorDirection)

var lights = new Gpio(LIGHTS_ENABLE_PIN, {mode: Gpio.OUTPUT});

function runLights(dir) {
  lights.digitalWrite(dir);
}

var doorButton    = new Gpio(DOOR_BUTTON_PIN, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_DOWN,
  edge: Gpio.EITHER_EDGE
})

var optical = new Gpio(OPTICAL_PIN, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_DOWN,
  edge: Gpio.FALLING_EDGE
})

doorButton.on('interrupt', function (level) {
  console.log(level);
  if (!level) {
    setTimeout(function() {
      shouldReadOptical = true;
    }, 4000);

    if (shouldReadOptical) {
      console.log('run optical check')
      toggleLights(true);

      setTimeout(function() {
        toggleLights(false);
      }, 1500)
      
      setTimeout(function() {
        var opticalRead = optical.digitalRead();
        if (opticalRead && allowChimeNotification) {
          socket.emit(DEVICE_INTERFACE.COMMANDS.CHIME, {});
          setTimeout(function() {
            allowChimeNotification = true;
          }, 3000)
        }
      }, 1000);
      shouldReadOptical = false;
    }
  }
});

var mailboxUpSwitch    = new Gpio(MAILBOX_UP_SWITCH, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_DOWN,
  edge: Gpio.FALLING_EDGE
})

var mailboxDownSwitch    = new Gpio(MAILBOX_DOWN_SWITCH, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_DOWN,
  edge: Gpio.FALLING_EDGE
})


mailboxDownSwitch.on('interrupt', function (level) {
  flagUp = false;
  sendMailState();
  if (motorDirection == 1) {
    stopMotor();
  }
});

mailboxUpSwitch.on('interrupt', function (level) {
  flagUp = true;
  sendMailState();
  if (motorDirection == 0) {
    stopMotor();
  }
});

function setFlagUp() {
  flagUp = true;
  motorDirection = 0;
  flagDirection.digitalWrite(motorDirection) 
  startMotor()
  
}

function setFlagDown() {
  flagUp = false;
  motorDirection = 1;
  flagDirection.digitalWrite(motorDirection) 
  startMotor()
}

function stopMotor() {
  runMotor = false;
  setTimeout(function() {
    flagEnable.digitalWrite(DISABLE_LEVEL);
  }, 500)
}

flagEnable.digitalWrite(0)
dWrite = 0;
count = 0;

function step(timestamp) {
    motor.digitalWrite(dWrite)  
    dWrite = dWrite == 0 ? 1 : 0;

  if (runMotor) {
    setImmediate(step);
  } else if (!runMotor && lastTicks <= totalLastTicks) {
    lastTicks++;
    setImmediate(step);
  }
}

function startMotor() {
  totalLastTicks = motorDirection == 0 ? 3000 : 1800; 
  lastTicks = 0;
  runMotor = true;
  flagEnable.digitalWrite(ENABLE_LEVEL);
  setImmediate(step);
}

flagEnable.digitalWrite(DISABLE_LEVEL)