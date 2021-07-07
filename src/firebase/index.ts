import firebase from 'firebase/app';
import 'firebase/storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAGVMV7BvpFOs9Z6gby6Un-tBNU9BAjxw4',
  authDomain: 'rs-drum-studio.firebaseapp.com',
  projectId: 'rs-drum-studio',
  storageBucket: 'rs-drum-studio.appspot.com',
  messagingSenderId: '436843806400',
  appId: '1:436843806400:web:83728ef52f82c6efa8f725',
  measurementId: 'G-MXRFE1PD6W',
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
