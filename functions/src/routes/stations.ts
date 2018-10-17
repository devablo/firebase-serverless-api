import { StationService } from '../stationService';
import * as express from "express";

const router = express.Router();
const stationService = new StationService();

router.post("/", async (req: express.Request, res: express.Response) => {
    try {
        // TODO: Validate Request
        const requestBody = req.body;
        const name = requestBody.name;
        if (!name)
            return res.status(200).send('Invalid Station name');

        const exists = await stationService.stationExists(name);
        if (exists)
            return res.status(200).send('Station already exists');
        
        const ref = await stationService.create(requestBody);
        const data = { success: true, data: ref.id, message: 'Created'};
        console.log('Created Entity with ID: ', ref.id);

        return res.status(200).send(JSON.stringify(data));
    } catch (error) {
        console.log('Error:', error);
        const data =  { success: false, data: null, message: 'Error'};

        return res.status(403).send(JSON.stringify(data));
    }
})

router.get("/search", async (req: express.Request, res: express.Response) => {
    try {
        const stationId = req.query.id;
        const station = req.query.code;

        if (station) {
            console.log(`Getting Station By Code: ${station}`);
            const data = await stationService.getByCode(station);
            return res.status(200).send(JSON.stringify(data));
        }
        else if (stationId) {
            console.log(`Getting Station By ID: ${stationId}`);
            const data = await stationService.getById(stationId)
            return res.status(200).send(JSON.stringify(data));
        }
    } catch (error) {
        console.log('Error:', error);
    }
    return res.status(200).send([{}]);
});

router.get("/", async (req: express.Request, res: express.Response) => {
    try {
        const data = await stationService.getAll();
        return res.status(200).send(JSON.stringify(data));        
    } catch (error) {
        console.log('Error:', error);
    }
    return res.status(200).send([{}]);
});

export default router;