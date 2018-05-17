// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const fetch = require('node-fetch');
const config = require('./cloud/config-provider');
const datastore = require('./cloud/datastore');
const authProvider = require('./cloud/auth-provider');
const DEVICE_INTERFACE = require('./devices-interface').interface;
const DEVICES = require('./cloud/devices').DEVICES;

function registerAgent(app, socket, deviceStore) {
  console.log('smart-home-app registerAgent');

  app.post('/smarthome', function (request, response) {
    console.log('post /smarthome', request.headers);
    let reqdata = request.body;
    console.log('post /smarthome', reqdata);

    if (!reqdata.inputs) {
      response.status(401).set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }).json({error: "missing inputs"});
    }
    for (let i = 0; i < reqdata.inputs.length; i++) {
      let input = reqdata.inputs[i];
      let intent = input.intent;
      if (!intent) {
        response.status(401).set({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }).json({error: "missing inputs"});
        continue;
      }
      switch (intent) {
        case "action.devices.SYNC":
          console.log('post /smarthome SYNC');

          sync({
            uid: "98709sad0f9j09a",
            auth: "0s9dj0f9jsd0f9jsdf",
            requestId: reqdata.requestId
          }, response);
          break;
        case "action.devices.QUERY":
          console.log('post /smarthome QUERY');
         
          query({
            uid: "98709sad0f9j09a",
            auth: "0s9dj0f9jsd0f9jsdf",
            requestId: reqdata.requestId,
            devices: reqdata.inputs[0].payload.devices
          }, response);

          break;
        case "action.devices.EXECUTE":
          console.log('post /smarthome EXECUTE');
          
          exec({
            uid: "98709sad0f9j09a",
            auth: "0s9dj0f9jsd0f9jsdf",
            requestId: reqdata.requestId,
            commands: reqdata.inputs[0].payload.commands
          }, response);

          break;
        default:
          response.status(401).set({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }).json({error: "missing intent"});
          break;
      }
    }
  });
  /**
   * Enables prelight (OPTIONS) requests made cross-domain.
   */
  app.options('/smarthome', function (request, response) {
    response.status(200).set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }).send('null');
  });

  function sync(data, response) {
    console.log('sync', JSON.stringify(data));
    let devices = app.smartHomePropertiesSync(data.uid);
    if (!devices) {
      response.status(500).set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }).json({error: "failed"});
      return;
    }
    let deviceList = [];
    Object.keys(devices).forEach(function (key) {
      if (devices.hasOwnProperty(key) && devices[key]) {
        console.log("Getting device information for id '" + key + "'");
        let device = devices[key];
        device.id = key;
        deviceList.push(device);
      }
    });
    let deviceProps = {
      requestId: data.requestId,
      payload: {
        agentUserId: data.uid,
        devices: DEVICES
      }
    };
    console.log('sync response', JSON.stringify(deviceProps));
    response.status(200).json(deviceProps);
    return deviceProps;
  }

  function query(data, response) {
    console.log('query', JSON.stringify(data));
    var id = "IO2018One";
    var payload = { devices: {}};

    for (var i = 0; i < data.devices.length; i++) {
      if (deviceStore[data.devices[i].id]) {
        payload.devices[data.devices[i].id] = deviceStore[data.devices[i].id];
      }
    }

    let deviceStates = {
      requestId: data.requestId,
      payload: payload
    };
    console.log('query response', JSON.stringify(deviceStates));
    response.status(200).json(deviceStates);
    return deviceStates;
  }

  
  function getDeviceIds(devices) {
    let deviceIds = [];
    for (let i = 0; i < devices.length; i++) {
      if (devices[i] && devices[i].id)
        deviceIds.push(devices[i].id);
    }
    return deviceIds;
  }

  function exec(data, response) {
    console.log('exec', JSON.stringify(data));
    console.log(data.commands)
    var id = "IO2018One";
    for (var i = 0; i < data.commands.length; i++) {
      for (var j = 0; j < data.commands[i].devices.length; j++) {
        id = data.commands[i].devices[j].id;
        handleExecEmission(data.commands[i].devices[j].id, data.commands[i].execution);
      }
    }

    var receiverAppId = (id == "IO2018Two" ? "F4DD0329" : "A87C333C");
    
    let resBody = {
      requestId: data.requestId,
      payload: {
        commands: [
          {
            "ids": [id],
            "status": "SUCCESS",
            "states": {
              "cameraStreamAccessUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4",
              "cameraStreamReceiverAppId": receiverAppId
            }
          }
        ]
      }
    };
    response.status(200).json(resBody);
    return resBody;
  }

  registerAgent.exec = exec;

  function handleExecEmission(id, executions) {
    for (var i = 0; i < executions.length; i++) {
      if (id == "IO2018Two" || id == "IO2018Three" || id == "IO2018Four") {
        socket.emit(DEVICE_INTERFACE.DEVICES.PLANTER, executions)
      } else if (id == "IO2018One") {
        socket.emit(DEVICE_INTERFACE.DEVICES.MAILBOX, executions)
      }
    }
  }

  function execDevice(uid, command, device) {
    let curDevice = {
      id: device.id,
      states: {}
    };
    Object.keys(command.params).forEach(function (key) {
      if (command.params.hasOwnProperty(key)) {
        curDevice.states[key] = command.params[key];
      }
    });
    let payLoadDevice = {
      ids: [curDevice.id],
      status: "SUCCESS",
      states: {}
    };
    let execDevice = app.smartHomeExec(uid, curDevice);
    console.info("execDevice", JSON.stringify(execDevice[device.id]));
    // Check whether the device exists or whether it exists and it is disconnected.
    if (!execDevice || !execDevice[device.id].states.online) {
      console.warn("The device you want to control is offline");
      return {status: "ERROR", errorCode: "deviceOffline"};
    }
    let deviceCommand = {
      type: 'change',
      state: {}
    };

    deviceCommand.state[curDevice.id] = execDevice[curDevice.id].states;
    app.changeState(deviceCommand);

    execDevice = execDevice[curDevice.id];

    payLoadDevice.states = execDevice.states;

    Object.keys(command.params).forEach(function (key) {
      if (command.params.hasOwnProperty(key)) {
        if (payLoadDevice.states[key] != command.params[key]) {
          return {status: "ERROR", errorCode: "notSupported"};
        }
      }
    });
    return {status: "SUCCESS"};
  }
}

exports.registerAgent = registerAgent;
