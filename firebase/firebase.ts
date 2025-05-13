import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDR7C6zk_dPdyxWCDafaGylXuDK6JkvuWs",
    authDomain: "mma-finds-2f78f.firebaseapp.com",
    projectId: "mma-finds-2f78f",
    storageBucket: "mma-finds-2f78f.firebasestorage.app",
    messagingSenderId: "792502548091",
    appId: "1:792502548091:web:40c00fe8e64720a55e54de",
    measurementId: "G-LWF7PDGNMG"
};

export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth      = getAuth(app);
export const storage = getStorage(app);


