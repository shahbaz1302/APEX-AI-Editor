import "dotenv/config";
import { cert, initializeApp } from "firebase-admin";

const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountString) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is missing");
}

const serviceAccount = JSON.parse(serviceAccountString);

export const app = initializeApp({
    credential: cert(serviceAccount),
});