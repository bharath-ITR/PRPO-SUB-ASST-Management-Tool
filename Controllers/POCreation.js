import ejs from "ejs";
import PdfPrinter from "pdfmake";
import PurchaseOrder from "../Models/POSchema.js";
import { POEmailToVendor } from "./POEmailToVendor.js";
import EmailModel from "../Models/EmailModelSchema.js";
import { BlobSASPermissions, BlobServiceClient, generateBlobSASQueryParameters, SASProtocol, StorageSharedKeyCredential } from "@azure/storage-blob";

function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export const POCreation = async (req, res) => {
  try {
    const {
      PR_no,
      Tax,
      approxCost,
      currentDate,
      deliveryDate,
      location,
      paymentType,
      productDescription,
      productName,
      purchaseType,
      quantity,
      quotationDate,
      quotationNo,
      shippingAddress,
      shippingState,
      unitPrice,
      companyDetails,
      vendorName,
      vendorEmail,
      vendorGSTIN,
      VendorCompanyName,
      vendorStreet,
      vendorArea,
      vendorCity,
      vendorPostalCode,
      vendorState,
      totalAmount,
      currency,
    } = req.body;

    function generatePONumber() {
      const timestamp = new Date().getTime();
      const lastFourDigits = (timestamp % 10000) + 6;
      return `${lastFourDigits}`;
    }

    // GST calculation
    const taxRate = parseFloat(Tax.replace("%", "")) / 100;
    const approxCostValue = parseFloat(totalAmount);

    let cgst = 0,
      sgst = 0,
      igst = 0,
      totalCost = approxCostValue;

    if (companyDetails?.state === vendorState) {
      cgst = approxCostValue * (taxRate / 2);
      sgst = approxCostValue * (taxRate / 2);
      totalCost += cgst + sgst;
    } else {
      igst = approxCostValue * taxRate;
      totalCost += igst;
    }

    const newPO = new PurchaseOrder({
      PONumber: generatePONumber(),
      PR_no,
      Tax,
      approxCost,
      totalAmount: `${approxCostValue.toFixed(2)}`,
      currentDate: formatDate(currentDate),
      deliveryDate: formatDate(deliveryDate),
      location,
      paymentType,
      productDescription,
      productName,
      purchaseType,
      quantity,
      quotationDate,
      quotationNo,
      shippingAddress,
      unitPrice,
      currency,
      vendorName,
      vendorEmail,
      vendorGSTIN,
      VendorCompanyName,
      vendorStreet,
      vendorArea,
      vendorCity,
      vendorPostalCode,
      vendorState,
      cgst: `${currency} ${cgst.toFixed(2)}`,
      sgst: `${currency} ${sgst.toFixed(2)}`,
      igst: `${currency} ${igst.toFixed(2)}`,
      totalCost: `${currency} ${totalCost.toFixed(2)}`,
      companyDetails,
    });

    await PurchaseOrder.deleteMany({});
    await newPO.save();

    // PDF generation
    const fonts = {
      Helvetica: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique",
      },
    };

    const printer = new PdfPrinter(fonts);

    const docDefinition = {
      content: [
        {
          text: "PURCHASE ORDER",
          style: "mainHeader",
          alignment: "center",
          color: "#1A237E",
          margin: [0, 0, 0, 15],
        },
        {
          columns: [
            [
              { text: `PO Number: ${newPO.PONumber}`, style: "poInfo" },
              { text: `Date: ${newPO.currentDate}`, style: "poInfo" },
            ],
          ],
          margin: [0, 0, 0, 14],
        },
        {
          columns: [
            {
              width: "48%",
              stack: [
                { text: "Vendor Details", style: "sectionHeader" },
                {
                  table: {
                    widths: ["auto", "*"],
                    body: [
                      ["Company", { text: `${newPO.VendorCompanyName}`, color: "#283593" }],
                      ["Address", { text: `${newPO.vendorStreet}, ${newPO.vendorArea}, ${newPO.vendorCity}, ${newPO.vendorState}, ${newPO.vendorPostalCode}` }],
                      ["GSTIN", { text: `${newPO.vendorGSTIN}` }],
                    ],
                  },
                  layout: "noBorders",
                  margin: [0, 0, 0, 6],
                },
              ],
            },
            {
              width: "48%",
              stack: [
                { text: "Company Details", style: "sectionHeader" },
                {
                  table: {
                    widths: ["auto", "*"],
                    body: [
                      ["Name", { text: `${newPO?.companyDetails.name || ""}`, color: "#283593" }],
                      ["Address", { text: `${newPO?.companyDetails.address || ""}` }],
                      ["State", { text: `${newPO?.companyDetails.state || ""}` }],
                    ],
                  },
                  layout: "noBorders",
                },
              ],
            },
          ],
          columnGap: 10,
        },
        { text: "Order Details", style: "sectionHeader", margin: [0, 12, 0, 7] },
        {
          table: {
            headerRows: 1,
            widths: ["*", 50, 80, 80],
            body: [
              [{ text: "Product", style: "tableHeader" }, { text: "Qty", style: "tableHeader" }, { text: "Unit Price", style: "tableHeader" }, { text: "Total", style: "tableHeader" }],
              [{ text: newPO.productName, color: "#37474F" }, { text: newPO.quantity, alignment: "right" }, { text: `${currency} ${newPO.unitPrice}`, alignment: "right" }, { text: `${currency} ${approxCostValue.toFixed(2)}`, alignment: "right" }],
            ],
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex === 0 ? "#E3E8F1" : null),
            hLineWidth: () => 0.7,
            vLineWidth: () => 0.4,
            hLineColor: () => "#90A4AE",
            vLineColor: () => "#E3E8F1",
            paddingLeft: () => 8,
            paddingRight: () => 8,
            paddingTop: () => 6,
            paddingBottom: () => 6,
          },
        },
        {
          columns: [
            { width: "*", text: "" },
            {
              width: "auto",
              stack: [
                {
                  table: {
                    widths: [100, 100],
                    body: [
                      [{ text: "CGST", bold: true }, { text: newPO.cgst, alignment: "right" }],
                      [{ text: "SGST", bold: true }, { text: newPO.sgst, alignment: "right" }],
                      [{ text: "IGST", bold: true }, { text: newPO.igst, alignment: "right" }],
                      [{ text: "Total", bold: true, fillColor: "#3949AB", color: "#fff" }, { text: newPO.totalCost, alignment: "right", fillColor: "#3949AB", color: "#fff", bold: true }],
                    ],
                  },
                  layout: {
                    fillColor: (rowIndex) => (rowIndex === 3 ? "#3949AB" : null),
                    hLineColor: () => "#90A4AE",
                    vLineColor: () => "#E3E8F1",
                    hLineWidth: () => 0.7,
                    vLineWidth: () => 0.5,
                    paddingLeft: () => 10,
                    paddingRight: () => 10,
                    paddingTop: () => 5,
                    paddingBottom: () => 5,
                  },
                },
              ],
            },
          ],
          margin: [0, 18, 0, 0],
        },
        { text: "Thank you for your business.", style: "footerNote", alignment: "center", margin: [0, 32, 0, 0] },
      ],
      styles: {
        mainHeader: { fontSize: 22, bold: true, color: "#283593", margin: [0, 12, 0, 12] },
        sectionHeader: { fontSize: 14, bold: true, color: "#1565C0", margin: [0, 10, 0, 7], decoration: "underline" },
        poInfo: { fontSize: 10, color: "#424242", margin: [0, 0, 0, 3] },
        tableHeader: { bold: true, fontSize: 12, color: "#253858" },
        footerNote: { fontSize: 10, italics: true, color: "#888" },
      },
      defaultStyle: { font: "Helvetica", fontSize: 10, color: "#333" },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    // --- Azure Blob Setup ---
    const blobConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
    const containerClient = BlobServiceClient.fromConnectionString(blobConnectionString).getContainerClient(containerName);
    const blobName = `${newPO._id}.pdf`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const chunks = [];
    pdfDoc.on("data", (chunk) => chunks.push(chunk));
    pdfDoc.on("end", async () => {
      try {
        const pdfBuffer = Buffer.concat(chunks);

        await blockBlobClient.uploadData(pdfBuffer, {
          blobHTTPHeaders: { blobContentType: "application/pdf" },
        });

        console.log("PDF uploaded to Azure Blob Storage:", blobName);

        // --- Generate SAS URL valid for 24 hours ---
        const accountName = process.env.AZURE_ACCOUNT_NAME;
        const accountKey = process.env.AZURE_ACCOUNT_KEY;
        const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

        const sasExpiryDate = new Date();
        sasExpiryDate.setHours(sasExpiryDate.getHours() + 24);

        const sasToken = generateBlobSASQueryParameters({
          containerName,
          blobName,
          permissions: BlobSASPermissions.parse("r"),
          startsOn: new Date(),
          expiresOn: sasExpiryDate,
          protocol: SASProtocol.Https
        }, sharedKeyCredential).toString();

        const blobUrlWithSAS = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;

        // --- Send email with SAS URL ---
        await POEmailToVendor(newPO.vendorEmail, newPO.PONumber, blobUrlWithSAS);

        // --- Update EmailModel ---
        const emailDocument = await EmailModel.findOne({ PR_no });
        if (!emailDocument) {
          return res.status(404).json({ error: "Document not found for the provided PR_no." });
        }

        const updateResult = await EmailModel.updateOne({ PR_no }, { $set: { isPOcreated: true } });
        // if (updateResult.modifiedCount === 0) {
        //   console.warn("Document found, but update was not successful.");
        //   return res.status(500).json({ error: "Failed to update the document." });
        // }

        console.log("Email record updated successfully.");
        res.status(201).send(`Purchase Order created and PDF generated successfully ${newPO.PONumber}`);

      } catch (emailError) {
        console.error("Email sending error:", emailError);
        res.status(500).send("Internal Server Error");
      }
    });

    pdfDoc.end();

  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};


