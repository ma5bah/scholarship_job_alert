
import {FirebaseApp, FirebaseError, initializeApp} from 'firebase/app';
import {
    Auth,
    getAuth,
    sendEmailVerification,
    signInWithEmailAndPassword,
    User,
} from 'firebase/auth';
import {Firestore, getFirestore} from 'firebase/firestore';
import {getStorage, ref, uploadBytes, FirebaseStorage} from "firebase/storage";
import process from "node:process";

export class FirebaseService {
    private readonly app: FirebaseApp;
    private readonly auth: Auth;
    private firestore: Firestore;
    private firebaseStorage: FirebaseStorage;
    /** App's firebase configuration
     */
        private firebase_config = {
        apiKey: process.env.firebase_api_key,
        authDomain: process.env.firebase_auth_domain,
        projectId: process.env.firebase_project_id,
        storageBucket: process.env.firebase_storage_bucket,
        messagingSenderId: process.env.firebase_messaging_sender_id,
        appId: process.env.firebase_app_id,
    };


    constructor() {
        this.app = initializeApp(this.firebase_config);
        this.auth = getAuth(this.app);
        this.firestore = getFirestore(this.app);
        this.firebaseStorage = getStorage(this.app);
    }

    getFirebaseStorage() {
        return this.firebaseStorage;
    }

    async send_email_verification(firebase_generated_user: User) {
        return await sendEmailVerification(firebase_generated_user);
    }

    async sign_in_with_email_and_password(email, password) {
        const user_credential = await signInWithEmailAndPassword(
            this.auth,
            email,
            password,
        );
        return user_credential.user;
    }


}
