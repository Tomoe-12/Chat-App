const sdk = require('node-appwrite')

const {
    PROJECT_ID,
    API_KEY,
    PUBLIC_BUCKET_ID: BUCKET_ID,
    PUBLIC_ENDPOINT: ENDPOINT
} = process.env

const client = new sdk.Client()
    .setEndpoint(process.env.PUBLIC_ENDPOINT)
    .setProject(process.env.PROJECT_ID)
    .setKey(process.env.API_KEY); // Use the API key from the environment variable

const storage = new sdk.Storage(client)

module.exports = {
    PROJECT_ID,
    API_KEY,
    BUCKET_ID,
    ENDPOINT,
    storage,
}