// import puppeteer from 'puppeteer';
// import ejs from 'ejs';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import PurchaseOrder from "../Models/POSchema.js";
// import { POEmailToVendor } from "./POEmailToVendor.js";
// import EmailModel from '../Models/EmailModelSchema.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// function formatDate(date) {
//     const d = new Date(date);
//     const day = String(d.getDate()).padStart(2, '0');
//     const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
//     const year = d.getFullYear();
//     return `${day}-${month}-${year}`;
// }
// export const POCreation = async (req, res) => {
//     try {
//         const {
//             PR_no, Tax, approxCost, currentDate, deliveryDate, location, paymentType,
//             productDescription, productName, purchaseType, quantity, quotationDate,
//             quotationNo, shippingAddress, shippingState, unitPrice,
//             companyDetails, vendorName, vendorEmail,
//             vendorGSTIN, VendorCompanyName, vendorStreet, vendorArea,
//             vendorCity, vendorPostalCode, vendorState,totalAmount,currency
//         } = req.body;

//         function generatePONumber() {
//             const timestamp = new Date().getTime();
//             const lastFourDigits = (timestamp % 10000) + 6;
//             return `${lastFourDigits}`;
//         }

//         // Calculate GST
//         const taxRate = parseFloat(Tax.replace('%', '')) / 100;
//         const approxCostValue = parseFloat(totalAmount);

