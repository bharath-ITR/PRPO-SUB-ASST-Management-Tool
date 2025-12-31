import React from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Button } from "@mui/material";
import FullLogo from "../Assist/FullLogo.png";

const PRTOPDF = ({ results, sortedRequests }) => {
  const drawTextOnPage = (page, request, font, fontSize) => {
    const { width, height } = page.getSize();
    const lineHeight = 18;

    // Define left and right columns
    const leftX = 50;
    const rightX = 320;
    let leftY = height - 150; // start below logo
    let rightY = height - 150;

    const leftEntries = [
      `PR No.: ${request.PR_no}`,
      `Your Email: ${request.body?.usermail}`,
      `Name: ${request.body?.sender_name}`,
      `Date: ${request.body?.currentDate}`,
      `Location: ${request.body?.location}`,
      `Product Name: ${request.body?.productName}`,
      `Product Description: ${request.body?.productDescription}`,
    ];

    const rightEntries = [
      `Product Reason: ${request.body?.productReason}`,
      `Cost: ${request.body?.approxCost}`,
      `Quantity: ${request.body?.quantity}`,
      `Purchase Type: ${request.body?.purchaseType}`,
      `Payment Type: ${request.body?.paymentType}`,
      `Expected Date: ${request.body?.expectedDate}`,
      `User Comment: ${request.body?.comment}`,
      `Status: ${request.status}`,
    ];

    // Draw left column
    leftEntries.forEach((text) => {
      page.drawText(text, {
        x: leftX,
        y: leftY,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      leftY -= lineHeight;
    });

    // Draw right column
    rightEntries.forEach((text) => {
      page.drawText(text, {
        x: rightX,
        y: rightY,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      rightY -= lineHeight;
    });

    // Draw Reporting To & Supervisor Table below columns
    const tableStartY = Math.min(leftY, rightY) - 20;
    const tableHeaders = ["Mail", "Comment", "Response"];
    const tableData = request.reportingToAndSupervisor || [];
    const columnX = { mail: 50, comment: 250, response: 400 };

    page.drawText("Reporting To & Supervisor:", {
      x: columnX.mail,
      y: tableStartY,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    const headerY = tableStartY - lineHeight;
    tableHeaders.forEach((header) => {
      page.drawText(header, {
        x: columnX[header.toLowerCase()] || 50,
        y: headerY,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    });

    let rowY = headerY - lineHeight;
    tableData.forEach((entry) => {
      page.drawText(entry.sendTo || "---", {
        x: columnX.mail,
        y: rowY,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(entry.Comment || "---", {
        x: columnX.comment,
        y: rowY,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(entry.response || "---", {
        x: columnX.response,
        y: rowY,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      rowY -= lineHeight;
    });
  };

  const handleDownloadPDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontSize = 12;

    const selectedAndFilteredPDFs = results.length > 0 ? results : sortedRequests;

    // Load logo
    const logoBytes = await fetch(FullLogo).then((res) => res.arrayBuffer());
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const logoDims = logoImage.scale(0.2); // scale logo to fit

    selectedAndFilteredPDFs.forEach((request) => {
      const page = pdfDoc.addPage([600, 800]);

      // Draw logo at top-left
      page.drawImage(logoImage, {
        x: 50,
        y: page.getHeight() - logoDims.height - 20,
        width: logoDims.width,
        height: logoDims.height,
      });

      // Draw PR details in two columns
      drawTextOnPage(page, request, timesRomanFont, fontSize);
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "PRs.pdf";
    link.click();
  };

  return (
    <Button
      onClick={handleDownloadPDF}
      variant="contained"
      color="primary"
      size="small"
      sx={{
        fontSize: "13px",
        padding: "3px 8px",
        minWidth: "auto",
        textTransform: "none",
      }}
    >
      Download PDF
    </Button>
  );
};

export default PRTOPDF;
