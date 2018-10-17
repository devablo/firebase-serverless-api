import * as functions from 'firebase-functions';
import * as express from 'express';
import * as bodyParser from "body-parser";
import { FirestoreService } from './firestoreService';
import { stations } from './routes/index';

const firestoreService = new FirestoreService();
const expressApp = express();
expressApp.use(bodyParser.json());

// Default way of adding functions to project
// NOTE: This is not accessible through firebase hosting solution as this is express handling the request.
export const health = functions.https.onRequest(async (req, res) => {
    res.status(200).send('OK');
});

// Hooking up express to handle the requests
// TODO: setup routing to be generic and by path
expressApp.use('/api/stations', stations);

// Default to handle domain verification for HTTPS Topic Push
expressApp.get('/api/', async (req: express.Request, res: express.Response) => {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <meta name="google-site-verification" content="DW4tqoISFjuSPul-AcCAMvaDuHPAjERxR3cxsGbuXTY" />
        <meta name="google-site-verification" content="TfMbTfiC9gw_3eXjP9L9DTZPwDCX1iv-atF1Sbnqp1U" />
        <title>API Docs</title>
        </head>
        <body>
            API OK
        </body>
        </html>
    `
    res.status(200).send(html);
});

// This is used as example of HTTP Push Subscriber
expressApp.post("/api/log", async (req: express.Request, res: express.Response) => {
    // TODO: This is just an example for HTTP Push & manual HTTP message
    const requestBody = req.body;
    let json = requestBody;
    
    // topic http push object
    if (requestBody.data) {
        const messageBody = requestBody.data ? Buffer.from(requestBody.data, 'base64').toString() : null;
        json = { "data": messageBody }
    }
    
    await firestoreService.create('log', json)
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