//         let cgst = 0, sgst = 0,igst = 0, totalCost = approxCostValue;

//         if (companyDetails.state === vendorState) {
//             cgst = approxCostValue * (taxRate / 2);
//             sgst = approxCostValue * (taxRate / 2);
//             totalCost += cgst + sgst;
//         } else {
//             igst = approxCostValue * taxRate; // for interstate transactions
//             totalCost += igst;
//         }

//         const newPO = new PurchaseOrder({
//             PONumber: generatePONumber(),
//             PR_no,
//             Tax,
//             approxCost,
//             totalAmount: ` ${approxCostValue.toFixed(2)}`, // You might want to add currency here if needed
//             currentDate: formatDate(currentDate),
//             deliveryDate: formatDate(deliveryDate),
//             location,
//             paymentType,
//             productDescription,
//             productName,
//             purchaseType,
//             quantity,
//             quotationDate,
//             quotationNo,
//             shippingAddress,
//             unitPrice,
//             currency,
//             vendorName,
//             vendorEmail,
//             vendorGSTIN,
//             VendorCompanyName,
//             vendorStreet,
//             vendorArea,
//             vendorCity,
//             vendorPostalCode,
//             vendorState,
//             cgst: `${currency} ${cgst.toFixed(2)}`,
//             sgst: `${currency} ${sgst.toFixed(2)}`,
//             igst: `${currency} ${igst.toFixed(2)}`,
//             totalCost: `${currency} ${totalCost.toFixed(2)}`,
//             companyDetails // Saving the company details
//         });

//         await PurchaseOrder.deleteMany({});
//         await newPO.save();

//         const htmlTemplatePath = path.join(__dirname, '../POTemplate/POTemplate.html');
//         const templateContent = fs.readFileSync(htmlTemplatePath, 'utf8');

//         const poData = newPO.toObject();
//         const renderedHtml = ejs.render(templateContent, poData);

//         if (!renderedHtml) {
//             throw new Error('HTML rendering failed');
//         }

//         const filePath = path.join(__dirname, `../pdfs/${newPO._id}.pdf`);

//         const browser = await puppeteer.launch({
//             executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
//             headless: true,
//             args: ['--no-sandbox', '--disable-setuid-sandbox']
//         });

//         const page = await browser.newPage();
//         await page.setContent(renderedHtml, { waitUntil: 'networkidle0' });
//         await page.pdf({ path: filePath, format: 'A4' });
//         await browser.close();

//         console.log('PDF created successfully:', filePath);

//         try {
//             await POEmailToVendor(newPO.vendorEmail, newPO.PONumber, filePath);
//             const emailDocument = await EmailModel.findOne({ PR_no });

//             if (!emailDocument) {
//                 return res.status(404).json({ error: 'Document not found for the provided PR_no.' });
//             }

