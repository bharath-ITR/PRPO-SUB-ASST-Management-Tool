// import { useEffect, useState } from "react";
// import {
//   Button,
//   ListItemText,
//   MenuItem,
//   Select,
//   TextField,
//   styled,
// } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import "./POForm.css";
// import { Ship_to, Tax } from "../../Constant";
// import { useParams } from "react-router-dom";
// import { getRequestById, getRequests, getVendor } from "../../redux/Action";
// import axios from "axios";
// import PreviewPO from "../../components/PreviewPO/PreviewPO";

// const Field = styled(TextField)`
//   width: 23vw;
//   size: small;
//   & label {
//     z-index: auto;
//   }
// `;

// const DropDown = styled(Select)`
//   width: 23vw;
// `;

// const POForm = ({ prNo, onClose }) => {
//   console.log("prno", prNo);
//   const apiUrl = process.env.REACT_APP_API;
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (prNo) {
//       dispatch(getRequestById(prNo));
//     }
//     dispatch(getVendor());
//   }, [dispatch, prNo]);

//   const [selectedVendor, setSelectedVendor] = useState("");
//   const [vendorInfo, setVendorInfo] = useState({});
//   const [selectedShipping, setSelectedShipping] = useState("");
//   console.log(selectedShipping);
//   const [formData, setFormData] = useState({});
//   const [deliveryDate, setDeliveryDate] = useState("");
//   const [quotationNo, setQuotationNo] = useState("");
//   const [quotationDate, setQuotationDate] = useState("");
//   const [showPreview, setShowPreview] = useState(false); // Add state for preview visibility
//   const [shippingState, setShippingState] = useState("");
//   // Added state for delivery date
//   const { id } = useParams();
//   console.log("FormData:", formData);
//   const { request } = useSelector((state) => state.getDataById);
//   const { vendors, error } = useSelector((state) => state.getVendor);
//   const [tax, setTax] = useState();
//   useEffect(() => {
//     // dispatch(getRequests());
//     dispatch(getRequestById(id));
//     dispatch(getVendor()); // Fetch vendor data when the component mounts
//   }, [dispatch]);
//   console.log("request", request);
//   useEffect(() => {
//     if (request) {
//       console.log("FilterPOData:", request);
//       setFormData(request);
//     }
//   }, [request, id]);

//   const handleVendorChange = (event) => {
//     const selectedVendorValue = event.target.value;
//     setSelectedVendor(selectedVendorValue);

//     const [, vendorEmail] = selectedVendorValue.split("|");
//     const selectedVendorInfo = vendors.find(
//       (vendor) => vendor.primaryemail === vendorEmail
//     ); // Fetch vendor info from vendors list
//     setVendorInfo(selectedVendorInfo || {});
//   };
//   console.log("vendor", vendorInfo);

//   const handleShippingChange = (event) => {
//     const selectedShippingValue = event.target.value;
//     setSelectedShipping(selectedShippingValue);

//     const [address] = selectedShippingValue.split("|");
//     const selectedShippingInfo = Ship_to.find(
//       (ship) => ship.address === address
//     );
//     setShippingState(selectedShippingInfo?.state || "");

//     setFormData({
//       ...formData,
//       shippingAddress: address,
//       shippingState: selectedShippingInfo?.state || "", // Update the form data with shipping state
//       companyDetails: selectedShippingInfo, // Store the entire company data in the form
//     });
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;

//     if (
//       name === "location" ||
//       name === "purchaseType" ||
//       name === "paymentType"
//     ) {
//       setFormData({
//         ...formData,
//         body: {
//           ...formData.body,
//           [name]: value,
//         },
//       });
//     } else if (name === "body.expectedDate") {
//       setFormData({
//         ...formData,
//         body: {
//           ...formData.body,
//           expectedDate: value,
//         },
//       });
//     } else if (name === "deliveryDate") {
//       // Handle delivery date separately
//       setDeliveryDate(value);
//     } else {
//       const [topLevel, nested] = name.split(".");

//       if (nested) {
//         setFormData({
//           ...formData,
//           [topLevel]: {
//             ...formData[topLevel],
//             [nested]: value,
//           },
//         });
//       } else {
//         setFormData({
//           ...formData,
//           [name]: value,
//         });
//       }
//     }
//   };
//   const handleSubmit = async () => {
//     try {
//       const {
//         PR_no,
//         shippingAddress,
//         shippingState,
//         companyDetails, // Include company details in the data sent to backend
//         body: {
//           productName,
//           productDescription,
//           quantity,
//           location,
//           unitPrice,
//           approxCost,
//           totalAmount,
//           currency,
//           currentDate,
//           purchaseType,
//           paymentType,
//         } = {},
//       } = formData;
//       console.log("form", formData);
//       const {
//         name,
//         primaryemail,
//         street,
//         city,
//         area,
//         state,
//         companyname,
//         gstNo,
//         postalCode,
//       } = vendorInfo;

//       const fieldData = {
//         PR_no,
//         shippingAddress,
//         shippingState, // Include shipping state in the data sent to backend
//         companyDetails, // Include company details in the data sent to backend
//         productName,
//         productDescription,
//         quantity,
//         location,
//         unitPrice,
//         approxCost,
//         totalAmount,
//         currency,
//         currentDate,
//         purchaseType,
//         paymentType,
//         VendorCompanyName: companyname,
//         vendorName: name,
//         vendorEmail: primaryemail,
//         vendorGSTIN: gstNo,
//         vendorArea: area,
//         vendorStreet: street,
//         vendorCity: city,
//         vendorState: state,
//         vendorPostalCode: postalCode,
//         Tax: tax,
//         deliveryDate,
//         quotationNo,
//         quotationDate, // Include delivery date in the data sent to backend
//       };

//       if (Object.values(!fieldData).some((value) => !value)) {
//         alert("Please fill in all fields before submitting the form.");
//         return;
//       }

//       const response = await axios.post(`${apiUrl}/pocreation`, fieldData);
//       alert(response.data);
//       console.log("Success:", response.data);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div className="form_data">
//       <div className="form_data_wrapper">
//         <div className="itemss">
//           <div className="item_wrapper">
//             <div className="data_wrappers">
//               <div className="input-field">
//                 <Field
//                   size="small"
//                   type="text"
//                   id="standard-basic PRNo"
//                   name="PR_no"
//                   label="PR No."
//                   variant="outlined"
//                   value={formData.PR_no || ""}
//                   readOnly
//                 />
//               </div>
//               <div className="input-field">
//                 <Field
//                   size="small"
//                   type="text"
//                   id="standard-basic ProductName"
//                   label="Product name"
//                   variant="outlined"
//                   name="body.productName"
//                   value={formData.body?.productName || ""}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="input-field">
//                 <Field
//                   size="small"
//                   id="outlined-multiline-flexible"
//                   label="Product Description"
//                   multiline
//                   maxRows={4}
//                   type="text"
//                   name="body.productDescription"
//                   value={formData.body?.productDescription || ""}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="input-field">
//                 <Field
//                   size="small"
//                   id="standard-basic quantity"
//                   variant="outlined"
//                   type="text"
//                   label="Quantity"
//                   inputMode="numeric"
//                   name="body.quantity"
//                   value={formData.body?.quantity || ""}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="input-field">
//                 <DropDown
//                   size="small"
//                   labelId="Location-label"
//                   id="Location-select"
//                   value={formData.body?.location || ""}
//                   onChange={handleChange}
//                   name="location"
//                   displayEmpty
//                   required
//                 >
//                   <MenuItem value="" disabled>
//                     Select your location
//                   </MenuItem>
//                   <MenuItem value="India">India</MenuItem>
//                   <MenuItem value="US">U.S</MenuItem>
//                   <MenuItem value="Dubai">Dubai</MenuItem>
//                   <MenuItem value="All">All</MenuItem>
//                 </DropDown>
//               </div>
//               <div className="input-field">
//                 <Field
//                   size="small"
//                   id="standard-basic approxCost"
//                   label="Unit Price"
//                   variant="outlined"
//                   type="text"
//                   name="body.unitPrice"
//                   value={formData.body?.unitPrice || ""}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="input-field">
//                 <Field
//                   size="small"
//                   id="standard-basic approxCost"
//                   label="Approx Cost"
//                   variant="outlined"
//                   type="text"
//                   name="body.approxCost"
//                   value={formData.body?.approxCost || ""}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="input-field">
//                 <DropDown
//                   size="small"
//                   labelId="purchaseType-label"
//                   id="purchaseType-select"
//                   value={formData.body?.purchaseType || ""}
//                   onChange={handleChange}
//                   name="purchaseType"
//                   displayEmpty
//                   required
//                 >
//                   <MenuItem value="" disabled>
//                     Purchase Type
//                   </MenuItem>
//                   <MenuItem value="Office supplies">Office supplies</MenuItem>
//                   <MenuItem value="Activities">Activities</MenuItem>
//                   <MenuItem value="Product And Service">
//                     Product And Service
//                   </MenuItem>
//                   <MenuItem value="Capital Expenditure">
//                     Capital Expenditure
//                   </MenuItem>
//                   <MenuItem value="Others">Others</MenuItem>
//                 </DropDown>
//               </div>
//               <div className="input-field">
//                 <DropDown
//                   size="small"
//                   labelId="paymentType-label"
//                   id="paymentType-select"
//                   value={formData.body?.paymentType || ""}
//                   onChange={handleChange}
//                   name="paymentType"
//                   displayEmpty
//                   required
//                 >
//                   <MenuItem value="" disabled>
//                     Payment Type
//                   </MenuItem>
//                   <MenuItem value="One Time Payment">One Time Payment</MenuItem>
//                   <MenuItem value="Recurring Payment Monthly">
//                     Recurring Payment Monthly
//                   </MenuItem>
//                   <MenuItem value="Recurring Payment Quarterly">
//                     Recurring Payment Quarterly
//                   </MenuItem>
//                   <MenuItem value="Recurring Payment Half Yearly">
//                     Recurring Payment Half Yearly
//                   </MenuItem>
//                   <MenuItem value="Recurring Payment Yearly">
//                     Recurring Payment Yearly
//                   </MenuItem>
//                 </DropDown>
//               </div>
//               <div className="input-field">
//                 <Field
//                   size="small"
//                   id="standard-basic Delivery Date"
//                   label="Delivery Date"
//                   variant="outlined"
//                   type="date"
//                   name="deliveryDate"
//                   value={deliveryDate}
//                   onChange={handleChange}
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                 />
//               </div>
//               <div className="input-field">
//                 <Field
//                   size="small"
//                   id="standard-basic Quotation no"
//                   label="Quotation no"
//                   variant="outlined"
//                   type="text"
//                   name="quotationNo"
//                   value={quotationNo}
//                   onChange={(e) => setQuotationNo(e.target.value)}
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                 />
//               </div>
//               <div className="input-field">
//                 <Field
//                   size="small"
//                   id="standard-basic Quotation Date"
//                   label="Quotation Date"
//                   variant="outlined"
//                   type="date"
//                   name="quotationDate"
//                   value={quotationDate}
//                   onChange={(e) => setQuotationDate(e.target.value)}
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="vendor_wrapper">
//             <div className="input-field">
//               <DropDown
//                 size="small"
//                 labelId="ShippingAddress"
//                 id="ShippingAddress"
//                 name="ShippingAddress"
//                 displayEmpty
//                 required
//                 onChange={handleShippingChange}
//                 value={selectedShipping}
//               >
//                 <MenuItem value="" disabled>
//                   Select Shipping address
//                 </MenuItem>
//                 {Ship_to?.map((ship) => (
//                   <MenuItem
//                     key={ship.CompanyName}
//                     value={`${ship.address}|${ship.state}`}
//                   >
//                     <ListItemText primary={ship.CompanyName} />
//                   </MenuItem>
//                 ))}
//               </DropDown>
//             </div>
//             <div className="input-field">
//               <Field
//                 size="small"
//                 id="standard-basic shipping-state"
//                 label="Shipping State"
//                 variant="outlined"
//                 name="shippingState"
//                 value={shippingState}
//                 readOnly
//               />
//             </div>
//             <div className="input-field">
//               <DropDown
//                 size="small"
//                 labelId="Vendor"
//                 id="Vendor"
//                 name="Vendor"
//                 displayEmpty
//                 required
//                 onChange={handleVendorChange}
//                 value={selectedVendor}
//               >
//                 <MenuItem value="" disabled>
//                   Select Vendor
//                 </MenuItem>
//                 {vendors?.map((vendor) => (
//                   <MenuItem
//                     key={vendor.primaryemail}
//                     value={`${vendor.name}|${vendor.primaryemail}`}
//                   >
//                     <ListItemText primary={vendor.companyname} />
//                   </MenuItem>
//                 ))}
//               </DropDown>
//             </div>
//             <div className="input-field">
//               <Field
//                 size="small"
//                 type="text"
//                 id="standard-basic Address"
//                 label="Vendor Email"
//                 variant="outlined"
//                 value={vendorInfo.primaryemail || ""}
//                 readOnly
//               />
//             </div>
//             <div className="input-field">
//               <Field
//                 size="small"
//                 type="text"
//                 id="standard-basic Street"
//                 label="Vendor Address"
//                 variant="outlined"
//                 value={
//                   [
//                     vendorInfo.street,
//                     vendorInfo.area,
//                     vendorInfo.city,
//                     vendorInfo.state,
//                     vendorInfo.postalCode,
//                     vendorInfo.gstNo,
//                   ]
//                     .filter(Boolean)
//                     .join(", ") || ""
//                 }
//                 readOnly
//               />
//             </div>

//             <div className="input-field">
//               <DropDown
//                 size="small"
//                 labelId="Tax"
//                 id="Tax"
//                 name="Tax"
//                 displayEmpty
//                 required
//                 onChange={(e) => setTax(e.target.value)}
//                 value={tax}
//               >
//                 <MenuItem value="" disabled>
//                   Select Tax
//                 </MenuItem>
//                 {Tax?.map((tax) => (
//                   <MenuItem key={tax.tax} value={`${tax.tax}`}>
//                     <ListItemText primary={tax.tax} />
//                   </MenuItem>
//                 ))}
//               </DropDown>
//             </div>
//           </div>
//         </div>

//         <div className="submit-button-wrapper">
//           <Button variant="contained" onClick={() => setShowPreview(true)}>
//             Preview Purchase Order
//           </Button>

//           <Button variant="contained" onClick={handleSubmit}>
//             Create Purchase Order
//           </Button>
//         </div>
//         {showPreview && (
//           <PreviewPO
//             formData={formData}
//             vendorInfo={vendorInfo}
//             deliveryDate={deliveryDate}
//             quotationNo={quotationNo}
//             quotationDate={quotationDate}
//             tax={tax}
//             setShowPreview={setShowPreview}
//           />
//         )}

//         <Button variant="outlined" color="error" onClick={onClose}>
//           Close
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default POForm;

// import { useEffect, useState } from "react";
// import {
//   Button,
//   ListItemText,
//   MenuItem,
//   Select,
//   TextField,
// } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { Ship_to, Tax } from "../../Constant";
// import { useParams } from "react-router-dom";
// import { getRequestById, getVendor } from "../../redux/Action";
// import axios from "axios";
// import PreviewPO from "../../components/PreviewPO/PreviewPO";
// import CloseIcon from "@mui/icons-material/Close";

// const POForm = ({ prNo, onClose }) => {
//   console.log("prno", prNo);
//   const apiUrl = process.env.REACT_APP_API;
//   const dispatch = useDispatch();
//   const { id } = useParams();

//   const [selectedVendor, setSelectedVendor] = useState("");
//   const [vendorInfo, setVendorInfo] = useState({});
//   const [selectedShipping, setSelectedShipping] = useState("");
//   const [formData, setFormData] = useState({});
//   const [deliveryDate, setDeliveryDate] = useState("");
//   const [quotationNo, setQuotationNo] = useState("");
//   const [quotationDate, setQuotationDate] = useState("");
//   const [showPreview, setShowPreview] = useState(false);
//   const [shippingState, setShippingState] = useState("");
//   const [tax, setTax] = useState();

//   const { request } = useSelector((state) => state.getDataById);
//   const { vendors } = useSelector((state) => state.getVendor);

//   useEffect(() => {
//     if (prNo) dispatch(getRequestById(prNo));
//     dispatch(getVendor());
//   }, [dispatch, prNo]);

//   useEffect(() => {
//     dispatch(getRequestById(id));
//     dispatch(getVendor());
//   }, [dispatch]);

//   useEffect(() => {
//     if (request) setFormData(request);
//   }, [request, id]);

//   const handleVendorChange = (event) => {
//     const selectedVendorValue = event.target.value;
//     setSelectedVendor(selectedVendorValue);
//     const [, vendorEmail] = selectedVendorValue.split("|");
//     const selectedVendorInfo = vendors.find(
//       (vendor) => vendor.primaryemail === vendorEmail
//     );
//     setVendorInfo(selectedVendorInfo || {});
//   };

//   const handleShippingChange = (event) => {
//     const selectedShippingValue = event.target.value;
//     setSelectedShipping(selectedShippingValue);
//     const [address] = selectedShippingValue.split("|");
//     const selectedShippingInfo = Ship_to.find(
//       (ship) => ship.address === address
//     );
//     setShippingState(selectedShippingInfo?.state || "");
//     setFormData({
//       ...formData,
//       shippingAddress: address,
//       shippingState: selectedShippingInfo?.state || "",
//       companyDetails: selectedShippingInfo,
//     });
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;

//     if (
//       name === "location" ||
//       name === "purchaseType" ||
//       name === "paymentType"
//     ) {
//       setFormData({
//         ...formData,
//         body: {
//           ...formData.body,
//           [name]: value,
//         },
//       });
//     } else if (name === "body.expectedDate") {
//       setFormData({
//         ...formData,
//         body: {
//           ...formData.body,
//           expectedDate: value,
//         },
//       });
//     } else if (name === "deliveryDate") {
//       setDeliveryDate(value);
//     } else {
//       const [topLevel, nested] = name.split(".");
//       if (nested) {
//         setFormData({
//           ...formData,
//           [topLevel]: {
//             ...formData[topLevel],
//             [nested]: value,
//           },
//         });
//       } else {
//         setFormData({
//           ...formData,
//           [name]: value,
//         });
//       }
//     }
//   };

//  const handleSubmit = async () => {
//     try {
//       const {
//         PR_no,
//         shippingAddress,
//         shippingState,
//         companyDetails,
//         body: {
//           productName,
//           productDescription,
//           quantity,
//           location,
//           unitPrice,
//           approxCost,
//           totalAmount,
//           currency,
//           currentDate,
//           purchaseType,
//           paymentType,
//         } = {},
//       } = formData;

//       const {
//         name,
//         primaryemail,
//         street,
//         city,
//         area,
//         state,
//         companyname,
//         gstNo,
//         postalCode,
//       } = vendorInfo;

//       const fieldData = {
//         PR_no,
//         shippingAddress,
//         shippingState,
//         companyDetails,
//         productName,
//         productDescription,
//         quantity,
//         location,
//         unitPrice,
//         approxCost,
//         totalAmount,
//         currency,
//         currentDate,
//         purchaseType,
//         paymentType,
//         VendorCompanyName: companyname,
//         vendorName: name,
//         vendorEmail: primaryemail,
//         vendorGSTIN: gstNo,
//         vendorArea: area,
//         vendorStreet: street,
//         vendorCity: city,
//         vendorState: state,
//         vendorPostalCode: postalCode,
//         Tax: tax,
//         deliveryDate,
//         quotationNo,
//         quotationDate,
//       };

//       if (Object.values(fieldData).some((value) => !value)) {
//         alert("Please fill in all fields before submitting the form.");
//         return;
//       }

//       const response = await axios.post(`${apiUrl}/pocreation`, fieldData);
//       alert(response.data);
//       onClose();
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div className="bg-white shadow-lg rounded-md p-8 w-full max-w-7xl text-sm">
//       <div className="flex justify-between items-center mb-6 relative">
//         <h2 className="text-xl font-semibold text-gray-800 text-center flex-1">
//           Purchase Order Form
//         </h2>

//         <CloseIcon
//           onClick={onClose}
//           className="cursor-pointer text-orange-700 bg-orange-100 hover:bg-red-100 hover:text-red-600
//                rounded-full p-1 transition-all shadow-sm"
//           fontSize="medium"
//         />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//         {/* Left Form Section */}
//         <TextField
//           size="small"
//           type="text"
//           label="PR No."
//           variant="outlined"
//           value={formData.PR_no || ""}
//           InputProps={{ style: { fontSize: "0.875rem" } }}
//           InputLabelProps={{ style: { fontSize: "0.75rem" } }}
//           readOnly
//         />
//         <TextField
//           size="small"
//           label="Product Name"
//           name="body.productName"
//           variant="outlined"
//           value={formData.body?.productName || ""}
//           onChange={handleChange}
//           InputProps={{ style: { fontSize: "0.875rem" } }}
//           InputLabelProps={{ style: { fontSize: "0.75rem" } }}
//         />
//         <TextField
//           size="small"
//           label="Product Description"
//           multiline
//           maxRows={4}
//           name="body.productDescription"
//           variant="outlined"
//           value={formData.body?.productDescription || ""}
//           onChange={handleChange}
//           InputProps={{ style: { fontSize: "0.875rem" } }}
//           InputLabelProps={{ style: { fontSize: "0.75rem" } }}
//         />
//         <TextField
//           size="small"
//           label="Quantity"
//           variant="outlined"
//           name="body.quantity"
//           value={formData.body?.quantity || ""}
//           onChange={handleChange}
//           InputProps={{ style: { fontSize: "0.875rem" } }}
//           InputLabelProps={{ style: { fontSize: "0.75rem" } }}
//         />
//         <Select
//           size="small"
//           value={formData.body?.location || ""}
//           onChange={handleChange}
//           name="location"
//           displayEmpty
//           sx={{ fontSize: "0.875rem" }}
//         >
//           <MenuItem value="" disabled>
//             Select Location
//           </MenuItem>
//           <MenuItem value="India">India</MenuItem>
//           <MenuItem value="US">U.S</MenuItem>
//           <MenuItem value="Dubai">Dubai</MenuItem>
//           <MenuItem value="All">All</MenuItem>
//         </Select>

//         <TextField
//           size="small"
//           label="Unit Price"
//           variant="outlined"
//           name="body.unitPrice"
//           value={formData.body?.unitPrice || ""}
//           onChange={handleChange}
//           InputProps={{ style: { fontSize: "0.875rem" } }}
//           InputLabelProps={{ style: { fontSize: "0.75rem" } }}
//         />

//         <TextField
//           size="small"
//           label="Approx Cost"
//           variant="outlined"
//           name="body.approxCost"
//           value={formData.body?.approxCost || ""}
//           onChange={handleChange}
//           InputProps={{ style: { fontSize: "0.875rem" } }}
//           InputLabelProps={{ style: { fontSize: "0.75rem" } }}
//         />

//         <Select
//           size="small"
//           value={formData.body?.purchaseType || ""}
//           onChange={handleChange}
//           name="purchaseType"
//           displayEmpty
//           sx={{ fontSize: "0.875rem" }}
//         >
//           <MenuItem value="" disabled>
//             Purchase Type
//           </MenuItem>
//           <MenuItem value="Office supplies">Office supplies</MenuItem>
//           <MenuItem value="Activities">Activities</MenuItem>
//           <MenuItem value="Product And Service">Product And Service</MenuItem>
//           <MenuItem value="Capital Expenditure">Capital Expenditure</MenuItem>
//           <MenuItem value="Others">Others</MenuItem>
//         </Select>

//         <Select
//           size="small"
//           value={formData.body?.paymentType || ""}
//           onChange={handleChange}
//           name="paymentType"
//           displayEmpty
//           sx={{ fontSize: "0.875rem" }}
//         >
//           <MenuItem value="" disabled>
//             Payment Type
//           </MenuItem>
//           <MenuItem value="One Time Payment">One Time Payment</MenuItem>
//           <MenuItem value="Recurring Payment Monthly">
//             Recurring Payment Monthly
//           </MenuItem>
//           <MenuItem value="Recurring Payment Quarterly">
//             Recurring Payment Quarterly
//           </MenuItem>
//           <MenuItem value="Recurring Payment Half Yearly">
//             Recurring Payment Half Yearly
//           </MenuItem>
//           <MenuItem value="Recurring Payment Yearly">
//             Recurring Payment Yearly
//           </MenuItem>
//         </Select>

//         <TextField
//           size="small"
//           label="Delivery Date"
//           type="date"
//           name="deliveryDate"
//           value={deliveryDate}
//           onChange={handleChange}
//           InputLabelProps={{ shrink: true, style: { fontSize: "0.75rem" } }}
//           InputProps={{ style: { fontSize: "0.875rem" } }}
//         />

//         <TextField
//           size="small"
//           label="Quotation No"
//           type="text"
//           value={quotationNo}
//           onChange={(e) => setQuotationNo(e.target.value)}
//           InputProps={{ style: { fontSize: "0.875rem" } }}
//           InputLabelProps={{ style: { fontSize: "0.75rem" } }}
//         />

//         <TextField
//           size="small"
//           label="Quotation Date"
//           type="date"
//           value={quotationDate}
//           onChange={(e) => setQuotationDate(e.target.value)}
//           InputLabelProps={{ shrink: true, style: { fontSize: "0.75rem" } }}
//           InputProps={{ style: { fontSize: "0.875rem" } }}
//         />

//         {/* Right Form Section */}
//         <Select
//           size="small"
//           displayEmpty
//           onChange={handleShippingChange}
//           value={selectedShipping}
//           sx={{ fontSize: "0.875rem" }}
//         >
//           <MenuItem value="" disabled>
//             Select Shipping Address
//           </MenuItem>
//           {Ship_to?.map((ship) => (
//             <MenuItem
//               key={ship.CompanyName}
//               value={`${ship.address}|${ship.state}`}
//             >
//               <ListItemText primary={ship.CompanyName} />
//             </MenuItem>
//           ))}
//         </Select>

//         <TextField
//           size="small"
//           label="Shipping State"
//           variant="outlined"
//           value={shippingState}
//           readOnly
//           InputProps={{ style: { fontSize: "0.875rem" } }}
//           InputLabelProps={{ style: { fontSize: "0.75rem" } }}
//         />

//         <Select
//           size="small"
//           displayEmpty
//           onChange={handleVendorChange}
//           value={selectedVendor}
//           sx={{ fontSize: "0.875rem" }}
//         >
//           <MenuItem value="" disabled>
//             Select Vendor
//           </MenuItem>
//           {vendors?.map((vendor) => (
//             <MenuItem
//               key={vendor.primaryemail}
//               value={`${vendor.name}|${vendor.primaryemail}`}
//             >
//               <ListItemText primary={vendor.companyname} />
//             </MenuItem>
//           ))}
//         </Select>

//         <TextField
//           size="small"
//           label="Vendor Email"
//           value={vendorInfo.primaryemail || ""}
//           readOnly
//           InputProps={{ style: { fontSize: "0.875rem" } }}
//           InputLabelProps={{ style: { fontSize: "0.75rem" } }}
//         />

//         <TextField
//           size="small"
//           label="Vendor Address"
//           value={
//             [
//               vendorInfo.street,
//               vendorInfo.area,
//               vendorInfo.city,
//               vendorInfo.state,
//               vendorInfo.postalCode,
//               vendorInfo.gstNo,
//             ]
//               .filter(Boolean)
//               .join(", ") || ""
//           }
//           readOnly
//           InputProps={{ style: { fontSize: "0.875rem" } }}
//           InputLabelProps={{ style: { fontSize: "0.75rem" } }}
//         />

//         <Select
//           size="small"
//           displayEmpty
//           onChange={(e) => setTax(e.target.value)}
//           value={tax}
//           sx={{
//             fontSize: "0.875rem",
//             color: tax ? "inherit" : "#9e9e9e", // gray when placeholder
//           }}
//           renderValue={(selected) => {
//             if (!selected) {
//               return <span style={{ color: "#000000" }}>Select Tax</span>;
//             }
//             return selected;
//           }}
//         >
//           <MenuItem value="" disabled>
//             Select Tax
//           </MenuItem>
//           {Tax?.map((tax) => (
//             <MenuItem key={tax.tax} value={tax.tax}>
//               <ListItemText primary={tax.tax} />
//             </MenuItem>
//           ))}
//         </Select>
//       </div>

//       <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm">
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => setShowPreview(true)}
//           sx={{ fontSize: "0.75rem" }}
//         >
//           Preview Purchase Order
//         </Button>
//         <Button
//           variant="contained"
//           color="success"
//           onClick={handleSubmit}
//           sx={{ fontSize: "0.75rem" }}
//         >
//           Create Purchase Order
//         </Button>
//         <Button
//           variant="outlined"
//           color="error"
//           onClick={onClose}
//           sx={{ fontSize: "0.75rem" }}
//         >
//           Close
//         </Button>
//       </div>

