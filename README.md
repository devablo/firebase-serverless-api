# Getting Started

# Firebase CLI & Running

## Firebase CLI Auth

```sh
npm install -g firebase-tools

npm install firebase-functions@latest firebase-admin@latest --save

firebase login

```

# Local Function Emulator

## Running / Debugging Functions

See https://medium.com/@mwebler/debugging-firebase-functions-with-vs-code-3afab528bb36

Setup a local Service Key for Google Cloud. Create Service Key in json.

https://console.cloud.google.com/iam-admin/serviceaccounts?authuser=1&project=reference-api-poc

Further Docs: https://firebase.google.com/docs/functions/local-emulator

## Set Local Firebase Config

> Set for MacOS

``` sh
GOOGLE_APPLICATION_CREDENTIALS="reference-api-poc-4ba30a3b68ce.json"

FIREBASE_CONFIG="{\"databaseURL\":\"https://reference-api-poc.firebaseio.com\",\"storageBucket\":\"reference-api-poc.appspot.com\",
\"apiKey\":\"AIzaSyAbwpR64ecoQuHOqPq50mxj_8kcx4QyF9M\",\"projectId\":\"reference-api-poc\"}"
```

Deleting functions from different project in emulator
functions delete getStationByName --projectId devablo-197710

## Debugging with Functions Emulator

1. Run firebase function emulator with the node inspector
functions inspect stations

2. Run vscode debugger 'Debug Function'

3. Set break points

4. Hit the local HTTP functions

## Deploying local function for emulator
functions deploy stations --trigger-http

Removing Debugger from function
functions reset stations

# Running Functions

``` sh
firebase serve --only functions
```

#  Deployment

``` sh
firebase deploy --only functions
```

# APIs
| URL               | HTTP ACTION       | INFO      |
| ---               | :---:             | ---               |
| [/health]         | GET               | Sample Health Check  |
| [/createStation]  | POST              | Creates a Station  |
| [/stations]       | GET               | List of Stations  |
| [/stationSearch]       | GET               | Get Station by params (code or id)  |

[/health]: https://us-central1-reference-api-poc.cloudfunctions.net/health
[/stations]: https://us-central1-reference-api-poc.cloudfunctions.net/stations
[/createStation]: https://us-central1-reference-api-poc.cloudfunctions.net/createStation
[/stationSearch]: https://us-central1-reference-api-poc.cloudfunctions.net/stationSearch
