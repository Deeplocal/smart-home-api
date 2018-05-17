# Google Smart Home API: Planter and Mailbox

**Disclaimer:** THESE INSTRUCTIONS ARE BEING PROVIDED FOR INFORMATIONAL PURPOSES ONLY AND ARE NOT INTENDED TO BE USED FOR THE PRODUCTION OF COMMERCIAL PRODUCTS.  BY EXECUTING THESE INSTRUCTIONS, YOU AGREE TO ASSUME ALL LIABILITY IN CONNECTION WITH YOUR BUILDING AND USE OF ANY DEVICE. DEEPLOCAL DISCLAIMS ALL WARRANTIES EXPRESS OR IMPLIED WITH RESPECT TO THESE INSTRUCTIONS AND ANY RESULTING DEVICE INCLUDING BUT NOT LIMITED TO WARRANTIES FOR MERCHANTABILITY, FITNESS FOR ANY PARTICULAR PURPOSE, AND NON-INFRINGEMENT.  YOU SHOULD USE EXTREME CAUTION WHEN BUILDING AND USING ANY DEVICE PURSUANT TO THESE INSTRUCTIONS.  IN NO EVENT SHALL DEEPLOCAL BE LIABLE FOR ANY CLAIM OR DAMAGES, INCLUDING BUT NOT LIMITED TO CLAIMS OR DAMAGES RELATED TO DEATH OR PERSONAL INJURY, PROPERTY DAMAGE, OR PRODUCT LIABILITY.

### Tools Required
* Soldering Iron + Solder
* Wire Strippers
* Screwdriver Set
* Wrench Set
* Drill


### Warnings
This project involves high-voltage wiring (mains 110V). Take appropriate safety precautions when working with mains voltage, and ensure that everything is unplugged before touching electrical connections.
This project also involves moderately pressurized water.  Use appropriate sealing strategies on all joints, and always leak-test before installing.
Most importantly - water and electricity can be dangerous in combination. Plan your electrical layout so there is no possibility of leaking water coming in contact with electrical connections. We suggest a basic layout strategy in the instructions, but use care and common sense to keep yourself safe.


### Step 1 - Water System
Assemble the misting system according to the following diagram.

[ diagram of water plumbing ]

Cut a length of the large hose to use as an inlet line, from the water bucket to the intake side of the pump. This side is not pressurized, but feel free to use a hose clamp if desired.

[ picture of bucket to pump ]

Cut a 6” length of the large hose, and insert the barbed fitting into one end. Slip the other end onto the output side of the pump. Everything from here onwards will be under high pressure, so secure both joints with hose clamps.

[ picture of short hose length]

Install a push-connect tube fitting into the female threaded end of the barb fitting. Use teflon tape to form a good seal, and tighten with wrenches.

[ close-up of hose to tubing joint ]

Cut a short length of the plastic tubing. Push one end into the push-connect fitting. Push the other end into the inlet end of the manual shut-off valve. Give each connection a tug to make sure everything is seated well.

[ close-up of tube from hose joint to shut-off valve ]

Cut another length of tubing, and run it from the manual shut-off valve to the inlet of the water filter.

[ picture of tubing from shut-off valve to water filter ]

Cut a length of tubing to run from the water filter to the electric valve. The inlet side of the electric valve is labelled “2”.

[ picture of tubing from filter to electric valve ] 

Install three push-connect fittings into the brass Tee junction and tighten with wrenches to ensure a good seal.

[ picture of tee junction with fittings installed ]

Run a short length of tubing from the output of the electric valve (labelled “1”) to the tee junction.

[ picture of tubing from valve to tee ]

Install one push-connect fitting and one thread reducer into a brass elbow junction. Tighten with wrenches to ensure a good seal. Repeat with both elbow junctions.

[ picture of two elbow junctions ]

Thread a mister nozzle into each elbow assembly.

[ picture of mister nozzle in elbow assembly ] 

Cut two lengths of tubing, to run from the Tee junction to each nozzle/elbow assembly.

[ picture of tubing to misters ] 


### Step 2: Priming the Pump

Fill the water bucket and drop the inlet hose down to the bottom of the bucket.

Temporarily remove the tubing where it goes into the electric valve, and place this end into a jar to collect water during the priming process.

Open the manual shut-off valve.

Plug in the water pump. Water will gush out into the jar in an uneven stream, with bubbles.

Wait for the bubbles to turn into a continuous, solid stream of water. This should take only a few seconds. Once the stream looks good, close the manual shut-off valve.

With the manual shut-off valve closed, the pump should get to pressure and turn off within a few seconds. If the pump does not turn off, check for air or water leaks at the intake or outlet connections.

Now that the system is primed and stable, it is a good time to check for leaks. Dry off any spilled water, and then wait for a few minutes. If any water appears, check the nearest seal.

Now, re-attach the tubing to the electric valve. Open the manual shut-off valve and check for leaks again.

At this point, the pump is primed. We recommend leak testing the downstream seals and the mister nozzles. To do so, close the manual shut-off valve, bypass the electric valve, and re-open the manual shut-off valve to supply pressure to the downstream system.

Seal any leaks and test again.


### Step 3 -  Electrical Wiring
Note - we mounted all the electronics in the top of our planter to keep them high and dry in case of water leaks. 

Solder up the relay kits to make 4 complete boards.

