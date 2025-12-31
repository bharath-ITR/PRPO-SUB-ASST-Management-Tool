// server/routes/sas.js

import {
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  SASProtocol,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

// ⚠️ Make sure these are defined in your .env file
const accountName = process.env.AZURE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);
export const GenerateSASUrl = async (req, res) => {
  try {
    const blobName = req.params.id
    console.log('blobName',blobName);
    
    if (!blobName) {
      return res.status(400).json({ error: "Missing blobName parameter" });
    }

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse("r"),
        startsOn: new Date(),
        expiresOn: new Date(Date.now() + 60 * 60 * 1000),
        protocol: SASProtocol.Https,
      },
      sharedKeyCredential
    ).toString();

    const sasUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
    return res.status(200).json({ sasUrl });
  } catch (error) {
    console.error("Error generating SAS URL:", error);
    return res.status(500).json({ error: "Failed to generate SAS URL" });
  }
};
