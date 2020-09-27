import firebase from "firebase";
import "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyD0Er9H4F5NQmhCpMQothsbttv7ZIlUuVY",
  authDomain: "face-id-4a52a.firebaseapp.com",
  databaseURL: "https://face-id-4a52a.firebaseio.com",
  projectId: "face-id-4a52a",
  storageBucket: "face-id-4a52a.appspot.com",
  messagingSenderId: "314273584318",
  appId: "1:314273584318:web:86564c94c608b72faa3aef",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp;