//             const updateResult = await EmailModel.updateOne(
//                 { PR_no },
//                 { $set: { isPOcreated: true } }
//             );

//             if (updateResult.nModified === 0) {
//                 console.warn('Document found, but update was not successful.');
//                 res.status(500).json({ error: 'Failed to update the document.' });
//             } else {
//                 console.log('Email record updated successfully.');
//                 res.status(201).send(`Purchase Order created and PDF generated successfully ${newPO.PONumber}`);
//             }

//         } catch (emailError) {
//             console.error('Email sending error:', emailError);
//             res.status(500).send('Internal Server Error');
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Internal Server Error');
//     }
// };

/* export const POCreation = async (req, res) => {
    try {
        const {
            PR_no, Tax, approxCost, currentDate, deliveryDate, location, paymentType,
            productDescription, productName, purchaseType, quantity, quotationDate,
            quotationNo, shippingAddress, shippingState, unitPrice,
            companyDetails, vendorName, currency,totalAmount,
            vendorEmail,
            vendorGSTIN,
            VendorCompanyName,
            vendorStreet,
            vendorArea,
            vendorCity,
            vendorPostalCode,
            vendorState
        } = req.body;
        console.log('data', companyDetails)
        function generatePONumber() {
            const timestamp = new Date().getTime();
            const lastFourDigits = (timestamp % 10000) + 6;
            return `${lastFourDigits}`;
        }

        // Calculate GST
        const taxRate = parseFloat(Tax.replace('%', '')) / 100;
        const approxCostValue = parseFloat(totalAmount.replace('USD', '').trim());
        let cgst = 0, sgst = 0, igst = 0, totalCost = approxCostValue;

        if (companyDetails.state === vendorState) {
            cgst = approxCostValue * (taxRate / 2);
            sgst = approxCostValue * (taxRate / 2);
            totalCost += cgst + sgst;
        } else {
            igst = approxCostValue * taxRate;
            totalCost += igst;
        }

        const newPO = new PurchaseOrder({
            PONumber: generatePONumber(),
            PR_no,
            Tax,
            approxCost: ` ${approxCostValue.toFixed(2)}`,
            currentDate: formatDate(currentDate),
            deliveryDate: formatDate(deliveryDate),
            location,
            paymentType,
            productDescription,
            productName,
            purchaseType,
            quantity,
            quotationDate,
            quotationNo,
            shippingAddress,
            unitPrice,
            currency,
            vendorName,
            vendorEmail,
            vendorGSTIN,
            VendorCompanyName,
            vendorStreet,
            vendorArea,
            vendorCity,
            vendorPostalCode,
            vendorState,
            cgst: `${currency} ${cgst.toFixed(2)}`,
            sgst: `${currency} ${sgst.toFixed(2)}`,
            igst: `${currency} ${igst.toFixed(2)}`,
            totalCost: `${currency} ${totalCost.toFixed(2)}`,
            companyDetails // Saving the company details
        });

        await PurchaseOrder.deleteMany({});
        await newPO.save();

        const htmlTemplatePath = path.join(__dirname, '../POTemplate/POTemplate.html');
        const templateContent = fs.readFileSync(htmlTemplatePath, 'utf8');

        const poData = newPO.toObject();
        const renderedHtml = ejs.render(templateContent, poData);

        if (!renderedHtml) {
            throw new Error('HTML rendering failed');
        }

        const filePath = path.join(__dirname, `../pdfs/${newPO._id}.pdf`);

        const browser = await puppeteer.launch({
            executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
            headless: true,  // Or false if you want to see the browser
            args: ['--no-sandbox', '--disable-setuid-sandbox']
          });
          
        const page = await browser.newPage();
        await page.setContent(renderedHtml, { waitUntil: 'networkidle0' });
        await page.pdf({ path: filePath, format: 'A4' });
        await browser.close();

        console.log('PDF created successfully:', filePath);

        try {
            await POEmailToVendor(newPO.vendorEmail, newPO.PONumber, filePath);
            const emailDocument = await EmailModel.findOne({ PR_no });

            if (!emailDocument) {
                return res.status(404).json({ error: 'Document not found for the provided PR_no.' });
            }

            // Update EmailModel to set isPOcreated to true
            const updateResult = await EmailModel.updateOne(
                { PR_no },
                { $set: { isPOcreated: true } }
            );

            if (updateResult.nModified === 0) {
                console.warn('Document found, but update was not successful.');
                res.status(500).json({ error: 'Failed to update the document.' });
            } else {
                console.log('Email record updated successfully.');
                res.status(201).send(`Purchase Order created and PDF generated successfully ${newPO.PONumber}`);
            }

        } catch (emailError) {
            console.error('Email sending error:', emailError);
            res.status(500).send('Internal Server Error');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
 */
