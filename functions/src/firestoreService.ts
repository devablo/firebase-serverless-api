import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

export async function createStation(collection, doc) {
    return db.collection(collection).add(doc);
}

export class FirestoreService {

    async create(collection, doc) {
        return db.collection(collection).add(doc);
    }
    
    async getDocumentByFilter(collection, filter){
        const dataRef = db.collection(collection);            
        const query = dataRef.where(filter.field, "==", filter.value).limit(1);
        return query.get().then((querySnapshot) => {
            const result = querySnapshot.docs[0].data();
            result.id = querySnapshot.docs[0].id;
            return result;
        })
    }
    async getAllDocuments(collection) {
        const rootRef = db.collection(collection);
        const query = rootRef.orderBy("name")
        return query.get().then((querySnapshot) => {
            return querySnapshot.docs.map((documentSnapshot) => {
                const result = documentSnapshot.data();
                result.id = documentSnapshot.id;
                return result;
              });
        })
    }
    async getById (collection, documentId) {
        const docRef = db.collection(collection).doc(documentId);
        return docRef.get()
            .then((doc) => {
                
                if (doc.exists) {
                    const result = doc.data();
                    result.id = doc.id;
                    return result;
                }
                
                return {};
            })
            .catch((error) => {
                console.log("Error getting document:", error);
                return {};
            });
    }
    async documentExistsByName(collection, name) {
        const dataRef = db.collection(collection);
        const query = dataRef.where("name", "==", name).limit(1);
    
        return query.get().then((querySnapshot) => {
            return !querySnapshot.empty;
        }).catch((error) => {
            console.log("Error getting document:", error);
            return false;
        });
    }
}

// function createStationAsPromise(req, res, db) {
//     return db.collection('stations').add(requestBody)
//     .then(ref => {
//         console.log('Created Entity with ID: ', ref.id);
//         return { success: true, data: ref.id, message: 'Created'};
//     })
//     .catch(ex => {
//         console.log('Error Creating Entity:', ex, requestBody);
//         return { success: false, data: null, message: 'Error'};
//     })
//     .then((result) => {
//         if (!result.success) {
//             res.status(403).send(JSON.stringify(result));
//             return;
//         }

//         res.status(200).send(JSON.stringify(result));
//         return;
//       });
// }