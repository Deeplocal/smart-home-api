exports.interface = {
  DEVICES: {
    PLANTER: "planter",
    MAILBOX: "mailbox"
  },
  IDS: {
    MAILBOX: "IO2018One",
    PLANTER: "IO2018Two"
  },
  
  EXEC_COMMANDS: {
    ON: 'on',
    OFF: 'off',
    SHOW_CAMERA: 'show_camera',
    FLAG_UP: 'flag_up',
    FLAG_DOWN: 'flag_down',
    BRIGHTNESS: 'brightness',
    TOGGLE: 'updateToggleSettings',
    WATER: 'water'
  },

  COMMANDS: {
    STATE: 'state',
    REGISTER: 'register',
    CHIME: 'chime'
  },

  STATES: {
    FLAG_UP: "FLAG_UP",
    IP: "ip"
  },

  SMART_HOME_COMMANDS: {
    BRIGHTNESS: "action.devices.commands.BrightnessAbsolute",
    TOGGLE: "action.devices.commands.SetToggles",
    ON: "action.devices.commands.OnOff",
    COLOR: "action.devices.commands.ColorAbsolute",
    START_STOP: "action.devices.commands.StartStop",
    ACTIVATE: "action.devices.commands.ActivateScene"
  }
}