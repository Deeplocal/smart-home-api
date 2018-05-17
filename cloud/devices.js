exports.DEVICES = [{
  "id": "IO2018One",
  "type": "action.devices.types.MAILBOX",
  "traits": ["action.devices.traits.OnOff", "action.devices.traits.CameraStream", "action.devices.traits.Toggles", "action.devices.traits.ObjectDetection"],
  "name": {
    "name": "Mailbox",
    "defaultNames": ["mailbox light", "mail been"]
  },
  "willReportState": true,
  "attributes": {
    "cameraStreamSupportedProtocols": ["progressive_mp4"],
    "cameraStreamNeedAuthToken": false,
    "cameraStreamNeedDrmEncryption": false,
    "availableToggles": [{
      "name": "outgoing mail",
      "name_values": [{
        "name_synonym": ["outgoing mail"],
        "lang": "en"
      }]
    }]
  }
}, {
  "id": "IO2018Two",
  "type": "action.devices.types.LIGHT",
  "traits": ["action.devices.traits.OnOff", "action.devices.traits.Brightness", "action.devices.traits.ColorSpectrum", "action.devices.traits.ColorTemperature", "action.devices.traits.CameraStream", "action.devices.traits.ObjectDetection"],
  "name": {
    "name": "Planter",
    "defaultNames": ["garden", "my garden"]
  },
  "willReportState": true,
  "attributes": {
    "temperatureMinK": 2000,
    "temperatureMaxK": 6500
  }
}, {
  "id": "IO2018Three",
  "type": "action.devices.types.SCENE",
  "traits": ["action.devices.traits.Scene"],
  "name": {
    "name": "Nurture"
  },
  "willReportState": true,
  "attributes": {
    "sceneReversible": true
  }
}, {
  "id": "IO2018Four",
  "type": "action.devices.types.SPRINKLER",
  "traits": ["action.devices.traits.StartStop"],
  "name": {
    "name": "Mist"
  },
  "willReportState": true,
  "attributes": {
    "pausable": true
  }
}]