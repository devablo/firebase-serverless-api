const { FirestoreService } = require('./firestoreService');
const firestoreService = new FirestoreService();

exports.StationService = class StationService {
    constructor() {
    }
    
    async create(station) {
        return firestoreService.create('stations', station)
    }
    async getByCode(code){

        let filter = {
            field: 'code',
            value: code
        }  
        
        return firestoreService.getDocumentByFilter('stations', filter).then((doc) => {
            return mapDocumentToStation(doc);
        })
    }
    async getAll () {
        
        return firestoreService.getAllDocuments('stations')
            .then((docs) => {
                return docs.map((doc) => {
                    return mapDocumentToStation(doc);
                });
            })
            .catch((error) => {
                console.info(error);
            });
    }
    async getById (documentId) {
        return firestoreService.getById('stations', documentId).then((doc) => {
            return mapDocumentToStation(doc);
        });
    }
    async stationExists (name) {
        return firestoreService.documentExistsByName('stations', name)
    }
}

function mapDocumentToStation(doc) {
    return {
        id: doc.id,
        name: doc.name,
        code: doc.code,
        shows: doc.shows,
    }
}