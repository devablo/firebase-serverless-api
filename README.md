# Getting Started

This is a sample repository for creating and retrieving data for a full serverless API using Cloud Functions. Express is used for routing for the function as this is easier to maintain, control the URLs and handle requests as you do with other node.js APIs.

# Setup

## Install Firebase CLI & Packages

```sh
npm install -g firebase-tools

npm install firebase-functions@latest firebase-admin@latest --save

firebase login
```

# Local Function Emulator

## Setup

This is done through the CLI. You use `firebase serve` to run the emulator locally.

## Running / Debugging Functions

See https://medium.com/@mwebler/debugging-firebase-functions-with-vs-code-3afab528bb36

Setup a local Service Key for Google Cloud. Create Service Key in json.

https://console.cloud.google.com/iam-admin/serviceaccounts?authuser=1&project=[`YOURPROJECTID`]

Docs: https://firebase.google.com/docs/functions/local-emulator

## Set Local Firebase Config

> Instructions for MacOS

``` sh
GOOGLE_APPLICATION_CREDENTIALS="[YOUR SERVICE JSON FILE]"

FIREBASE_CONFIG="[YOUR ESCAPED JSON CONFIG STRING]"
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

| URL               | HTTP ACTION   | INFO      |
| ---               | :---:         | ---               |
| [/api/health]     | GET           | Sample Health Check  |
| [/api/log]        | POST          | Logging message  |
| [/api/stations]   | POST          | Creates a Station  |
| [/api/stations]   | GET           | List of Stations  |
| [/api/stations/search] | GET     | Get Station by params (code or id)  |

[/api/health]: https://us-central1-reference-api-poc.cloudfunctions.net/app/api/health
[/api/log]: https://us-central1-reference-api-poc.cloudfunctions.net/app/api/log
[/api/stations]: https://us-central1-reference-api-poc.cloudfunctions.net/app/api/stations
[/api/stations/search]: https://us-central1-reference-api-poc.cloudfunctions.net/app/api/stations/search

## Firebase Static Hosting for APIs

A great feature which can be used with APIs is the ability to use the static hosting by firebase which uses a CDN by default for serving content. This means with cache headers and rewriting the paths for APIs we can route it through to a function to handle the requests.

`APIs available now through firebase hosting`

The same end points as above

URL: https://reference-api-poc.firebaseapp.com/api/

``` js
  ,"hosting": {
    "public": "public",
    "rewrites": [ {
      "source": "/api/**", "function": "app"
    } ]
  }
```


### Firebase Hosting Rewrite Function Handler

``` js
export const app = functions.https.onRequest(expressApp);
```

# Firebase Functions

## Firebase Console
 
 Limited information of the functions. View the deployed functions and invocations.

 https://console.firebase.google.com/u/1/project/`[YOURPROJECTID]`/functions/list

 ## Google Cloud Functions Console

 Detailed view of the functions. Can download, copy, see deployed date and analytics. You can also create new from here & test the functions.

https://console.cloud.google.com/functions/list?project=`[YOURPROJECTID]`

# PubSub

## PubSub Cloud Functions

The example below shows a handler for the pubsub topic `stations-create` and processing the message when published to the topic.

> Note that the message data is base64 encoded so we need to decode it to get the real value.

``` js
exports.stationCreateSubscriberHandler = functions.pubsub.topic('stations-create').onPublish(async (message) => {
  try {
    console.info(message);
    const messageBody = message.data ? Buffer.from(message.data, 'base64').toString() : null;
    const json = { "data": messageBody }
    await firestoreService.create('log', json)
  } catch (e) {
    console.error('Error Processing Topic Message', e);
  }
});
```

## Topic Push to HTTP Cloud Function

You have to manually go into google cloud console for PubSub and setup a new subscription for a topic. The subscription will be HTTPS and the URL will be your HTTP cloud function.

Google PubSub verifies that you own that domain. So for cloud functions you need to do a hack.

Add a endpoint which all the APIs fall under, i.e. /api/ and return meta header for that route.

It is highly recommended though that this is not the way to add subscriptions. You should use a Cloud Function with the function type `pubsub` where you can specify the topic for the subscription.

> This repository demos this setup. See the index.ts