const { StationService } = require('./stationService');
const { FirestoreService } = require('./firestoreService');

exports.stationService = new StationService();
exports.firestoreService = new FirestoreService();