import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

const EditForm = ({ requestData, setIsEditing, setEditedRequest }) => {
  console.log("requestData", requestData.unitPrice);
  const apiUrl = process.env.REACT_APP_API;

  const [currency, setCurrency] = useState("");
  const [editedData, setEditedData] = useState({ ...requestData });
  const [fileUrls, setFileUrls] = useState([]);
const [unitPrice, setUnitPrice] = useState(0); // unit price from requestData

  useEffect(() => {
    setEditedData({ ...requestData });
  }, [requestData]);

useEffect(() => {
  if (requestData) {
    let currencyFromData = "";
    let numericCost = requestData.approxCost;

    // Extract currency & numeric part (e.g., "INR 5000")
    if (requestData.approxCost && requestData.approxCost.includes(" ")) {
      const [curr, ...rest] = requestData.approxCost.split(" ");
      currencyFromData = curr;
      numericCost = rest.join(" ");
    }

    // Remove commas
    numericCost = numericCost.replace(/,/g, "");

    const totalCost = Number(numericCost) || 0;
    const quantity = Number(requestData.quantity) || 1;

    // 👉 Correct unit price calculation
    const calculatedUnitPrice = totalCost / quantity;

    setCurrency(currencyFromData);

    setEditedData({
      ...requestData,
      approxCost: totalCost, // numeric only
    });

    setUnitPrice(calculatedUnitPrice); // finally correct unit price
    console.log("Unit Price Calculated:", calculatedUnitPrice);
  }
}, [requestData]);


  const locationCurrencyMap = {
    India: "INR",
    US: "USD",
    Dubai: "AED",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "location") {
      setCurrency(locationCurrencyMap[value] || "");
    }

    setEditedData((prevData) => {
      let newData = { ...prevData, [name]: value };

      // Recalculate approxCost only when quantity changes
      if (name === "quantity") {
        const quantity = Number(value) || 0;
        const calculatedCost = (quantity * unitPrice).toFixed(2);

        console.log("Quantity changed:", quantity);
        console.log("Using unitPrice from requestData:", unitPrice);
        console.log("Calculated approxCost:", calculatedCost);

        newData.approxCost = calculatedCost;
      }

      return newData;
    });
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    setEditedData((prevData) => ({
      ...prevData,
      attachment: files,
    }));

    const urls = files.map((file) => URL.createObjectURL(file));
    setFileUrls(urls);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    const payload = { ...editedData, PR_no: requestData.PR_no };

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === "attachment") {
        value.forEach((file) => formData.append("attachment", file));
      } else if (key === "approxCost") {
        formData.append("approxCost", `${currency} ${editedData.approxCost}`);
      } else {
        formData.append(key, value);
      }
    });

    try {
      const response = await fetch(`${apiUrl}/updateRequest`, {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        console.log("Request updated successfully!");
        window.location.reload();
      } else {
        console.error("Failed to update request:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating request:", error);
    }

    setIsEditing(false);
    setEditedRequest(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedRequest(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-[600px] max-h-[90vh] overflow-y-auto rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center bg-white-600 text-blue-700 px-5 py-3 rounded-t-lg">
          <h2 className="text-lg font-semibold">Edit Request</h2>
          <button onClick={handleCancelEdit} className="hover:text-gray-200">
            <CloseIcon size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Location
              </label>
              <select
                name="location"
                value={editedData.location || ""}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-blue-500"
                required
              >
                <option value="">Select your location</option>
                <option value="India">India</option>
                <option value="US">U.S</option>
                <option value="Dubai">Dubai</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Purchase Type
              </label>
              <select
                name="purchaseType"
                value={editedData.purchaseType || ""}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-blue-500"
                required
              >
                <option value="">Select type</option>
                <option value="Office supplies">Office supplies</option>
                <option value="Activities">Activities</option>
                <option value="Product And Service">Product And Service</option>
                <option value="Capital Expenditure">Capital Expenditure</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Payment Type
              </label>
              <select
                name="paymentType"
                value={editedData.paymentType || ""}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-blue-500"
                required
              >
                <option value="">Select payment type</option>
                <option value="One Time Payment">One Time Payment</option>
                <option value="Recurring Payment Monthly">
                  Recurring Payment Monthly
                </option>
                <option value="Recurring Payment Quarterly">
                  Recurring Payment Quarterly
                </option>
                <option value="Recurring Payment Half Yearly">
                  Recurring Payment Half Yearly
                </option>
                <option value="Recurring Payment Yearly">
                  Recurring Payment Yearly
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Attachments
              </label>
              <input
                type="file"
                name="attachment"
                multiple
                onChange={handleFileInputChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Other Inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                PR No.
              </label>
              <input
                type="text"
                name="PR_no"
                value={editedData.PR_no}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                value={editedData.productName || ""}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={editedData.quantity || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Cost
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 bg-gray-100 text-gray-600 rounded-l">
                    {currency || "—"}
                  </span>
                  <input
                    type="number"
                    name="approxCost"
                    value={editedData.approxCost || ""}
                    readOnly // prevent manual override
                    className="w-full border rounded-r px-3 py-2 text-sm bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Product Description
              </label>
              <textarea
                name="productDescription"
                value={editedData.productDescription || ""}
                onChange={handleInputChange}
                rows={3}
                className="w-full border rounded px-3 py-2 text-sm"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Reason
              </label>
              <textarea
                name="productReason"
                value={editedData.productReason || ""}
                onChange={handleInputChange}
                rows={3}
                className="w-full border rounded px-3 py-2 text-sm"
              ></textarea>
            </div>
          </div>

          {/* Attachment preview */}
          {fileUrls.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Attachments Preview:
              </p>
              <ul className="list-disc list-inside text-blue-600">
                {fileUrls.map((url, i) => (
                  <li key={i}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      View Attachment {i + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditForm;
