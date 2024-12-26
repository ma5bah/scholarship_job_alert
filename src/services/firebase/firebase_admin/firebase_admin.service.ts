import {App, getApps, initializeApp} from "firebase-admin/app";
import {Firestore, getFirestore} from "firebase-admin/firestore"
import {Auth, getAuth} from "firebase-admin/auth";
import {credential} from "firebase-admin";
import * as process from "node:process";

export class FirebaseAdminService {
    private app: App;
    private auth: Auth;
    readonly firestore: Firestore;

    private firebase_admin_config = {
        type: process.env.firebase_admin_type,
        projectId: process.env.firebase_admin_project_id,
        privateKeyId: process.env.firebase_admin_private_key_id,
        privateKey: process.env.firebase_admin_private_key,
        clientEmail: process.env.firebase_admin_client_email,
        clientId: process.env.firebase_admin_client_id,
        authUri: process.env.firebase_admin_auth_uri,
        tokenUri: process.env.firebase_admin_token_uri,
        authProviderX509CertUrl: process.env.firebase_admin_auth_provider_x509_cert_url,
        clientC509CertUrl: process.env.firebase_admin_client_x509_cert_url,
    };
    // Your web app's Firebase configuration
    private firebase_config = {
        apiKey: process.env.firebase_api_key,
        authDomain: process.env.firebase_auth_domain,
        projectId: process.env.firebase_project_id,
        storageBucket: process.env.firebase_storage_bucket,
        messagingSenderId: process.env.firebase_messaging_sender_id,
        appId: process.env.firebase_app_id,
    };

    constructor() {
        if (!this.app && getApps().length === 0) {
            // if (config.get("APP_ENV") !== "development") {
            this.app = initializeApp({
                credential: credential.cert(this.firebase_admin_config),
                projectId: this.firebase_admin_config.projectId,
            });
        } else {
            this.app = getApps()[0];
        }

        this.auth = getAuth(this.app);
        this.firestore = getFirestore(this.app);
    }

    get_firestore() {
        return this.firestore;
    }


    async test(){
        this.firestore
    }
}
