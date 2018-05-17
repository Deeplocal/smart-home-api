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

const admin = require("firebase-admin");
const fetch = require('node-fetch');
const config = require('./cloud/config-provider');
const datastore = require('./cloud/datastore');
const authProvider = require('./cloud/auth-provider');
const DEVICES = require('./cloud/devices').DEVICES;

const serviceAccount = require(config.firebaseServiceAccountJSONLocation);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.smartHomeFirebaseURL
});

var db = admin.database();
var userRef = db.ref('/users');
userRef.on("child_changed", function(snapshot) {
  console.log(snapshot.val());
});

function registerAgent(app) {
  console.log('smart-home-app registerAgent');

  app.post('/smarthome', function (request, response) {
    console.log('*************post /smarthome', request.headers);
    let reqdata = request.body;
    console.log(reqdata);

    let authToken = authProvider.getAccessToken(request);
    let uid = datastore.Auth.tokens[authToken].uid;

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
            uid: uid,
            auth: authToken,
            requestId: reqdata.requestId
          }, response);
          break;
        case "action.devices.QUERY":
          console.log('post /smarthome QUERY');

          query({
            uid: uid,
            auth: authToken,
            requestId: reqdata.requestId,
            devices: reqdata.inputs[0].payload.devices
          }, response);

          break;
        case "action.devices.EXECUTE":
          console.log('post /smarthome EXECUTE');
         
          exec({
            uid: uid,
            auth: authToken,
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

  app.options('/smarthome', function (request, response) {
    response.status(200).set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }).send('null');
  });

  function sync(data, response) {

    var deviceProps = {
      requestId: data.requestId,
      payload: {
        agentUserId: data.uid,
        devices: DEVICES
      }
    };

    response.status(200).json(deviceProps);
    return deviceProps;
  }

  function query(data, response) {
    console.log('query', JSON.stringify(data));
    let deviceIds = getDeviceIds(data.devices);

    let devices = app.smartHomeQueryStates(data.uid, deviceIds);
    if (!devices) {
      response.status(500).set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }).json({error: "failed"});
      return;
    }
    let deviceStates = {
      requestId: data.requestId,
      payload: {
        devices: devices
      }
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
    let respCommands = [];
    for (let i = 0; i < data.commands.length; i++) {
      let curCommand = data.commands[i];
      for (let j = 0; j < curCommand.execution.length; j++) {
        let curExec = curCommand.execution[j];
        let devices = curCommand.devices;
        for (let k = 0; k < devices.length; k++) {
          let executionResponse = execDevice(data.uid, curExec, devices[k]);
          console.log("Device exec response", JSON.stringify(executionResponse));
          respCommands.push({
            ids: [devices[k].id],
            status: executionResponse.status,
            errorCode: executionResponse.errorCode ? executionResponse.errorCode : undefined
          });
        }
      }
    }
    let resBody = {
      requestId: data.requestId,
      payload: {
        commands: respCommands
      }
    };
    console.log('exec response', JSON.stringify(resBody));
    response.status(200).json(resBody);
    return resBody;
  }

  registerAgent.exec = exec;

  function execDevice(uid, command, device) {
    return {status: "SUCCESS"};
  }
}

exports.registerAgent = registerAgent;
