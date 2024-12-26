import {App, getApps, initializeApp} from "firebase-admin/app";
import {Firestore, getFirestore} from "firebase-admin/firestore"
import {credential} from "firebase-admin";
import * as process from "node:process";
import {ScholarshipService} from "../../../models/abstract";
import * as console from "node:console";

export class FirebaseAdminService {
    private readonly app: App;
    readonly firestore: Firestore;

    private firebase_admin_config = {
        type: process.env.firebase_admin_type,
        projectId: process.env.firebase_admin_project_id,
        privateKeyId: process.env.firebase_admin_private_key_id,
        privateKey: process.env.firebase_admin_private_key.replace(/\\n/g, '\n'),

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
        this.firestore = getFirestore(this.app);
    }

    get_firestore() {
        return this.firestore;
    }


    async get_all_doc(scholarship_service: ScholarshipService<any>): Promise<any> {
        try {
            const querySnapshot = await this.firestore
                .collection(scholarship_service.get_name())
                .get();
            let results = [];
            querySnapshot.forEach((doc) => {
                results.push(doc.data());
            });
            return results;
        } catch (error) {
            console.error("Error retrieving documents:", error);
        }
    }

    async write_doc(scholarship_service: ScholarshipService<any>, data: any): Promise<void> {
        try {
            // console.log(`Writing document with ID ${data.hashed_id} to collection ${scholarship_service.get_name()}...`);
            await this.firestore.collection(scholarship_service.get_name()).doc(data.hashed_id).set({
                ...data,
            });
            console.log(data.file);
            console.log(`Document with ID ${data.hashed_id} written successfully in collection ${scholarship_service.get_name()}.`);
        } catch (error) {
            console.error(`Error writing document with ID ${data.hashed_id} to collection ${scholarship_service.get_name()}:`, error);
            console.error('Data being written:', JSON.stringify(data, null, 2));
            console.error('Scholarship service name:', scholarship_service.get_name());
            throw error;
        }
    }

    async is_doc_exist(scholarship_service: ScholarshipService<any>, data: any): Promise<boolean> {
        try {
            const doc = await this.firestore.collection(scholarship_service.get_name()).doc(data.hashed_id).get();
            return doc.exists;
        } catch (error) {
            console.error(`Error checking if document with ID ${data.hashed_id} exists in collection ${scholarship_service.get_name()}:`, error);
            console.error('Data being checked:', JSON.stringify(data, null, 2));
            console.error('Scholarship service name:', scholarship_service.get_name());
            throw error;
        }
    }
}
