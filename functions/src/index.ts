import * as functions from 'firebase-functions';
import * as express from 'express';
import * as bodyParser from "body-parser";
import { FirestoreService } from './firestoreService';
import router from './routes/index';

const firestoreService = new FirestoreService();
const expressApp = express();
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: false }));

// Hooking up express to handle the requests
expressApp.use('/api', router);

// Default way of adding functions to project
// NOTE: This is not accessible through firebase hosting solution as this is express handling the request.
export const health = functions.https.onRequest(async (req, res) => {
    res.status(200).send('OK');
});

// PubSub Function
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

export const app = functions.https.onRequest(expressApp);