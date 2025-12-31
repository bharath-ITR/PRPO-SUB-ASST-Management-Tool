// AzureStorageUploader.js
import { BlobServiceClient } from '@azure/storage-blob';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

export const AzureStorageAcc=async(buffer, originalName, mimetype)=> {
  const fileName = `${Date.now()}-${originalName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: mimetype || 'application/octet-stream',
    },
  });

  return {
    fileName,
    url: blockBlobClient.url,
  };
}