//       {showPreview && (
//         <PreviewPO
//           formData={formData}
//           vendorInfo={vendorInfo}
//           deliveryDate={deliveryDate}
//           quotationNo={quotationNo}
//           quotationDate={quotationDate}
//           tax={tax}
//           setShowPreview={setShowPreview}
//         />
//       )}
//     </div>
//   );
// };

// export default POForm;
import { useEffect, useState } from "react";
import {
  Button,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  styled,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Ship_to, Tax } from "../../Constant";
import { useParams } from "react-router-dom";
import { getRequestById, getVendor } from "../../redux/Action";
import axios from "axios";
import PreviewPO from "../../components/PreviewPO/PreviewPO";
import "./POForm.css";

const Field = styled(TextField)`
  width: 100%;
  & label {
    z-index: auto;
  }
`;

const DropDown = styled(Select)`
  width: 100%;
`;

const POForm = ({ onClose, prData }) => {
  const apiUrl = process.env.REACT_APP_API;

  const [selectedVendor, setSelectedVendor] = useState("");
  const [vendorInfo, setVendorInfo] = useState({});
  const [selectedShipping, setSelectedShipping] = useState("");
  const [formData, setFormData] = useState({});
  const [deliveryDate, setDeliveryDate] = useState("");
  const [quotationNo, setQuotationNo] = useState("");
  const [quotationDate, setQuotationDate] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [shippingState, setShippingState] = useState("");
  const [tax, setTax] = useState("");

  const { id } = useParams();
  const dispatch = useDispatch();
  const { request } = useSelector((state) => state.getDataById);
  const { vendors } = useSelector((state) => state.getVendor);
  useEffect(() => {
    // Fetch vendors always
    dispatch(getVendor());

    // If opened via /poform/:id (route)
    if (id) {
      dispatch(getRequestById(id));
    }

    // If opened from modal with PR data
    if (prData) {
      setFormData(prData);
    }
  }, [dispatch, id, prData]);

  useEffect(() => {
    // Prefill if loaded via Redux
    if (request && !prData) {
      setFormData(request);
    }
  }, [request, prData]);

  const handleVendorChange = (event) => {
    const selectedVendorValue = event.target.value;
    setSelectedVendor(selectedVendorValue);
    const [, vendorEmail] = selectedVendorValue.split("|");
    const selectedVendorInfo = vendors.find(
      (vendor) => vendor.primaryemail === vendorEmail
    );
    setVendorInfo(selectedVendorInfo || {});
  };

  const handleShippingChange = (event) => {
    const selectedShippingValue = event.target.value;
    setSelectedShipping(selectedShippingValue);
    const [address] = selectedShippingValue.split("|");
    const selectedShippingInfo = Ship_to.find(
      (ship) => ship.address === address
    );
    setShippingState(selectedShippingInfo?.state || "");

    setFormData({
      ...formData,
      shippingAddress: address,
      shippingState: selectedShippingInfo?.state || "",
      companyDetails: selectedShippingInfo,
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (
      name === "location" ||
      name === "purchaseType" ||
      name === "paymentType"
    ) {
      setFormData({
        ...formData,
        body: {
          ...formData.body,
          [name]: value,
        },
      });
    } else if (name === "deliveryDate") {
      setDeliveryDate(value);
    } else {
      const [topLevel, nested] = name.split(".");
      if (nested) {
        setFormData({
          ...formData,
          [topLevel]: {
            ...formData[topLevel],
            [nested]: value,
          },
        });
      } else {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const {
        PR_no,
        shippingAddress,
        shippingState,
        companyDetails,
        body: {
          productName,
          productDescription,
          quantity,
          location,
          unitPrice,
          approxCost,
          purchaseType,
          paymentType,
          currency,
        } = {},
      } = formData;

      const {
        name,
        primaryemail,
        street,
        city,
        area,
        state,
        companyname,
        gstNo,
        postalCode,
      } = vendorInfo;

      const fieldData = {
        PR_no,
        shippingAddress,
        shippingState,
        companyDetails,
        productName,
        productDescription,
        quantity,
        location,
        unitPrice,
        currency,
        approxCost,
        purchaseType,
        paymentType,
        VendorCompanyName: companyname,
        vendorName: name,
        vendorEmail: primaryemail,
        vendorGSTIN: gstNo,
        vendorArea: area,
        vendorStreet: street,
        vendorCity: city,
        vendorState: state,
        vendorPostalCode: postalCode,
        Tax: tax,
        deliveryDate,
        quotationNo,
        quotationDate,
      };

      const response = await axios.post(`${apiUrl}/pocreation`, fieldData);
      alert(response.data);
      onClose();
      
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-xl font-semibold text-gray-800">
          Purchase Order Form
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition"
          title="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Form Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Section */}
        <div className="space-y-4">
          <Field
            label="PR No."
            value={formData.PR_no || ""}
            size="small"
            readOnly
          />

          <Field
            label="Product Name"
            name="body.productName"
            value={formData.body?.productName || ""}
            onChange={handleChange}
            size="small"
          />

          <Field
            label="Product Description"
            name="body.productDescription"
            multiline
            maxRows={3}
            value={formData.body?.productDescription || ""}
            onChange={handleChange}
            size="small"
          />

          <Field
            label="Quantity"
            name="body.quantity"
            type="number"
            value={formData.body?.quantity || ""}
            onChange={handleChange}
            size="small"
          />

          <DropDown
            name="location"
            value={formData.body?.location || ""}
            onChange={handleChange}
            size="small"
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Location
            </MenuItem>
            <MenuItem value="India">India</MenuItem>
            <MenuItem value="US">US</MenuItem>
            <MenuItem value="Dubai">Dubai</MenuItem>
          </DropDown>

          <Field
            label="Unit Price"
            name="body.unitPrice"
            value={formData.body?.unitPrice || ""}
            onChange={handleChange}
            size="small"
          />

          <Field
            label="Approx Cost"
            name="body.approxCost"
            value={formData.body?.approxCost || ""}
            onChange={handleChange}
            size="small"
          />

          <DropDown
            name="purchaseType"
            value={formData.body?.purchaseType || ""}
            onChange={handleChange}
            size="small"
            displayEmpty
          >
            <MenuItem value="" disabled>
              Purchase Type
            </MenuItem>
            <MenuItem value="Office supplies">Office supplies</MenuItem>
            <MenuItem value="Activities">Activities</MenuItem>
            <MenuItem value="Product And Service">Product And Service</MenuItem>
            <MenuItem value="Capital Expenditure">Capital Expenditure</MenuItem>
          </DropDown>

          <DropDown
            name="paymentType"
            value={formData.body?.paymentType || ""}
            onChange={handleChange}
            size="small"
            displayEmpty
          >
            <MenuItem value="" disabled>
              Payment Type
            </MenuItem>
            <MenuItem value="One Time Payment">One Time Payment</MenuItem>
            <MenuItem value="Recurring Payment Monthly">
              Recurring Monthly
            </MenuItem>
            <MenuItem value="Recurring Payment Yearly">
              Recurring Yearly
            </MenuItem>
          </DropDown>
        </div>

        {/* Right Section */}
        <div className="space-y-4">
          <DropDown
            name="ShippingAddress"
            value={selectedShipping}
            onChange={handleShippingChange}
            size="small"
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Shipping Address
            </MenuItem>
            {Ship_to.map((ship) => (
              <MenuItem
                key={ship.CompanyName}
                value={`${ship.address}|${ship.state}`}
              >
                <ListItemText primary={ship.CompanyName} />
              </MenuItem>
            ))}
          </DropDown>

          <Field
            label="Shipping State"
            value={shippingState}
            size="small"
            readOnly
          />

          <DropDown
            name="Vendor"
            value={selectedVendor}
            onChange={handleVendorChange}
            size="small"
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Vendor
            </MenuItem>
            {vendors.map((vendor) => (
              <MenuItem
                key={vendor.primaryemail}
                value={`${vendor.name}|${vendor.primaryemail}`}
              >
                <ListItemText primary={vendor.companyname} />
              </MenuItem>
            ))}
          </DropDown>

          <Field
            label="Vendor Email"
            value={vendorInfo.primaryemail || ""}
            size="small"
            readOnly
          />

          <Field
            label="Vendor Address"
            value={
              [
                vendorInfo.street,
                vendorInfo.area,
                vendorInfo.city,
                vendorInfo.state,
                vendorInfo.postalCode,
                vendorInfo.gstNo,
              ]
                .filter(Boolean)
                .join(", ") || ""
            }
            size="small"
            readOnly
          />

          <DropDown
            name="Tax"
            value={tax}
            onChange={(e) => setTax(e.target.value)}
            size="small"
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Tax
            </MenuItem>
            {Tax.map((tax) => (
              <MenuItem key={tax.tax} value={tax.tax}>
                <ListItemText primary={tax.tax} />
              </MenuItem>
            ))}
          </DropDown>
          <Field
            label="Quotation No"
            name="quotationNo"
            value={quotationNo}
            onChange={(e) => setQuotationNo(e.target.value)}
            size="small"
          />

          <Field
            label="Quotation Date"
            type="date"
            name="quotationDate"
            value={quotationDate}
            onChange={(e) => setQuotationDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <Field
            label="Delivery Date"
            type="date"
            name="deliveryDate"
            value={deliveryDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 justify-end border-t pt-4">
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setShowPreview(true)}
          className="!capitalize"
        >
          Preview
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          className="!capitalize"
        >
          Create Purchase Order
        </Button>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewPO
          formData={formData}
          vendorInfo={vendorInfo}
          deliveryDate={deliveryDate}
          quotationNo={quotationNo}
          quotationDate={quotationDate}
          tax={tax}
          setShowPreview={setShowPreview}
        />
      )}
    </div>
  );
};

export default POForm;
