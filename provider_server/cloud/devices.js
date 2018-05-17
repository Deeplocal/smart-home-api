exports.DEVICES = [
  {
    "id": "123",
    "type": "action.devices.types.LIGHT",
    "traits": [
      "action.devices.traits.Brightness",
      "action.devices.traits.StartStop",
      "action.devices.traits.OnOff",
      "action.devices.traits.Modes"
    ],
    "name": {
      "defaultNames": [
        "plant lights"
      ],
      "name": "planter",
      "nicknames": [
        "planter",
        "plant light",
        "plants"
      ]
    },
    "willReportState": true,
    "attributes": {
      "pausable": false,
      "availableModes": [
        {
          "name": "water",
          "ordered": false,
          "name_values": [
            {
              "name_synonym": [
                "sprinkle"
              ],
              "lang": "en"
            }
          ],
          "settings": [
            {
              "setting_name": "often",
              "setting_values": [{
                "setting_synonym": ["small", "half"],
                "lang": "en"
              }]
            },
            {
              "setting_name": "daily",
              "setting_values": [{
                "setting_synonym": ["small", "half"],
                "lang": "en"
              }]
            },
            {
              "setting_name": "never",
              "setting_values": [{
                "setting_synonym": ["never"],
                "lang": "en"
              }]
            }
          ]
        }
      ]
    },
    "deviceInfo": {
      "manufacturer": "Deeplocal",
      "model": "102",
      "hwVersion": "0.1",
      "swVersion": "0.1"
    }
  },
  {
    "id": "234",
    "type": "action.devices.types.DRYER",
    "traits": [
      "action.devices.traits.CameraStream",
      "action.devices.traits.Toggles",
      "action.devices.traits.OnOff",
      "action.devices.traits.Modes"
    ],
    "name": {
      "defaultNames": [
        "mailbox",
        "mail box",
        "mailbox flag"
      ],
      "name": "mailbox",
      "nicknames": [
        "my mailbox"
      ]
    },
    "willReportState": true,
    "attributes": {
      "availableToggles": [
        {
          "name": "cool",
          "name_values": [
            {
              "name_synonym": [
                "up", "raised"
              ],
              "lang": "en"
            }
          ]
        },
        {
          "name": "quiet",
          "name_values": [
            {
              "name_synonym": [
                "down", "lowered"
              ],
              "lang": "en"
            }
          ]
        }
      ],
      "availableModes": [
        {
          "name": "flag",
          "ordered": false,
          "name_values": [
            {
              "name_synonym": [
                "sending"
              ],
              "lang": "en"
            }
          ],
          "settings": [
            {
              "setting_name": "incoming",
              "setting_values": [{
                "setting_synonym": ["incoming", "down"],
                "lang": "en"
              }]
            },
            {
              "setting_name": "outgoing",
              "setting_values": [{
                "setting_synonym": ["outgoing", "up"],
                "lang": "en"
              }]
            }
          ]
        }
      ],
      "cameraStreamSupportedProtocols": [
        "hls"
      ],
      "cameraStreamNeedAuthToken": false,
      "cameraStreamNeedDrmEncryption": false
    },
    "deviceInfo": {
      "manufacturer": "Deeplocal",
      "model": "101",
      "hwVersion": "0.1",
      "swVersion": "0.1"
    }
  }
]