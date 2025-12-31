import React from "react";
import { Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const PreviewPO = ({
  formData,
  vendorInfo,
  deliveryDate,
  quotationNo,
  quotationDate,
  tax,
  setShowPreview,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-2">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl p-6 relative text-xs overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-gray-800">
            Purchase Order Preview
          </h2>
          <IconButton
            onClick={() => setShowPreview(false)}
            size="small"
            sx={{
              backgroundColor: "rgba(255, 99, 71, 0.1)",
              "&:hover": { backgroundColor: "rgba(255, 99, 71, 0.2)" },
            }}
          >
            <CloseIcon fontSize="small" className="text-red-600" />
          </IconButton>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-md text-[11px]">
            <tbody>
              <tr className="bg-gray-50">
                <td className="border p-2 font-semibold text-gray-700">
                  PR No
                </td>
                <td className="border p-2">{formData.PR_no}</td>
                <td className="border p-2 font-semibold text-gray-700">
                  Product Name
                </td>
                <td className="border p-2">{formData.body?.productName}</td>
              </tr>
              <tr>
                <td className="border p-2 font-semibold text-gray-700">
                  Product Description
                </td>
                <td className="border p-2">
                  {formData.body?.productDescription}
                </td>
                <td className="border p-2 font-semibold text-gray-700">
                  Quantity
                </td>
                <td className="border p-2">{formData.body?.quantity}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2 font-semibold text-gray-700">
                  Location
                </td>
                <td className="border p-2">{formData.body?.location}</td>
                <td className="border p-2 font-semibold text-gray-700">
                  Unit Price
                </td>
                <td className="border p-2">{formData.body?.unitPrice}</td>
              </tr>
              <tr>
                <td className="border p-2 font-semibold text-gray-700">
                  Approx Cost
                </td>
                <td className="border p-2">{formData.body?.approxCost}</td>
                <td className="border p-2 font-semibold text-gray-700">
                  Delivery Date
                </td>
                <td className="border p-2">{deliveryDate}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2 font-semibold text-gray-700">
                  Purchase Type
                </td>
                <td className="border p-2">{formData.body?.purchaseType}</td>
                <td className="border p-2 font-semibold text-gray-700">
                  Payment Type
                </td>
                <td className="border p-2">{formData.body?.paymentType}</td>
              </tr>
              <tr>
                <td className="border p-2 font-semibold text-gray-700">
                  Shipping Address
                </td>
                <td className="border p-2">{formData.shippingAddress}</td>
                <td className="border p-2 font-semibold text-gray-700">
                  Vendor Name
                </td>
                <td className="border p-2">{vendorInfo.name}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2 font-semibold text-gray-700">
                  Vendor Email
                </td>
                <td className="border p-2">{vendorInfo.primaryemail}</td>
                <td className="border p-2 font-semibold text-gray-700">
                  Vendor Phone
                </td>
                <td className="border p-2">{vendorInfo.primarycontactNo}</td>
              </tr>
              <tr>
                <td className="border p-2 font-semibold text-gray-700">
                  Vendor Address
                </td>
                <td className="border p-2" colSpan={3}>
                  {[
                    vendorInfo.street,
                    vendorInfo.city,
                    vendorInfo.state,
                    vendorInfo.country,
                    vendorInfo.gstNo,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2 font-semibold text-gray-700">Tax</td>
                <td className="border p-2">{tax}</td>
                <td className="border p-2 font-semibold text-gray-700">
                  Quotation No
                </td>
                <td className="border p-2">{quotationNo}</td>
              </tr>
              <tr>
                <td className="border p-2 font-semibold text-gray-700">
                  Quotation Date
                </td>
                <td className="border p-2">{quotationDate}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-4">
          <Button
            onClick={() => setShowPreview(false)}
            variant="contained"
            color="error"
            size="small"
            sx={{
              fontSize: "0.7rem",
              textTransform: "none",
              paddingX: 2,
              paddingY: 0.5,
            }}
          >
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewPO;
