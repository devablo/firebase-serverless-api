import stations from './stations';
import utilities from './utilities';
import * as express from "express";
import { FirestoreService } from '../firestoreService';

const router = express.Router();
const firestoreService = new FirestoreService();

router.use('/stations', stations);
router.use('/utilities', utilities);

// Default to handle domain verification for HTTPS Topic Push
router.get('/', async (req: express.Request, res: express.Response) => {
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
router.post("/log", async (req: express.Request, res: express.Response) => {
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


export default router;