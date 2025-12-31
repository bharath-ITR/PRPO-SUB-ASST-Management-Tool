// import  { useEffect, useState } from "react";
// import axios from "axios";
// import saveAs from "file-saver";
// import FileDownloadIcon from '@mui/icons-material/FileDownload'; // Import the FileDownload icon
// import { Button } from '@mui/material';

// const ExportToExcel = () => {
//   const apiUrl = process.env.REACT_APP_API;

//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${apiUrl}/userData`);
//         setData(response.data);
//       } catch (error) {
//         console.error("Error downloading all data", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const flattenData = (data) => {
//     return data.map((item) => {
//       const flatItem = {
//         PR_no: item.PR_no,
//         /* To: item.To.map(email => email), */
//         sender: item.sender,
//         usermail: item.body.usermail,
//         productName: item.body.productName,
//         productDescription: item.body.productDescription,
//         productReason: item.body.productReason,
//         location: item.body.location,
//         approxCost: item.body.approxCost,
//         quantity: item.body.quantity,
//         currentDate: item.body.currentDate,
//         expectedDate: item.body.expectedDate,
//         paymentType: item.body.paymentType,
//         purchaseType: item.body.purchaseType,
//         /* dateSent: item.dateSent, */
//         status: item.status,
//       };

//       return flatItem;
//     });
//   };

//   const handleDownloadAll = () => {
//     const flattenedData = flattenData(data);

//     // Prepend headers
//     const headers = Object.keys(flattenedData[0]);
//     const csvData = [headers];

//     // Map each item to an array of values and add it to the CSV data
//     flattenedData.forEach((item) => {
//       const row = headers.map((header) => item[header]);
//       csvData.push(row);
//     });

//     // Create a Blob and download the file
//     const csvString = csvData.map((row) => row.join(",")).join("\n");
//     const blob = new Blob([csvString], { type: "text/csv;charset=utf-8" });
//     saveAs(blob, "allData.csv");
//   };

//   return (
//     <div
//       style={{
//         marginTop: 45,
//         marginBottom: 30,
//         marginRight: 15,
//         float: "right",
//       }}
//     >
//       <Button
//         variant="contained" color="primary"
//         onClick={handleDownloadAll}
//       >
//         <FileDownloadIcon style={{ marginRight: 8 }} /> {/* Add the icon here */}
//         Export File
//       </Button>
//     </div>
//   );
// };

// export default ExportToExcel;



import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExportToExcel = ({ sortedRequests, results }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (results && results.length > 0) {
      setData(results);
    } else if (sortedRequests && sortedRequests.length > 0) {
      setData(sortedRequests);
    } else {
      setData([]);
    }
  }, [results, sortedRequests]);

  // Flatten each item according to your flatItem structure
  const flattenData = (items) => {
    return items.map((item) => ({
      PR_no: item.PR_no,
      sender: item.sender,
      usermail: item.body?.usermail || "",
      productName: item.body?.productName || "",
      productDescription: item.body?.productDescription || "",
      productReason: item.body?.productReason || "",
      location: item.body?.location || "",
      approxCost: item.body?.approxCost || "",
      quantity: item.body?.quantity || "",
      currentDate: item.body?.currentDate || "",
      expectedDate: item.body?.expectedDate || "",
      paymentType: item.body?.paymentType || "",
      purchaseType: item.body?.purchaseType || "",
      status: item.status,
    }));
  };

  const handleDownloadAll = () => {
    if (!data || data.length === 0) return;

    const flattened = flattenData(data);

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(flattened);

    // Make headers bold, light blue background, uppercase
    const headerRange = XLSX.utils.decode_range(ws["!ref"]);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cellAddress]) continue;

      // Style
      ws[cellAddress].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "ADD8E6" } }, // Light blue
      };

      // Uppercase header text
      ws[cellAddress].v = ws[cellAddress].v.toString().toUpperCase();
    }

    // Create workbook and export
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PRPO_Data");

    XLSX.writeFile(wb, "PRPO_Data.xlsx");
  };

  return (
    <div
      style={{
        marginTop:32,
        marginBottom: 30,
        marginRight: 15,
        float: "right",
      }}
    >
   <Button
  variant="contained"
  color="primary"
  onClick={handleDownloadAll}
  size="small"
  sx={{
    fontSize: "13px",
    padding: "3px 8px",
    minWidth: "auto",
    textTransform: "none",
    display: "flex",
    alignItems: "center",
    gap: "4px", // spacing between icon and text
  }}
>
  <FileDownloadIcon style={{ fontSize: "16px" }} />
  Export File
</Button>

    </div>
  );
};

export default ExportToExcel;
