// components/GrInvoiceModal.jsx
import React, { useMemo, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

const GrInvoiceModal = ({ selectedPrNo, onClose, onSubmit }) => {
  const [grQuantity, setGrQuantity] = useState("");
  const [grPartially, setGrPartially] = useState(false);
  const [grFully, setGrFully] = useState(false);
  const [receiptFiles, setReceiptFiles] = useState([]);

  const [invoiceQuantity, setInvoiceQuantity] = useState("");
  const [invoicePartially, setInvoicePartially] = useState(false);
  const [invoiceFully, setInvoiceFully] = useState(false);
  const [invoiceFiles, setInvoiceFiles] = useState([]);

  const [errors, setErrors] = useState({});

  /**
   * Validation logic:
   * - A section (GR or Invoice) is "valid" if:
   *    - quantity provided (non-empty, numeric, >= 0)
   *    - one of its checkboxes (partially or fully) is selected
   * - Overall form is valid if at least one section is valid.
   */
  const validateForm = () => {
    const newErrors = {};

    const grQtyEmpty = !grQuantity || String(grQuantity).trim() === "";
    const invoiceQtyEmpty =
      !invoiceQuantity || String(invoiceQuantity).trim() === "";

    // GR specific checks
    if (!grQtyEmpty && Number(grQuantity) < 0) {
      newErrors.grQuantity = "Quantity cannot be negative";
    }
    if (!grQtyEmpty && !grPartially && !grFully) {
      newErrors.grStatus = "Select either Partially or Fully received";
    }

    // Invoice specific checks
    if (!invoiceQtyEmpty && Number(invoiceQuantity) < 0) {
      newErrors.invoiceQuantity = "Quantity cannot be negative";
    }
    if (!invoiceQtyEmpty && !invoicePartially && !invoiceFully) {
      newErrors.invoiceStatus = "Select either Partially or Fully uploaded";
    }

    // Determine if a section is valid
    const grValid =
      !grQtyEmpty &&
      Number(grQuantity) >= 0 &&
      (grPartially || grFully);
    const invoiceValid =
      !invoiceQtyEmpty &&
      Number(invoiceQuantity) >= 0 &&
      (invoicePartially || invoiceFully);

    // If neither section is valid, set an overall error and helpful field errors
    if (!grValid && !invoiceValid) {
      newErrors.general =
        "Please complete at least one section: provide quantity and select Partially or Fully.";
      // If user showed intent on GR (e.g., filled quantity but missed checkbox), ensure that specific error shows:
      if (!grQtyEmpty && !newErrors.grStatus) {
        // quantity provided but no status
        newErrors.grStatus = "Select either Partially or Fully received";
      }
      if (!invoiceQtyEmpty && !newErrors.invoiceStatus) {
        // quantity provided but no status
        newErrors.invoiceStatus = "Select either Partially or Fully uploaded";
      }
      // If quantity missing for both, optionally mark both quantity errors (keeps UI informative)
      if (grQtyEmpty) newErrors.grQuantity = newErrors.grQuantity || "Quantity required to use this section";
      if (invoiceQtyEmpty)
        newErrors.invoiceQuantity = newErrors.invoiceQuantity || "Quantity required to use this section";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 || grValid || invoiceValid;
  };

  // Enable submit when either section is valid (helps UX before clicking Submit)
  const isFormValid = useMemo(() => {
    const grValid =
      grQuantity !== "" &&
      String(grQuantity).trim() !== "" &&
      Number(grQuantity) >= 0 &&
      (grPartially || grFully);

    const invoiceValid =
      invoiceQuantity !== "" &&
      String(invoiceQuantity).trim() !== "" &&
      Number(invoiceQuantity) >= 0 &&
      (invoicePartially || invoiceFully);

    return grValid || invoiceValid;
  }, [
    grQuantity,
    grPartially,
    grFully,
    invoiceQuantity,
    invoicePartially,
    invoiceFully,
  ]);

  const handleSubmit = async () => {
    // final validation: require at least one section valid
    const grValid =
      grQuantity !== "" &&
      String(grQuantity).trim() !== "" &&
      Number(grQuantity) >= 0 &&
      (grPartially || grFully);
    const invoiceValid =
      invoiceQuantity !== "" &&
      String(invoiceQuantity).trim() !== "" &&
      Number(invoiceQuantity) >= 0 &&
      (invoicePartially || invoiceFully);

    // run validateForm to populate errors (if any)
    validateForm();

    if (!grValid && !invoiceValid) {
      return; // stop submission
    }

    const formValues = {
      prNo: selectedPrNo,
      grQuantity: grValid ? Number(grQuantity) : null,
      grPartially: grValid ? grPartially : false,
      grFully: grValid ? grFully : false,
      receiptFiles: grValid ? receiptFiles : [],
      invoiceQuantity: invoiceValid ? Number(invoiceQuantity) : null,
      invoicePartially: invoiceValid ? invoicePartially : false,
      invoiceFully: invoiceValid ? invoiceFully : false,
      invoiceFiles: invoiceValid ? invoiceFiles : [],
    };

    try {
      const result = await onSubmit(formValues);
      // Auto-close modal on success (unless parent returns false)
      if (result !== false) {
        onClose();
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: err?.message || "Submission failed. Please try again.",
      }));
    }
  };

  // small helpers to clear related errors on user actions
  const clearError = (key) =>
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[10000]">
      <div className="relative bg-white p-6 rounded-xl shadow-2xl w-[800px] max-w-[90%] text-gray-800 animate-fadeIn">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
          title="Close"
        >
          <IoIosCloseCircleOutline size={20} />
        </button>

        {/* Header */}
        <h3 className="text-xl font-semibold mb-6 text-center text-gray-800">
          GR / Invoice Submission
        </h3>

        {/* Two-column responsive layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Goods Received Section */}
          <div className="border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
            <h4 className="font-semibold mb-3 text-amber-700 border-b pb-2">
              Goods Received
            </h4>

            <label className="block mb-2 text-sm font-medium text-gray-700">
              Quantity Received
            </label>
            <input
              type="number"
              min="0"
              value={grQuantity}
              onChange={(e) => {
                setGrQuantity(e.target.value);
                clearError("grQuantity");
                clearError("general");
              }}
              className={`w-full border rounded-md p-2 mb-2 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none ${
                errors.grQuantity ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.grQuantity && (
              <p className="text-red-500 text-xs mb-2">{errors.grQuantity}</p>
            )}

            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={grPartially}
                  onChange={() => {
                    setGrPartially((prev) => {
                      const next = !prev;
                      if (next) {
                        setGrFully(false);
                        clearError("grStatus");
                        clearError("general");
                      }
                      return next;
                    });
                  }}
                />
                Partially Received
              </label>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={grFully}
                  onChange={() => {
                    setGrFully((prev) => {
                      const next = !prev;
                      if (next) {
                        setGrPartially(false);
                        clearError("grStatus");
                        clearError("general");
                      }
                      return next;
                    });
                  }}
                />
                Fully Received
              </label>
            </div>
            {errors.grStatus && (
              <p className="text-red-500 text-xs mb-2">{errors.grStatus}</p>
            )}

            <label className="block text-sm mb-1 font-medium text-gray-700">
              Upload Receipt (optional)
            </label>
            <input
              type="file"
              multiple
              onChange={(e) =>
                setReceiptFiles(Array.from(e.target.files || []))
              }
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          {/* Invoice Upload Section */}
          <div className="border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
            <h4 className="font-semibold mb-3 text-amber-700 border-b pb-2">
              Invoice Upload
            </h4>

            <label className="block mb-2 text-sm font-medium text-gray-700">
              Quantity for Invoice
            </label>
            <input
              type="number"
              min="0"
              value={invoiceQuantity}
              onChange={(e) => {
                setInvoiceQuantity(e.target.value);
                clearError("invoiceQuantity");
                clearError("general");
              }}
              className={`w-full border rounded-md p-2 mb-2 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none ${
                errors.invoiceQuantity ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.invoiceQuantity && (
              <p className="text-red-500 text-xs mb-2">
                {errors.invoiceQuantity}
              </p>
            )}

            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={invoicePartially}
                  onChange={() => {
                    setInvoicePartially((prev) => {
                      const next = !prev;
                      if (next) {
                        setInvoiceFully(false);
                        clearError("invoiceStatus");
                        clearError("general");
                      }
                      return next;
                    });
                  }}
                />
                Partially Uploaded
              </label>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={invoiceFully}
                  onChange={() => {
                    setInvoiceFully((prev) => {
                      const next = !prev;
                      if (next) {
                        setInvoicePartially(false);
                        clearError("invoiceStatus");
                        clearError("general");
                      }
                      return next;
                    });
                  }}
                />
                Fully Uploaded
              </label>
            </div>
            {errors.invoiceStatus && (
              <p className="text-red-500 text-xs mb-2">
                {errors.invoiceStatus}
              </p>
            )}

            <label className="block text-sm mb-1 font-medium text-gray-700">
              Upload Invoice (optional)
            </label>
            <input
              type="file"
              multiple
              onChange={(e) =>
                setInvoiceFiles(Array.from(e.target.files || []))
              }
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* general submit error */}
        {errors.general && (
          <p className="text-red-600 text-center text-sm mt-4">{errors.general}</p>
        )}
        {errors.submit && (
          <p className="text-red-600 text-center text-sm mt-2">{errors.submit}</p>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
              isFormValid
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-green-300 text-white cursor-not-allowed"
            }`}
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrInvoiceModal;