[ picture - 4x assembled relays]

Flash the SD card with Raspbian, and put it in the Raspberry Pi. https://www.raspberrypi.org/downloads/noobs/ 

[ close-up of SD card in Pi ]

Assemble the plastic case on the Pi.

[ picture of Pi in CanaKit case ]

Mount the Pi and relays. We mounted ours onto the inside of our plywood box, but any location is suitable. 

[ picture of mounted Pi and relays ]

Use the 22AWG wire to connect the Pi’s GPIO pins to the relays according to the following wiring diagram.

[ wiring diagram - LV side ]

Test-fit the light bulb sockets in the desired locations.

[ close-up of sockets ] 

Cut the extension cord in half. Separate the two conductors at the end, and strip the insulation back ⅛”.

[ close-up of stripped extension cord ] 

Use the extension cord, terminal strips, and 16AWG wire to connect three of the relays to the light bulb sockets, according to the following wiring diagram:

[ wiring diagram - HV side ] 

Use more 16AWG wire to connect the electric valve to the fourth relay, according to the diagram. Carefully seal any electrical connections that may come in contact with water in case of a leak.

[ wiring diagram - HV side ] 

Finally, install the USB speakers and plug into the Raspberry Pi.

[ picture of speakers, USB and headphone jack connections ] 


### Step 4 - Planter Case
We built our planter case from two plywood boxes and a welded frame. Design files are attached for these boxes, but feel free to build or design your own.

[ picture - CAD ]
[ link to attached files ] 

Our lower box holds the pump, filter, and valve. It also cradles the three plastic bins.

[ picture - lower box w/ internals ]

We ran our wire cabling through the rear two vertical tubes, and our water piping through the front tubes. The nozzles are mounted in welded fittings on the front tubes.

[ close-up of nozzles mounted in frame ]

Our upper box holds the lights, relays, speakers, and Raspberry Pi.

[ close-up of upper box internals ] 

### Smart Home Programming Overview: How do we control a mailbox and planter Assistant Services and the Home Graph API?
* A user adds our custom Smart Home app to their list of Home Control apps in the Google Home app.
* The user makes a request to a Google Assistant powered device like "Set my planter brightness to 85%".
* The Home Graph API notifies the Provider Service that a request has been made for planter brightness to be 85%.
* The Provider Service finds the users planter device (running on a raspberry pi) and sends it an appropriate websocket request.
* The raspberry pi running the planter set the correct GPIOs to on, triggering the relays that run the lights.


### Step 5: Create an Actions on Google Developer Project
  1. In the [Actions Console](https://console.actions.google.com/u/0/), click Add/Import project
  2. Enter a name for the project and click Create Project
  3. Choose Home Control as your project type
  4. Choose Smart Home as the control experience
  5. Save the project ID in the dashboard for later use
  6. On the left hand side under SETUP, click Invocation
  7. Add your app's name. Click Save.
  8. On the left navigation menu under DEPLOY, click on Directory Information
  9. Add your app info and click Save

  
### Step 6: Tell Google where it should forward provider requests (SYNC, QUERY, EXEC)
  1. Navigate to the [Google Cloud Console API Manager](https://console.developers.google.com/apis)
  2. Enable the [Home Graph API](https://console.cloud.google.com/apis/api/homegraph.googleapis.com/overview)
  3. On your project dashboard, navigate to Credentials
  4. Copy the 'Key' column value for the 'Api Key' entry
  5. Paste that key into the cloud/config-provider.js as the 'Config.smartHomeProviderApiKey' value
  6. In cloud/config-provider.js, replace the existing values for 'smartHomeProviderGoogleClientId' and 'smartHomeProvideGoogleClientSecret' with your own unique values
  7. On your project dashboard, under Build --> Actions, click on the actions.devices action and enter your fulfillment url. This will be {the endpoint where you're hosting the project}/smarthome (e.g. https://smarthome-exampleproject.appspot.com/smarthome).
  8. Under Advanced Options --> Account Linking, select Oauth/Authorization Code as the linking type and enter your client information (i.e. the values you entered for 'smartHomeProviderGoogleClientId' and 'smartHomeProvideGoogleClientSecret')
  9. Click Save
  10. Navigate to 'Actions' and click 'Test'

### Step 7: Run the server on a public domain
  1. If you are using Google App Engine, simply run 'gcloud app deploy' under the correct gcloud project
  2. If you are using a server hosted elsewhere, install dependencies by running:
  ```
  npm install
  npm start
  ```
  
### Step 8: Link your devices by responding to a SYNC request
  1. Make sure you're using a device logged in under the same account as the Google Developer Project
  2. In the Google Home app, in the menu, click Home Control
  3. Click the (+) button and add your [test] app
  4. The provider server should receive a SYNC request and respond with all of the devices in the cloud/devices.js file

### Step 9: Configure the mailbox and planter to point at your provider server
  1. Install an SD card with a Raspian-stretch lite image and clone the smart-home project in the pi user's home directory
  2. Substitute your provider server endpoint for the value PROVIDER_ENDPOINT in mailbox/app.js and planter/app.js
  3. Run npm install and node app.js from with the mailbox and planter directories

### Step 10: Run a test
  1. In the actions console simulator or any Assistant powered device, run the query "turn on my planter lights"
  2. The provider server should get an EXEC request for action.devices.traits.Brightness and the lights should turn on
