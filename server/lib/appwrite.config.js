import { Client, Storage } from 'node-appwrite';

import dotenv from 'dotenv'
dotenv.config()

const {
    PROJECT_ID,
    API_KEY,
    PUBLIC_BUCKET_ID: BUCKET_ID,
    PUBLIC_ENDPOINT: ENDPOINT
} = process.env;

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY); // Use the API key from the environment variable

const storage = new Storage(client);

// Use ES module export syntax
export {
    PROJECT_ID,
    API_KEY,
    BUCKET_ID,
    ENDPOINT,
    storage,
};
