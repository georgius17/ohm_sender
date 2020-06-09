import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyAbwpYobsUDmjClkC4PRvV2PFWRvI1rDmk",
    authDomain: "ohmsender.firebaseapp.com",
    databaseURL: "https://ohmsender.firebaseio.com",
    projectId: "ohmsender",
    storageBucket: "ohmsender.appspot.com",
    messagingSenderId: "972705872345",
    appId: "1:972705872345:web:e2c465339123f75fa281c8"
}

  // Initialize Firebase
  firebase.initializeApp(config);

export const firebaseAuth = firebase.auth;
export const db = firebase.database();
