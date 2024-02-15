const {onDocumentUpdated} = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();
exports.updateTime = onDocumentUpdated("Schedule/Monday", async (event) => {
  const db = admin.firestore();
  const collection = db.collection("Schedule").get().then( (snapshot) =>{
    snapshot.forEach( (docName ) => {
      if ( docName.exists ) {
        docName.ref.update({
          Morning: event.data.after.data().Morning,
          Afternoon: event.data.after.data().Afternoon,
          Evening: event.data.after.data().Evening,
        });
      }
    });
  });
  return collection;
});
