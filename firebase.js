
const admin = require("firebase-admin");
const firebase_key = require("./config/firebase_key.json");

admin.initializeApp({
  credential: admin.credential.cert(firebase_key),
  storageBucket: process.env.DATABASE_URL,
});

const busket = admin.storage().bucket();

module.exports.busket= busket