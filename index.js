import express from 'express';
import { BlobServiceClient } from '@azure/storage-blob';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Azure Storage credentials
const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = process.env.CONTAINER_NAME;

const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING,
);

app.get('/', async (req, res) => {
  try {
    const containerClient =
      blobServiceClient.getContainerClient(CONTAINER_NAME);
    let blobList = '';

    for await (const blob of containerClient.listBlobsFlat()) {
      blobList += `<li>${blob.name}</li>`;
    }

    res.send(
      `<h1>Blobs in Container: ${CONTAINER_NAME}</h1><ul>${blobList}</ul>`,
    );
  } catch (err) {
    console.error('Error listing blobs:', err.message);
    res.status(500).send('Error accessing Azure Storage.');
  }
});

app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});
