import Firebase from 'firebase';
var firebaseConfig = {
    apiKey: "AIzaSyBLsefCtJHofB-CKg5lfFuCO_56xQDgDTM",
    authDomain: "davinci-00.firebaseapp.com",
    databaseURL: "https://davinci-00.firebaseio.com",
    projectId: "davinci-00",
    storageBucket: "davinci-00.appspot.com",
    messagingSenderId: "549068705166",
    appId: "1:549068705166:web:827b2d8c8d72e281"
  };
  // Initialize Firebase
 let app = Firebase.initializeApp(firebaseConfig);
 export const db = app.database();