import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAeOV6kbny168MglCPmEakRm7XEvfCJKCk',
  authDomain: 'tarefasplus-b6669.firebaseapp.com',
  projectId: 'tarefasplus-b6669',
  storageBucket: 'tarefasplus-b6669.appspot.com',
  messagingSenderId: '310047272606',
  appId: '1:310047272606:web:c3b97e775396f93008958f',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
