import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getCategory } from "../../redux/Action";
import { Finance, Higher_authority, reporting_Manager } from "../../Constant";
import { downloadPurchasePdf } from "./PR_PDF";
import FullLogo from "../../components/Assist/FullLogo.png";

const Home = () => {
  const apiUrl = process.env.REACT_APP_API;
  const dispatch = useDispatch();
  const { Categories = [] } = useSelector((state) => state.getCategory);

  const [step, setStep] = useState(1);
  const totalSteps = 4; // 4 steps only, no preview step
  const [files, setFiles] = useState();
  const [uploadFile, setUploadFile] = useState("Upload File");
  const [currency, setCurrency] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const previewRef = useRef(null);

  const [formData, setFormData] = useState({
    purchaseType: "",
    reportingTo: "",
    reportingTo_name: "",
    finance: "",
    finance_name: "",
    higher_authority: "",
    higher_authority_name: "",
    location: "",
    productCategory: "",
    productName: "",
    quantity: "",
    unitPrice: "",
    approxCost: "",
    expectedDate: "",
    productDescription: "",
    productReason: "",
    file: "",
    comment: "",
    paymentType: "",
  });

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  const locationCurrencyMap = {
    India: "INR",
    US: "USD",
    Dubai: "AED",
    All: "INR",
  };

  useEffect(() => {
    setCurrency(locationCurrencyMap[formData.location] || "");
  }, [formData.location]);

  useEffect(() => {
    const numericQuantity = parseFloat(formData.quantity);
    const numericUnitPrice = parseFloat(formData.unitPrice);
    if (!isNaN(numericQuantity) && !isNaN(numericUnitPrice)) {
      setFormData((prev) => ({
        ...prev,
        approxCost: (numericQuantity * numericUnitPrice).toFixed(2),
      }));
    } else {
      setFormData((prev) => ({ ...prev, approxCost: "" }));
    }
  }, [formData.quantity, formData.unitPrice]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "quantity") {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue) || numericValue < 0) return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleFileInputChange = (e) => {
    if (e.target && e.target.files) {
      setFiles(e.target.files);
      setUploadFile(e.target.files[0].name);
    }
  };

  function formatDateToDDMMYY(date) {
    const d = new Date(date);
    const day = d
      .getDate()
      .toString()
      .padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear().toString();
    return `${month}/${day}/${year}`;
  }

  const currentDate = new Date()
    .toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "/");

  const validateStep = () => {
    let requiredFields = [];
    switch (step) {
      case 1:
        requiredFields = [
          { field: formData.location, name: "Location" },
          { field: formData.productCategory, name: "Product Category" },
          { field: formData.productName, name: "Product" },
          { field: formData.quantity, name: "Quantity" },
          { field: formData.unitPrice, name: "Unit Price" },
          { field: formData.approxCost, name: "Total Cost" },
        ];
        break;
      case 2:
        requiredFields = [
          { field: formData.productDescription, name: "Product Description" },
          { field: formData.productReason, name: "Purchase Reason" },
          { field: formData.comment, name: "Comment" },
        ];
        break;
      case 3:
        requiredFields = [
          { field: formData.expectedDate, name: "Expected Date" },
          { field: formData.purchaseType, name: "Purchase Type" },
          { field: formData.paymentType, name: "Payment Type" },
          // File required checked on submit
        ];
        break;
      case 4:
        requiredFields = [
          { field: formData.reportingTo, name: "Level-1 Approver" },
          { field: formData.finance, name: "Level-2 Approver" },
          { field: formData.higher_authority, name: "Level-3 Approver" },
        ];
        break;
      default:
        requiredFields = [];
    }
    const emptyFields = requiredFields.filter(
      (f) => !f.field || f.field === ""
    );
    if (emptyFields.length > 0) {
      toast.error(
        `Please fill required fields: ${emptyFields
          .map((f) => f.name)
          .join(", ")}`
      );
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  // Open modal on submit button click to preview
  const openPreview = () => {
    if (!validateStep()) return;
    setIsPreviewOpen(true);
  };

  const downloadPDF = () => {
    downloadPurchasePdf({
      formData,
      currency,
      files,
      logoDataUrl: FullLogo,
      meta: {
        title: "Purchase Request",
        requesterName: JSON.parse(localStorage.getItem("accessToken"))?.name,
        requestId: `PR-${Date.now()}`,
      },
    });
  };
  // Submit logic called after user confirms in modal
const handleSubmit = async () => {
  // Validate all steps before submitting
  let allValid = true;
  for (let s = 1; s <= totalSteps; s++) {
    setStep(s); // optionally highlight step
    if (!validateStep()) {
      allValid = false;
      toast.error(`Please complete Step ${s} before submitting.`);
      return; // stop submission immediately
    }
  }

  if (!files || files.length === 0) {
    toast.error("Please attach at least one file before submitting.");
    setStep(3); // go to file upload step
    return;
  }

  // Proceed with submission
  const localData = JSON.parse(localStorage.getItem("accessToken"));
  const formDataToSend = new FormData();
  
  // Append all fields as you already do
  formDataToSend.append("username", localData.name);
  formDataToSend.append("usermail", localData.email);
  formDataToSend.append("currentDate", currentDate);
  formDataToSend.append("purchaseType", formData.purchaseType);
  formDataToSend.append("expectedDate", formatDateToDDMMYY(formData.expectedDate));
  formDataToSend.append("reportingTo", formData.reportingTo.split("|")[1]);
  formDataToSend.append("reportingTo_name", formData.reportingTo.split("|")[0]);
  formDataToSend.append("finance", formData.finance.split("|")[1]);
  formDataToSend.append("finance_name", formData.finance.split("|")[0]);
  formDataToSend.append("higher_authority", formData.higher_authority.split("|")[1]);
  formDataToSend.append("higher_authority_name", formData.higher_authority.split("|")[0]);
  formDataToSend.append("location", formData.location);
  formDataToSend.append("productDescription", formData.productDescription);
  formDataToSend.append("unitPrice", `${currency} ${formData.unitPrice}`);
  formDataToSend.append("approxCost", `${currency} ${formData.approxCost}`);
  formDataToSend.append("currency", currency);
  formDataToSend.append("quantity", formData.quantity);
  formDataToSend.append("productName", formData.productName);
  formDataToSend.append("productReason", formData.productReason);
  formDataToSend.append("paymentType", formData.paymentType);
  formDataToSend.append("comment", formData.comment);

  for (let i = 0; i < files.length; i++) {
    formDataToSend.append("attachment", files[i]);
  }

  try {
    setIsSubmitted(true);
    const response = await fetch(`${apiUrl}/sendEmail`, {
      method: "POST",
      body: formDataToSend,
    });

    if (response.ok) {
      const responseData = await response.text();
      toast.success(responseData);
      setTimeout(() => (window.location.href = "/history"), 1500);
    } else {
      toast.error("Email sending failed.");
    }
  } catch (error) {
    console.error("Error sending email:", error);
    toast.error("Email sending failed.");
  } finally {
    setIsSubmitted(false);
    setIsPreviewOpen(false);
  }
};

  const renderProgressBar = () => (
    <div className="mb-6 flex items-center justify-center space-x-3">
      {[1, 2, 3, 4].map((num) => (
        <div
          key={num}
          className={`px-3 py-2 rounded-full flex items-center justify-center cursor-pointer text-sm font-semibold ${
            step === num
              ? "bg-blue-600 text-white"
              : step > num
              ? "bg-blue-400 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => setStep(num)}
          title={`Step ${num}`}
        >
          Step {num}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-[90vh] w-full bg-white flex justify-center py-10 px-4 mt-5">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-10 border border-gray-200 mt-5">
        {renderProgressBar()}
        <form
          encType="multipart/form-data"
          className="space-y-10"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Step 1 */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Location <span className="text-red-500">*</span>
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value="" disabled>
                    Select your location
                  </option>
                  <option value="India">India</option>
                  <option value="US">U.S</option>
                  <option value="Dubai">Dubai</option>
                  <option value="All">All</option>
                </select>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Product Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="productCategory"
                  value={formData.productCategory}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value="" disabled>
                    Select product category
                  </option>
                  {Categories.map((category) => (
                    <option key={category._id} value={category.category}>
                      {category.category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Product <span className="text-red-500">*</span>
                </label>
                <select
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value="" disabled>
                    Select product
                  </option>
                  {Categories.find(
                    (c) => c.category === formData.productCategory
                  )?.products?.map((product) => (
                    <option key={product} value={product}>
                      {product}
                    </option>
                  )) || null}
                </select>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Unit Price ({currency}){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Total Cost ({currency})
                </label>
                <input
                  type="number"
                  name="approxCost"
                  value={formData.approxCost}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Product Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={handleInputChange}
                  rows={3}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Purchase Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="productReason"
                  value={formData.productReason}
                  onChange={handleInputChange}
                  rows={3}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Comment <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows={3}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Expected Date <span className="text-red-500">*</span>
                </label>

                <input
                  type="date"
                  name="expectedDate"
                  value={formData.expectedDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split("T")[0]} // ⬅️ prevents past dates
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm 
               focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Purchase Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="purchaseType"
                  value={formData.purchaseType}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value="" disabled>
                    Select Purchase Type
                  </option>
                  <option value="Office supplies">Office supplies</option>
                  <option value="Activities">Activities</option>
                  <option value="Product And Service">
                    Product And Service
                  </option>
                  <option value="Capital Expenditure">
                    Capital Expenditure
                  </option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Payment Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value="" disabled>
                    Select Payment Type
                  </option>
                  <option value="One Time Payment">One Time Payment</option>
                  <option value="Recurring Payment Monthly">
                    Recurring Payment Monthly
                  </option>
                  <option value="Recurring Payment Quarterly">
                    Recurring Payment Quarterly
                  </option>
                  <option value="Recurring Payment Half-Yearly">
                    Recurring Payment Half-Yearly
                  </option>
                  <option value="Recurring Payment Yearly">
                    Recurring Payment Yearly
                  </option>
                </select>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Attach File <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  multiple
                  required
                  onChange={handleFileInputChange}
                  className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-white
        focus:ring-2 focus:ring-blue-500
        file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />

                {/* ✅ Simplified file count display */}
                {files && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">
                      {files.length} {files.length === 1 ? "file" : "files"}{" "}
                      selected
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Level-1 Approver <span className="text-red-500">*</span>
                </label>
                <select
                  name="reportingTo"
                  value={formData.reportingTo}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value="" disabled>
                    Select Level-1 Approver
                  </option>
                  {reporting_Manager.map((manager) => (
                    <option
                      key={manager.email}
                      value={`${manager.name}|${manager.email}`}
                    >
                      {manager.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Level-2 Approver <span className="text-red-500">*</span>
                </label>
                <select
                  name="finance"
                  value={formData.finance}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value="" disabled>
                    Select Level-2 Approver
                  </option>
                  {Finance.map((manager) => (
                    <option
                      key={manager.email}
                      value={`${manager.name}|${manager.email}`}
                    >
                      {manager.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Level-3 Approver <span className="text-red-500">*</span>
                </label>
                <select
                  name="higher_authority"
                  value={formData.higher_authority}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value="" disabled>
                    Select Level-3 Approver
                  </option>
                  {Higher_authority.map((manager) => (
                    <option
                      key={manager.email}
                      value={`${manager.name}|${manager.email}`}
                    >
                      {manager.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Back
              </button>
            )}
            {step < totalSteps && (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Next
              </button>
            )}
            {step === totalSteps && (
              <button
                type="button"
                onClick={openPreview}
                disabled={isSubmitted}
                className={`px-6 py-2 rounded text-white ${
                  isSubmitted
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Preview & Submit
              </button>
            )}
          </div>
        </form>

        {/* Preview Modal */}
        {isPreviewOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsPreviewOpen(false)}
          >
            <div
              className="bg-white rounded-lg shadow-lg p-8 max-w-5xl w-full relative"
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: "85vh", overflowY: "auto" }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
                🧾 Preview Your Purchase Request
              </h2>

              <div ref={previewRef} className="space-y-6 text-gray-700">
                {/* Grid Layout for Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                  <div>
                    <strong>📍 Location:</strong> {formData.location}
                  </div>
                  <div>
                    <strong>📦 Product Category:</strong>{" "}
                    {formData.productCategory}
                  </div>

                  <div>
                    <strong>🛒 Product Name:</strong> {formData.productName}
                  </div>
                  <div>
                    <strong>🔢 Quantity:</strong> {formData.quantity}
                  </div>

                  <div>
                    <strong>💰 Unit Price:</strong> {currency}{" "}
                    {formData.unitPrice}
                  </div>
                  <div>
                    <strong>💵 Total Cost:</strong> {currency}{" "}
                    {formData.approxCost}
                  </div>

                  <div>
                    <strong>📝 Expected Date:</strong> {formData.expectedDate}
                  </div>
                  <div>
                    <strong>🏷️ Purchase Type:</strong> {formData.purchaseType}
                  </div>

                  <div>
                    <strong>💳 Payment Type:</strong> {formData.paymentType}
                  </div>
                  <div>
                    <strong>🧑‍💼 Level-1 Approver:</strong>{" "}
                    {(formData.reportingTo || "").split("|")[0]}
                  </div>

                  <div>
                    <strong>💼 Level-2 Approver:</strong>{" "}
                    {(formData.finance || "").split("|")[0]}
                  </div>
                  <div>
                    <strong>🏛️ Level-3 Approver:</strong>{" "}
                    {(formData.higher_authority || "").split("|")[0]}
                  </div>
                </div>

                {/* Description & Reason Section */}
                <div className="mt-6 border-t pt-4 space-y-3">
                  <div>
                    <strong className="text-gray-800">
                      🧾 Product Description:
                    </strong>
                    <p className="mt-1 bg-gray-50 p-3 rounded">
                      {formData.productDescription}
                    </p>
                  </div>
                  <div>
                    <strong className="text-gray-800">
                      🎯 Purchase Reason:
                    </strong>
                    <p className="mt-1 bg-gray-50 p-3 rounded">
                      {formData.productReason}
                    </p>
                  </div>
                  {formData.comment && (
                    <div>
                      <strong className="text-gray-800">💬 Comment:</strong>
                      <p className="mt-1 bg-gray-50 p-3 rounded">
                        {formData.comment}
                      </p>
                    </div>
                  )}
                </div>

                {/* Files Section */}
                <div className="mt-6 border-t pt-4">
                  <strong className="text-gray-800">📎 Files Attached:</strong>
                  <ul className="list-disc list-inside mt-2 text-gray-600">
                    {files && files.length > 0 ? (
                      [...files].map((file, i) => <li key={i}>{file.name}</li>)
                    ) : (
                      <li>None</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end space-x-4 mt-8 border-t pt-4">
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={downloadPDF}
                  className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  📥 Download PDF
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitted}
                  className={`px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition ${
                    isSubmitted ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  {isSubmitted ? "Submitting..." : "✅ Confirm Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
