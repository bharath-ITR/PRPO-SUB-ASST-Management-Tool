import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// Export to PDF
export const exportToPDF = (data, columns, filename, title) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Add date
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Prepare table data - convert to strings and handle special characters
  const tableData = data.map((row) => {
    return columns.map((col) => {
      let value = "";
      if (col.accessor) {
        value = col.accessor(row);
      } else {
        value = row[col.key] || "";
      }
      // Convert to string and handle currency symbols
      let textValue = String(value);
      // Replace currency symbols that might not render well in PDF
      // Keep ₹ as is, but ensure it's properly encoded
      return textValue;
    });
  });

  // Add table
  autoTable(doc, {
    head: [columns.map((col) => col.header)],
    body: tableData,
    startY: 35,
    styles: { 
      fontSize: 9,
      cellPadding: 3,
      overflow: "linebreak",
      cellWidth: "wrap"
    },
    headStyles: { 
      fillColor: [59, 130, 246], 
      textColor: 255, 
      fontStyle: "bold"
    },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    margin: { top: 35 },
    didParseCell: function (data) {
      // Ensure proper text rendering for all cells
      if (data.cell.text && data.cell.text.length > 0) {
        data.cell.text = data.cell.text.map(text => String(text));
      }
    }
  });

  doc.save(`${filename}.pdf`);
};

// Export to Excel
export const exportToExcel = (data, columns, filename, sheetName) => {
  // Prepare worksheet data
  const worksheetData = [
    columns.map((col) => col.header), // Header row
    ...data.map((row) =>
      columns.map((col) => {
        if (col.accessor) {
          return col.accessor(row);
        }
        return row[col.key] || "";
      })
    ),
  ];

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths
  const colWidths = columns.map(() => ({ wch: 20 }));
  ws["!cols"] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName || "Sheet1");

  // Save file
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

