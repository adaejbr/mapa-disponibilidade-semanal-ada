import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB7U8fo0yKhjA3YXwb-j5ex0Hsss8V5xR8',
  authDomain: 'ada-mapa-disponibilidade.firebaseapp.com',
  projectId: 'ada-mapa-disponibilidade',
  storageBucket: 'ada-mapa-disponibilidade.firebasestorage.app',
  messagingSenderId: '905798505138',
  appId: '1:905798505138:web:c2d09cb55dd9167a9a2fab'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
