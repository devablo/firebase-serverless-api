const functions = require('firebase-functions');
const { stationService } = require('./src/services');

/*
* Create a station node
*
* @example
* TBC
*
* @param {Object} req Cloud Function request context.
* @param {Object} res Cloud Function response context.
*/
exports.createStation = functions.https.onRequest(async (req, res) => {

    try {
        // TODO: Validate Request
        let requestBody = req.body;
        let name = requestBody.name;
        if (!name)
            return res.status(200).send('Invalid Station name');

        let exists = await stationService.stationExists(name);
        if (exists)
            return res.status(200).send('Station already exists');
        
        let ref = await stationService.create(requestBody);
        let data = { success: true, data: ref.id, message: 'Created'};
        console.log('Created Entity with ID: ', ref.id);

        return res.status(200).send(JSON.stringify(data));
    } catch (error) {
        console.log('Error Creating Entity:', ex, requestBody);
        let data =  { success: false, data: null, message: 'Error'};

        return res.status(403).send(JSON.stringify(data));
    }
});

exports.health = functions.https.onRequest(async (req, res) => {
    res.status(200).send('OK');
});

exports.stationSearch = functions.https.onRequest(async (req, res) => {
    try {
        let stationId = req.query.id;
        let station = req.query.code;

        if (station) {
            console.log(`Getting Station By Code: ${station}`);
            let data = await stationService.getByCode(station);
            return res.status(200).send(JSON.stringify(data));
        }
        else if (stationId) {
            console.log(`Getting Station By ID: ${stationId}`);
            let data = await stationService.getById(stationId)
            return res.status(200).send(JSON.stringify(data));
        }
    } catch (error) {
        return res.status(200).send([{}]);
    }
});

exports.stations = functions.https.onRequest(async (req, res) => {
    try {
        let data = await stationService.getAll();
        return res.status(200).send(JSON.stringify(data));        
    } catch (error) {
        return res.status(200).send([{}]);
    }
});