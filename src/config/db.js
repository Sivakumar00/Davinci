import Firebase from 'firebase';
import '@firebase/functions';

var firebaseConfig = {
  apiKey: "AIzaSyCo_dA1LF1DXDMga1M-6nD-LqL5E50EOpE",
  authDomain: "davinci-00-1.firebaseapp.com",
  databaseURL: "https://davinci-00-1.firebaseio.com",
  projectId: "davinci-00-1",
  storageBucket: "davinci-00-1.appspot.com",
  messagingSenderId: "160572874715",
  appId: "1:160572874715:web:cf4751e11c54b353"
};

  // Initialize Firebase
 let app = Firebase.initializeApp(firebaseConfig);
 export const db = app.database();
 export const cloud_function = app.functions();