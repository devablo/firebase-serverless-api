import * as functions from 'firebase-functions';
import * as express from 'express';
import * as bodyParser from "body-parser";
import router from './routes/index';
import { FirestoreService } from './firestoreService';

const firestoreService = new FirestoreService();
const expressApp = express();
expressApp.use(bodyParser.json());

export const health = functions.https.onRequest(async (req, res) => {
    res.status(200).send('OK');
});

expressApp.use('/api/stations', router);
expressApp.get('/api/', async (req: express.Request, res: express.Response) => {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <meta name="google-site-verification" content="DW4tqoISFjuSPul-AcCAMvaDuHPAjERxR3cxsGbuXTY" />
        <title>API Docs</title>
        </head>
        <body>
            API OK
        </body>
        </html>
    `
    res.status(200).send(html);
});
expressApp.post("/api/subscriber", async (req: express.Request, res: express.Response) => {
    const requestBody = req.body;    
    await firestoreService.create('subscriberLog', requestBody)
    res.status(200).send('OK');
});

export const app = functions.https.onRequest(expressApp);