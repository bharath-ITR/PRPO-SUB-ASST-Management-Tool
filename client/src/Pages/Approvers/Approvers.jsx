import React, { useEffect, useState, useRef } from "react";

import axios from "axios";
import { Tooltip, Checkbox, TablePagination, Modal, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getApprovers } from "../../redux/Action";
import CheckIcon from "@mui/icons-material/Check";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import CloseIcon from "@mui/icons-material/Close";
import MultipleStopOutlinedIcon from "@mui/icons-material/MultipleStopOutlined";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { Search } from "@mui/icons-material";
import ApprovalDetailsModal from "./ApproversModal";
import CommentModal from "./CommentModal";
import CommentModalNew from "./CommentModalNew";
import POForm from "../../Pages/POCreation/POForm";
import { toast } from "react-toastify";
import GrInvoiceModal from "../Approvers/GrInvoiceModal";
import ActivityLogModal from "./ActivityLogModal";
import { FaClockRotateLeft } from "react-icons/fa6";

const Approvers = () => {
  const apiUrl = process.env.REACT_APP_API;
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const [openCommentIndex, setOpenCommentIndex] = useState(false);
  const [isError, setIsError] = useState("");
  const [results, setResults] = useState();
  const [formattedFromDate, setFormattedFromDate] = useState(null);
  const [formattedToDate, setFormattedToDate] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]); // Array to store selected rows
  const [openCommentBox, setOpenCommentBox] = useState(false); // Array to store selected rows
  const [loading, setLoading] = useState(false); // To track loading state
  const [approveOrRejectLoading, setApproveOrRejectLoading] = useState(false); // To track loading state
  const [showInvoiceUpload, setShowInvoiceUpload] = useState(false);
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);
  const [selectedPrNo, setSelectedPrNo] = useState(null);
  const [receiptAmount, setReceiptAmount] = useState("");
  const [selectedApproval, setSelectedApproval] = useState(null); // Modal
  const [openPOForm, setOpenPOForm] = useState(false);
  const [selectedPR, setSelectedPR] = useState(null);
  const [receiptFiles, setReceiptFiles] = useState([]);
  const [page, setPage] = useState(0); // zero-based index
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [activePR, setActivePR] = useState(null);
  const [paymentprocessType, setPaymentProcessType] = useState("");
  const [activePaymentPrNo, setActivePaymentPrNo] = useState(null);
  const [showPOActions, setShowPOActions] = useState(false);
  const [poQuantity, setPoQuantity] = useState("");
  const [showPOInvoiceModal, setShowPOInvoiceModal] = useState(false);
  const [poFile, setPOFile] = useState(null);
  const [referenceNo, setReferenceNo] = useState("");
  const [poUpdateComment, setPoUpdateComment] = useState("");
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  const [prNo, setPrNo] = React.useState(""); // store PR number

  const handleOpenPOForm = (pr) => {
    setSelectedPR(pr);
    setOpenPOForm(true);
  };

  const { approvers } = useSelector((state) => state.getApprovers);
  const userName = useSelector(
    (state) => state.user.user?.name || state.admin?.name
  );
  const userEmail = useSelector(
    (state) => state.user.user?.email || state.admin?.email
  );

  const userRole = useSelector(
    (state) => state.user.user?.role || state.admin?.role
  );

  const handleOpenModal = (prNo) => {
    setActivePR(prNo);
    setIsCommentModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCommentModalOpen(false);
    setComment("");
    setError("");
  };
  // Debounced filter values

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        getApprovers(
          userEmail,
          page + 1,
          rowsPerPage,
          search,
          formattedFromDate,
          formattedToDate
        )
      );
      setResults(response?.data);
      setTotalCount(response?.totalRecords);
    } finally {
      setLoading(false);
    }
  };

  // Debounce helper
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const [isDebouncing, setIsDebouncing] = useState(false); // new state

    useEffect(() => {
      setIsDebouncing(true); // start loader when value changes

      const handler = setTimeout(() => {
        setDebouncedValue(value);
        setIsDebouncing(false); // stop loader when debounce finishes
      }, delay);

      return () => clearTimeout(handler);
    }, [value, delay]);

    return [debouncedValue, isDebouncing]; // return loading state too
  };

  // Debounced filter values
  const [debouncedSearch, isSearchDebouncing] = useDebounce(search, 3000);
  const [debouncedToDate, isDateDebouncing] = useDebounce(
    formattedToDate,
    3000
  );

  // Debounced filter values

  // Single useEffect for all fetches
  useEffect(() => {
    if (!userEmail) return;
    fetchData();
  }, [userEmail, page, rowsPerPage, debouncedSearch, debouncedToDate]);

  useEffect(() => {
    setResults(approvers);
  }, [approvers]);

  const handleViewAttachment = async (file) => {
    try {
      const response = await axios.post(
        `${apiUrl}/attachment/${file.filename}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to get SAS URL");
      }

      const { sasUrl } = response.data;

      // ✅ Open in a new tab
      window.open(sasUrl, "_blank");
    } catch (err) {
      console.error("Error opening attachment:", err);
      alert("Failed to open file. Please try again.");
    }
  };

  // Modified submit handler
  const handleGrAction = async (formValues) => {
    const {
      prNo,

      grQuantity,

      grPartially,

      grFully,

      receiptFiles,

      invoiceQuantity,

      invoicePartially,

      invoiceFully,

      invoiceFiles,
    } = formValues;

    try {
      const formData = new FormData();

      formData.append("PR_no", prNo);

      formData.append("grQuantity", grQuantity || 0);

      formData.append("grPartially", grPartially);

      formData.append("grFully", grFully);

      formData.append("invoiceQuantity", invoiceQuantity || 0);

      formData.append("invoicePartially", invoicePartially);

      formData.append("invoiceFully", invoiceFully);

      // Add user info instead of token

      formData.append("userEmail", userEmail);

      formData.append("userName", userName);

      if (receiptFiles?.length > 0)
        receiptFiles.forEach((file) => formData.append("receiptFiles", file));

      if (invoiceFiles?.length > 0)
        invoiceFiles.forEach((file) => formData.append("invoiceFiles", file));

      await axios.post(`${apiUrl}/Gr-InvoiceAction`, formData);

      toast.success(" GR & Invoice data submitted successfully!");

      setShowInvoiceUpload(false);

      fetchData();
    } catch (err) {
      console.error("❌ GR/Invoice action failed:", err.response || err);

      alert("❌ Something went wrong while submitting data.");
    }
  };

  const handlePOAction = async (
    actionType,
    prNo,
    file = null,
    poQuantity = ""
  ) => {
    try {
      const formData = new FormData();

      formData.append("PR_no", prNo);

      // Add user email & name

      formData.append("userEmail", userEmail);

      formData.append("userName", userName);

      if (poQuantity) {
        formData.append("poQuantity", poQuantity);
      }

      if (poUpdateComment) {
        formData.append("POupdateComment", poUpdateComment);
      }

      if (actionType === "poInvoiceUpload" && file) {
        formData.append("poInvoice", "true");

        formData.append("attachment", file);
      }

      if (actionType === "poDone") {
        formData.append("poDone", "true");
      }

      await axios.post(`${apiUrl}/POAction`, formData);

      toast.success(
        actionType === "poInvoiceUpload"
          ? "PO Invoice uploaded successfully!"
          : "PO marked as done!"
      );

      fetchData();

      setShowPOActions(false);

      setShowPOInvoiceModal(false);

      setPoUpdateComment("");
    } catch (err) {
      console.error("❌ PO action failed:", err.response || err);

      alert("❌ Something went wrong.");
    }
  };

  const handleReceiptUpload = async (prNo) => {
    try {
      // Files required
      if (!receiptFiles.length) {
        alert("⚠️ Please select at least one receipt file to upload.");
        return;
      }

      // Amount required
      if (!receiptAmount) {
        alert("⚠️ Please enter the receipt amount.");
        return;
      }

      // NEW: Payment type (fully / partially) is mandatory
      if (!paymentprocessType) {
        alert(
          "⚠️ Please select a payment type: Full Payment or Partial Payment."
        );
        return;
      }

      const formData = new FormData();
      formData.append("PR_no", prNo);
      formData.append("receiptUpload", "true");
      formData.append("receiptAmount", receiptAmount);
      formData.append("referenceNo", referenceNo);
      formData.append("paymentprocessType", paymentprocessType);
      // Add user email & user name
      formData.append("userEmail", userEmail);
      formData.append("userName", userName);

      receiptFiles.forEach((file) => {
        formData.append("attachment", file);
      });

      await axios.post(`${apiUrl}/PaymentAction`, formData);

      toast.success("Receipt uploaded successfully!");

      // Reset local UI state BEFORE reload/close
      setReceiptFiles([]);
      setReceiptAmount("");
      setReferenceNo("");
      setShowReceiptUpload(false);

      // If you still want to refresh data from server:
      window.location.reload();
    } catch (err) {
      console.error("❌ Receipt upload failed:", err.response || err);
      alert("❌ Something went wrong while uploading the receipt.");
    }
  };

  const handleApproveWithComment = async (singlePR) => {
    console.log(singlePR);
    try {
      setApproveOrRejectLoading(true); // Set loading to true when the function starts executing

      if (selectedRows.length > 1) {
        for (let PR_no of selectedRows) {
          console.log("PR_no", PR_no);
          const currentUserApprover = approvers?.data?.filter(
            (pr) => pr.PR_no === PR_no
          );
          if (currentUserApprover[0]) {
            let selectedApprover = null;

            for (const report of currentUserApprover[0]
              .reportingToAndSupervisor) {
              if (report.sendTo === userEmail && !report.response) {
                selectedApprover = report;
                break;
              }
            }

            if (selectedApprover) {
              const token = selectedApprover.tokens?.approve;

              if (comment.length === 0) {
                setIsError("please fill out the box");
                setApproveOrRejectLoading(false); // Set loading to false on error
                return;
              }

              await axios.post(`${apiUrl}/action`, {
                action: "approved",
                token,
                comment,
              });

              setOpenCommentIndex(null);
              // alert(`Request for PR No. ${currentUserApprover[0].PR_no} has been successfully approved`);
            }
          }
        }
        toast.success(`Selected PR's has been successfully approved`);
        window.location.reload();
      } else {
        const currentUserApprover = approvers?.data?.filter(
          (pr) => pr.PR_no === singlePR
        );
        if (currentUserApprover[0]) {
          let selectedApprover = null;

          for (const report of currentUserApprover[0]
            .reportingToAndSupervisor) {
            if (report.sendTo === userEmail && !report.response) {
              selectedApprover = report;
              break;
            }
          }

          if (selectedApprover) {
            const token = selectedApprover.tokens?.approve;

            if (comment.length === 0) {
              setIsError("please fill out the box");
              setApproveOrRejectLoading(false); // Set loading to false on error
              return;
            }

            await axios.post(`${apiUrl}/action`, {
              action: "approved",
              token,
              comment,
            });

            setOpenCommentIndex(null);
            toast.success(
              `Request for PR No. ${currentUserApprover[0].PR_no} has been successfully approved`
            );
            window.location.reload();
          }
        }
      }
    } catch (error) {
      console.error("Error during action:", error);
      setIsError("An error occurred. Please try again.");
    } finally {
      setApproveOrRejectLoading(false);
    }
  };

  const handleRejectWithComment = async (index) => {
    console.log("Index-reject", index);

    try {
      setApproveOrRejectLoading(true); // Set loading to true when the function starts executing

      // If multiple PRs are selected (selectedRows contains more than one PR)
      if (selectedRows.length > 1) {
        // Loop through the selected PRs
        for (let PR_no of selectedRows) {
          console.log("PR_no", PR_no);
          const currentUserApprover = approvers?.data?.filter(
            (pr) => pr.PR_no === PR_no
          );

          if (currentUserApprover[0]) {
            let selectedApprover = null;

            // Find the selected approver from reportingToAndSupervisor array
            for (const report of currentUserApprover[0]
              .reportingToAndSupervisor) {
              if (report.sendTo === userEmail && !report.response) {
                selectedApprover = report;
                break;
              }
            }

            if (selectedApprover) {
              const token = selectedApprover.tokens?.reject;

              // Check if the comment is empty
              if (comment.length === 0) {
                setIsError("Please fill out the box");
                setApproveOrRejectLoading(false); // Set loading to false on error
                return;
              }

              // Send the rejection action with token and comment to the backend
              await axios.post(`${apiUrl}/action`, {
                action: "rejected",
                token,
                comment,
              });

              setOpenCommentIndex(null);
              // Optionally, you can show a message for each rejection in the loop
              // alert(`Request for PR No. ${currentUserApprover[0].PR_no} has been rejected`);
            }
          }
        }

        toast.success(`Selected PRs have been successfully rejected`);
        window.location.reload();
      } else {
        // Handle rejection for a single PR
        const currentUserApprover = approvers?.data?.filter(
          (pr) => pr.PR_no === index
        );
        if (currentUserApprover[0]) {
          let selectedApprover = null;

          // Find the selected approver from reportingToAndSupervisor array
          for (const report of currentUserApprover[0]
            .reportingToAndSupervisor) {
            if (report.sendTo === userEmail && !report.response) {
              selectedApprover = report;
              break;
            }
          }

          if (selectedApprover) {
            const token = selectedApprover.tokens?.reject;

            // Check if the comment is empty
            if (comment.length === 0) {
              setIsError("Please fill out the box");
              setApproveOrRejectLoading(false); // Set loading to false on error
              return;
            }

            // Send the rejection action with token and comment to the backend
            await axios.post(`${apiUrl}/action`, {
              action: "rejected",
              token,
              comment,
            });

            setOpenCommentIndex(null);
            toast.success(
              `Request for PR No. ${currentUserApprover[0].PR_no} has been rejected`
            );
            window.location.reload();
          }
        }
      }
    } catch (error) {
      console.error("Error during rejection:", error);
      setIsError("An error occurred. Please try again.");
    } finally {
      setApproveOrRejectLoading(false); // Set loading to false after the function completes (success or error)
    }
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case "pending for approval":
        // Soft amber — waiting
        return "bg-amber-100 text-amber-800";

      case "in process":
        // Light orange — action in motion
        return "bg-orange-100 text-orange-800";

      case "processing":
        // Blue — steady workflow
        return "bg-sky-100 text-sky-800";

      case "approved":
        // Bright green — strong approval signal
        return "bg-green-100 text-green-800";

      case "Ready For Purchase":
        // Teal — distinct from green, transitional phase
        return "bg-teal-100 text-teal-800";

      case "GR Completed":
        // Custom teal-blue — user-requested color
        return "bg-green-100 text-green-900"; // we'll use your custom bg inline

      case "PO Raised":
        // Indigo — documentation stage
        return "bg-indigo-100 text-indigo-800";

      case "completed":
      case "Completed":
        // Emerald replaced with lime — cleaner, more distinct from green
        return "bg-green-200 text-lime-800";

      case "rejected":
        // Red — clear rejection/error state
        return "bg-rose-100 text-rose-800";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleClose = () => {
    setOpenCommentIndex(false);
    setOpenCommentBox(false);
  };

  const handleChange = (e) => {
    setSearch(e.target.value); // just update search state
  };

  const toggleRow = (index) => {
    setExpandedRows((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleFromDate = (e) => {
    const formatted = e.target.value;
    setFormattedFromDate(formatted ? new Date(formatted) : null);
  };

  const handleToDate = (e) => {
    const formatted = e.target.value;
    setFormattedToDate(formatted ? new Date(formatted) : null);
  };

  const handleDateResetButton = () => {
    console.log("Clicked Date Reset Button");
    setFormattedFromDate(null);
    setFormattedToDate(null);
  };

  const truncateFileName = (fileName, length = 15) => {
    return fileName.length > length
      ? `${fileName.slice(0, length)}...`
      : fileName;
  };

  const handleRowSelect = (index, PR_no) => {
    setSelectedRows(
      (prevSelectedRows) =>
        prevSelectedRows.includes(PR_no)
          ? prevSelectedRows.filter((prNo) => prNo !== PR_no) // Deselect by PR_no
          : [...prevSelectedRows, PR_no] // Select by PR_no
    );
  };
  const getDeviation = (approve) => {
    const approx =
      Number(approve?.body?.approxCost?.replace(/[^0-9.-]+/g, "")) || 0;
    const receiptRaw = approve?.receiptAmount;

    // If receipt amount missing, show N/A
    if (receiptRaw === null || receiptRaw === undefined || receiptRaw === "") {
      return {
        value: "N/A",
        color: "text-gray-500",
      };
    }

    const receipt = Number(receiptRaw) || 0;
    const deviation = receipt - approx;

    // 👇 Handle case where receiptAmount is 0
    if (receipt === 0) {
      return {
        value: "0",
        color: "text-gray-800",
      };
    }

    // Normal deviation logic
    return {
      value: deviation > 0 ? `+${deviation}` : `${deviation}`,
      color:
        deviation > 0
          ? "text-green-600"
          : deviation < 0
          ? "text-red-600"
          : "text-gray-800",
    };
  };

  const openActivityModal = (e, approve) => {
    e.stopPropagation();
    setActivityLogs(approve.activityLog || []);
    setPrNo(approve.PR_no || "");
    setShowActivityModal(true);
  };
  return (
    <div className="relative flex flex-col min-h-[100vh] max-w-7xl mx-auto p-4 md:p-4 ">
      {/* Top Bar: Heading + Filters */}
      <div className="flex justify-between items-center mb-3 mt-16">
        {/* Heading */}
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
          Approvals
        </h2>

        {/* Right side: Filters + Search + Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-600 font-medium">Filter by Date</p>

            <input
              type="date"
              value={
                formattedFromDate
                  ? formattedFromDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => handleFromDate(e)}
              className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <MultipleStopOutlinedIcon className="text-gray-500" />

            <input
              type="date"
              value={
                formattedToDate
                  ? formattedToDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => handleToDate(e)}
              className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <RestartAltRoundedIcon
              className="cursor-pointer text-gray-500 hover:text-blue-600"
              onClick={handleDateResetButton}
            />
          </div>

          {/* Search Bar + Conditional Action Button */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Bar */}
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search By Requisition Name"
                onChange={(e) => handleChange(e)}
                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm sm:text-base
          focus:outline-none focus:ring-2 focus:ring-blue-500
          dark:bg-gray-700 dark:text-gray-100"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500 dark:text-gray-100" />
            </div>

            {/* Show Action Button Only When Rows Selected */}
            {selectedRows.length > 1 && (
              <>
                <button
                  className="bg-green-600 text-white text-sm px-4 py-2 rounded-md hover:bg-green-700 transition-all"
                  onClick={() => setOpenCommentBox(true)}
                >
                  Action
                </button>

                <CommentModal
                  isOpen={openCommentBox}
                  onClose={handleClose}
                  comment={comment}
                  setComment={setComment}
                  error={isError}
                  loading={approveOrRejectLoading}
                  onApprove={() => handleApproveWithComment(selectedRows)}
                  onReject={() => handleRejectWithComment(selectedRows)}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto overflow-y-auto max-h-[100vh] flex-grow">
          <table className="w-full table-auto min-w-[900px] border border-gray-300 rounded-lg overflow-hidden dark:border-gray-700 dark:border-gray-100">
            <thead>
              <tr className="sticky top-0 bg-blue-800 text-gray-100 text-xs md:text-sm dark:bg-gray-700 dark:text-gray-100">
                <th className="py-2 px-3 text-center">S/N</th>
                <th className="py-2 px-3 text-center">PR/N</th>
                <th className="py-2 px-3 text-center">Product Name</th>
                {/* <th className="py-2 px-3 text-center">Product Description</th> */}
                <th className="py-2 px-3 text-center">Cost</th>
                <th className="py-2 px-3 text-center">Requestor</th>
                <th className="py-2 px-3 text-center">Created Date</th>
                <th className="py-2 px-3 text-center">Office</th>
                <th className="py-2 px-3 text-center">Status</th>
                <th className="py-2 px-3 text-center">Action</th>
                <th className="py-2 px-3 text-center">Deviation</th>

                <th className="py-2 px-3 text-center">View</th>
                <th className="py-2 px-3 text-center">Activity</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {results?.data && results?.data.length > 0 ? (
                results?.data?.map((approve, index) => (
                  <React.Fragment key={approve._id}>
                    <Tooltip
                      title={
                        approve.isBlocked
                          ? `Cancelled By ${approve.body?.sender_name ||
                              "Unknown"}`
                          : ""
                      }
                      arrow
                      disableHoverListener={!approve.isBlocked}
                    >
                      <tr
                        style={{ border: "1px solid #dedada", height: "20px" }}
                        className={`transition-colors ${
                          approve.isBlocked
                            ? "bg-red-50 text-red-600 cursor-not-allowed"
                            : "hover:bg-blue-50 cursor-pointer"
                        } ${expandedRows[index] ? "expanded" : ""}`}
                      >
                        <td className="py-2 px-1">
                          <div className="flex items-center justify-center whitespace-nowrap">
                            <Checkbox
                              checked={selectedRows.includes(approve.PR_no)}
                              onChange={() =>
                                handleRowSelect(index, approve.PR_no)
                              }
                              size="small"
                              disabled={approve.isBlocked}
                              sx={{
                                "&.Mui-checked": { color: "green" },
                                transform: "scale(0.8)",
                              }}
                            />
                            <span>{page * rowsPerPage + index + 1}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-center">
                          {approve.PR_no}
                        </td>

                        {/* Product Name */}
                        <td className="py-3 px-4 text-center truncate max-w-[150px]">
                          <Tooltip title={approve.body?.productName} arrow>
                            <span>
                              {truncateFileName(approve.body?.productName, 20)}
                            </span>
                          </Tooltip>
                        </td>

                        {/* Product Description */}
                        {/* <td className="py-3 px-4 text-center truncate max-w-[200px]">
                          <Tooltip
                            title={approve.body?.productDescription}
                            arrow
                          >
                            <span>
                              {truncateFileName(
                                approve.body?.productDescription,
                                20
                              )}
                            </span>
                          </Tooltip>
                        </td> */}

                        {/* <td className="py-3 px-4 text-center">
                          {approve.body?.approxCost}
                        </td> */}
                        <td className="py-3 px-4 text-center">
                          {(() => {
                            const cost = approve.body?.approxCost || "";
                            let symbol = "";
                            let amount = cost;

                            if (cost.startsWith("USD")) {
                              symbol = "$";
                              amount = cost.replace("USD", "").trim();
                            } else if (cost.startsWith("INR")) {
                              symbol = "₹";
                              amount = cost.replace("INR", "").trim();
                            } else if (cost.startsWith("AED")) {
                              symbol = "د.إ";
                              amount = cost.replace("AED", "").trim();
                            }

                            const displayValue = `${symbol} ${amount}`;

                            return (
                              <span
                                className="font-medium text-gray-700 block max-w-[120px] truncate mx-auto"
                                title={displayValue} // Tooltip with full value
                              >
                                {displayValue}
                              </span>
                            );
                          })()}
                        </td>

                        {/* 
                        <td className="py-3 px-4 text-center truncate max-w-[155px]">
                          <Tooltip title={approve.body?.sender_name} arrow>
                            <span>
                              {truncateFileName(approve.body?.sender_name, 20)}
                            </span>
                          </Tooltip>
                        </td> */}

                        <td className="py-3 px-4 text-center truncate max-w-[155px]">
                          <Tooltip
                            title={approve.body?.sender_name || ""}
                            arrow
                          >
                            <span>
                              {(() => {
                                const fullName =
                                  approve.body?.sender_name || "";
                                const initials = fullName
                                  .split(" ")
                                  .map((word) => word[0]?.toUpperCase())
                                  .join("");
                                return initials;
                              })()}
                            </span>
                          </Tooltip>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {approve.body?.currentDate
                            ? (() => {
                                const parts = approve.body.currentDate.split(
                                  /[\/\-]/
                                ); // split by / or -
                                let month, day, year;

                                if (parts[0].length === 4) {
                                  // YYYY/MM/DD
                                  year = parts[0];
                                  month = parts[1];
                                  day = parts[2];
                                } else if (parseInt(parts[0]) > 12) {
                                  // DD/MM/YYYY
                                  day = parts[0];
                                  month = parts[1];
                                  year = parts[2];
                                } else {
                                  // MM/DD/YYYY
                                  month = parts[0];
                                  day = parts[1];
                                  year = parts[2];
                                }

                                const formattedDate = new Date(
                                  `${year}-${month}-${day}`
                                );
                                return formattedDate.toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "2-digit",
                                    year: "numeric",
                                  }
                                );
                              })()
                            : "N/A"}
                        </td>

                        <td className="py-3 px-4 text-center">
                          {approve.body?.location}
                        </td>
                        <td className="py-1 px-2 text-center">
                          {(() => {
                            let statusText = "";

                            if (approve.paymentprocessType === "fully") {
                              statusText = "Completed";
                            } else if (
                              approve.paymentprocessType === "partially"
                            ) {
                              statusText = "Partially Paid";
                            } else if (
                              approve.grFully &&
                              approve.invoiceFully
                            ) {
                              statusText = "GR Completed";
                            } else if (
                              approve.grPartially ||
                              approve.invoicePartially
                            ) {
                              statusText = approve.status || "";
                            } else if (
                              approve.isPOcreated ||
                              approve.poDone ||
                              approve.poInvoice
                            ) {
                              statusText = "PO Raised";
                            } else {
                              statusText = approve.status || "";
                            }

                            // Format Title Case
                            const displayText = statusText
                              .toString()
                              .replace(/_/g, " ")
                              .split(" ")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() +
                                  word.slice(1).toLowerCase()
                              )
                              .join(" ");

                            return (
                              <span
                                title={displayText}
                                className={`inline-block px-3 py-1 text-xs font-medium rounded-full max-w-[120px] truncate ${getStatusClassName(
                                  statusText
                                )}`}
                              >
                                {displayText}
                              </span>
                            );
                          })()}
                        </td>

                        <td className="py-3 px-4 text-center align-top relative">
                          {/* ===== Before Ready For Purchase → Approver Actions ===== */}
                          {(() => {
                            const approvals =
                              approve.reportingToAndSupervisor || [];

                            // Check if all 3 approvers approved
                            const allApproved =
                              approvals.length > 0 &&
                              approvals.every((r) => r.response === "approved");

                            // If all approved → show NOTHING
                            if (allApproved) {
                              return null;
                            }

                            // Otherwise normal behavior
                            return approvals.map((report, reportIndex) => {
                              if (userEmail === report.sendTo) {
                                if (report.response) {
                                  return (
                                    <div
                                      key={reportIndex}
                                      className="flex justify-center items-center mt-2"
                                    >
                                      {report.response === "approved" ? (
                                        <CheckIcon className="text-green-600" />
                                      ) : report.response === "rejected" ? (
                                        <CloseIcon className="text-red-600" />
                                      ) : null}
                                    </div>
                                  );
                                }

                                // Compute if previous approver rejected
                                const isFirstApproverRejected = approvals
                                  .slice(0, reportIndex)
                                  .some((r) => r.response === "rejected");

                                return (
                                  <div
                                    key={reportIndex}
                                    className="flex justify-center items-center mt-1"
                                  >
                                    {!isFirstApproverRejected &&
                                      !approve.isBlocked && (
                                        <button
                                          onClick={() =>
                                            handleOpenModal(approve.PR_no)
                                          }
                                          className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-md text-xs font-medium shadow-sm transition-all"
                                        >
                                          Action
                                        </button>
                                      )}

                                    <CommentModalNew
                                      isOpen={isCommentModalOpen}
                                      onClose={handleCloseModal}
                                      comment={comment}
                                      setComment={setComment}
                                      error={error}
                                      loading={approveOrRejectLoading}
                                      onApprove={() =>
                                        handleApproveWithComment(activePR)
                                      }
                                      onReject={() =>
                                        handleRejectWithComment(activePR)
                                      }
                                    />
                                  </div>
                                );
                              }
                              return null;
                            });
                          })()}

                          {/* ===== When Ready For Purchase → Progress Tracker ===== */}
                          {(() => {
                            const approvals =
                              approve.reportingToAndSupervisor || [];

                            // show PO / GR / Payment only after all 3 approvals
                            const allThreeApproved =
                              approvals.length === 3 &&
                              approvals.every((r) => r.response === "approved");

                            if (!allThreeApproved) {
                              return null; // hide everything until all 3 approved
                            }

                            return (
                              <div className="flex flex-col items-center gap-2 mt-1">
                                {/* Step Tracker */}
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                                  <span
                                    className={`flex items-center gap-1 ${
                                      approve.status === "Ready For Purchase" ||
                                      approve.isPOcreated ||
                                      approve.poDone ||
                                      approve.poInvoice
                                        ? "text-green-600"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    <CheckIcon sx={{ fontSize: 14 }} />
                                    Approved
                                  </span>

                                  <span className="text-gray-400">›</span>
                                  <span
                                    className={`flex items-center gap-1 ${
                                      approve.isPOcreated ||
                                      approve.poDone ||
                                      approve.poInvoice
                                        ? "text-green-600"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    <CheckIcon sx={{ fontSize: 14 }} />
                                    PO Done
                                  </span>

                                  <span className="text-gray-400">›</span>
                                  <span
                                    className={`flex items-center gap-1 ${
                                      approve.invoiceFully && approve.grFully
                                        ? "text-green-600"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    <CheckIcon sx={{ fontSize: 14 }} />
                                    GR Done
                                  </span>

                                  <span className="text-gray-400">›</span>
                                  <span
                                    className={`flex items-center gap-1 ${
                                      approve.receiptUpload
                                        ? approve.paymentprocessType === "fully"
                                          ? "text-green-600" // full payment = green
                                          : "text-amber-500" // partial = amber/orange
                                        : "text-gray-400" // no payment yet
                                    }`}
                                  >
                                    <CheckIcon sx={{ fontSize: 14 }} />
                                    {approve.receiptUpload
                                      ? approve.paymentprocessType === "fully"
                                        ? "Payment Done"
                                        : "Partially Paid"
                                      : "Payment Pending"}
                                  </span>
                                </div>

                                {/* Action Buttons */}
                                {userRole === "admin" && (
                                  <div className="flex flex-col items-center gap-2 mt-2 relative">
                                    {/* PO Create */}
                                    {!(
                                      approve.isPOcreated ||
                                      approve.poDone ||
                                      approve.poInvoice
                                    ) &&
                                      (() => {
                                        // Parse PR currentDate
                                        let prDate;
                                        if (approve.body?.currentDate) {
                                          const parts = approve.body.currentDate.split(
                                            /[\/\-]/
                                          ); // split by / or -
                                          let month, day, year;

                                          if (parts[0].length === 4) {
                                            // YYYY/MM/DD
                                            year = parts[0];
                                            month = parts[1];
                                            day = parts[2];
                                          } else if (
                                            parseInt(parts[0], 10) > 12
                                          ) {
                                            // DD/MM/YYYY
                                            day = parts[0];
                                            month = parts[1];
                                            year = parts[2];
                                          } else {
                                            // MM/DD/YYYY
                                            month = parts[0];
                                            day = parts[1];
                                            year = parts[2];
                                          }

                                          prDate = new Date(
                                            `${year}-${month}-${day}`
                                          );
                                        }

                                        // FIXED CUTOFF DATE: 1 Dec 2025
                                        const cutoffDate = new Date(
                                          "2025-12-02"
                                        );
                                        cutoffDate.setHours(0, 0, 0, 0);

                                        // Only show PO Actions for PRs dated 1 Dec 2025 or later
                                        if (!prDate || prDate < cutoffDate) {
                                          return null;
                                        }

                                        return (
                                          <>
                                            {/* PO Actions Button */}
                                            <button
                                              onClick={() => {
                                                console.log(
                                                  "👉 PR No for PO Actions:",
                                                  approve.PR_no
                                                );
                                                setShowPOActions(true);
                                                setActivePR(approve); // <-- set active PR here
                                              }}
                                              className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs px-3 py-1 rounded-md shadow-sm transition-all"
                                            >
                                              PO Actions
                                            </button>

                                            {/* PO Actions Modal */}
                                            <Modal
                                              open={showPOActions}
                                              onClose={() =>
                                                setShowPOActions(false)
                                              }
                                              aria-labelledby="po-actions-modal"
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backdropFilter: "blur(2px)",
                                              }}
                                            >
                                              <Box
                                                sx={{
                                                  bgcolor: "background.paper",
                                                  borderRadius: 2,
                                                  boxShadow: 24,
                                                  p: 3,
                                                  width: "420px",
                                                  maxWidth: "95vw",
                                                }}
                                              >
                                                <h3 className="text-lg font-semibold mb-3 text-center">
                                                  PO Actions
                                                </h3>

                                                {/* Quantity Field */}
                                                <div className="mb-4">
                                                  <label className="block text-sm font-medium mb-1">
                                                    Quantity (Optional)
                                                  </label>
                                                  <input
                                                    type="number"
                                                    placeholder="Enter quantity"
                                                    value={poQuantity}
                                                    onChange={(e) =>
                                                      setPoQuantity(
                                                        e.target.value
                                                      )
                                                    }
                                                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                                  />
                                                </div>

                                                {/* Comment Field */}
                                                <div className="mb-4">
                                                  <label className="block text-sm font-medium mb-1">
                                                    Comment
                                                  </label>
                                                  <textarea
                                                    placeholder="Enter comment"
                                                    value={poUpdateComment}
                                                    onChange={(e) =>
                                                      setPoUpdateComment(
                                                        e.target.value
                                                      )
                                                    }
                                                    className="w-full border border-gray-300 rounded-md p-2 text-sm h-20"
                                                  />
                                                </div>

                                                <div className="flex items-center justify-center gap-3 flex-wrap">
                                                  {/* PO Create */}
                                                  <button
                                                    onClick={() => {
                                                      handleOpenPOForm(
                                                        activePR
                                                      );
                                                      setShowPOActions(false);
                                                    }}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-md shadow-sm transition-all"
                                                  >
                                                    PO Create
                                                  </button>

                                                  <span>or</span>

                                                  {/* Upload PO Image */}
                                                  <button
                                                    onClick={() => {
                                                      setSelectedPrNo(
                                                        activePR?.PR_no
                                                      );
                                                      setShowPOInvoiceModal(
                                                        true
                                                      );
                                                      setShowPOActions(false);
                                                    }}
                                                    className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-md shadow-sm transition-all"
                                                  >
                                                    Upload PO Image
                                                  </button>

                                                  <span>or</span>

                                                  {/* PO Not Required */}
                                                  <button
                                                    onClick={async () => {
                                                      await handlePOAction(
                                                        "poDone",
                                                        activePR?.PR_no,
                                                        null,
                                                        poQuantity
                                                      );
                                                      setShowPOActions(false);
                                                      setPoQuantity(""); // reset
                                                    }}
                                                    className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded-md shadow-sm transition-all"
                                                  >
                                                    PO Not Required
                                                  </button>
                                                </div>
                                              </Box>
                                            </Modal>

                                            {/* PO Create Modal */}
                                            <Modal
                                              open={openPOForm}
                                              onClose={() =>
                                                setOpenPOForm(false)
                                              }
                                              aria-labelledby="po-form-modal"
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backdropFilter: "blur(2px)",
                                              }}
                                            >
                                              <Box
                                                sx={{
                                                  bgcolor: "background.paper",
                                                  borderRadius: 2,
                                                  boxShadow: 24,
                                                  p: 2,
                                                  width: "90%",
                                                  maxWidth: "95vw",
                                                  maxHeight: "90vh",
                                                  overflowY: "auto",
                                                }}
                                              >
                                                {selectedPR && (
                                                  <POForm
                                                    prData={selectedPR}
                                                    onClose={() =>
                                                      setOpenPOForm(false)
                                                    }
                                                  />
                                                )}
                                              </Box>
                                            </Modal>

                                            {/* Upload PO Image Modal */}
                                            <Modal
                                              open={showPOInvoiceModal}
                                              onClose={() =>
                                                setShowPOInvoiceModal(false)
                                              }
                                              aria-labelledby="po-invoice-modal"
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backdropFilter: "blur(2px)",
                                              }}
                                            >
                                              <Box
                                                sx={{
                                                  bgcolor: "background.paper",
                                                  borderRadius: 2,
                                                  boxShadow: 24,
                                                  p: 3,
                                                  width: "400px",
                                                  maxWidth: "90vw",
                                                }}
                                              >
                                                <h3 className="text-lg font-semibold mb-3">
                                                  Upload PO Image
                                                </h3>

                                                <input
                                                  type="file"
                                                  onChange={(e) =>
                                                    setPOFile(e.target.files[0])
                                                  }
                                                  className="mb-3"
                                                />

                                                <button
                                                  onClick={async () => {
                                                    if (!poFile)
                                                      return alert(
                                                        "Select a file first!"
                                                      );
                                                    console.log(
                                                      "📦 Uploading PO Image for PR No:",
                                                      selectedPrNo
                                                    );
                                                    await handlePOAction(
                                                      "poInvoiceUpload",
                                                      selectedPrNo,
                                                      poFile,
                                                      poQuantity
                                                    );
                                                    setPoQuantity("");
                                                    setShowPOInvoiceModal(
                                                      false
                                                    );
                                                    setPOFile(null);
                                                  }}
                                                  className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-md shadow-sm transition-all"
                                                >
                                                  Upload
                                                </button>
                                              </Box>
                                            </Modal>
                                          </>
                                        );
                                      })()}

                                    {/* ===== GR / Invoice Section ===== */}
                                    {(approve.isPOcreated ||
                                      approve.poDone ||
                                      approve.poInvoice) &&
                                      !(
                                        approve.invoiceFully && approve.grFully
                                      ) && (
                                        <div className="relative inline-block">
                                          {/* Button */}
                                          <button
                                            onClick={() => {
                                              setSelectedPrNo(approve.PR_no);
                                              setShowInvoiceUpload(true);
                                            }}
                                            className="bg-amber-100 text-amber-700 px-3 py-1 rounded-md text-xs hover:bg-amber-200 transition-all flex items-center gap-1"
                                          >
                                            GR / Invoice
                                          </button>

                                          {showInvoiceUpload && (
                                            <GrInvoiceModal
                                              selectedPrNo={selectedPrNo}
                                              onClose={() =>
                                                setShowInvoiceUpload(false)
                                              }
                                              onSubmit={handleGrAction}
                                            />
                                          )}
                                        </div>
                                      )}

                                    {/* ===== Payment Process Button ===== */}
                                    {(approve.isPOcreated ||
                                      approve.poDone ||
                                      approve.poInvoice) &&
                                      approve.invoiceFully &&
                                      approve.grFully &&
                                      approve.paymentprocessType !==
                                        "fully" && (
                                        <div className="relative inline-block">
                                          {activePaymentPrNo !==
                                          approve.PR_no ? (
                                            <button
                                              onClick={() => {
                                                setSelectedPrNo(approve.PR_no);
                                                setShowReceiptUpload(true);
                                              }}
                                              className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1 rounded-md text-xs font-medium 
  hover:from-amber-500 hover:to-amber-600 transition-all duration-300 shadow-sm hover:shadow-md"
                                            >
                                              Payment Process
                                            </button>
                                          ) : (
                                            <div
                                              className="absolute left-0 -top-28 bg-white border border-gray-200 rounded-md shadow-lg 
          w-[160px] text-sm z-50 animate-fadeIn"
                                            >
                                              {/* ✅ Full Payment Option */}
                                              <button
                                                onClick={() => {
                                                  setPaymentProcessType(
                                                    "fully"
                                                  );
                                                  setSelectedPrNo(
                                                    approve.PR_no
                                                  );
                                                  setShowReceiptUpload(true);
                                                  setActivePaymentPrNo(null);
                                                }}
                                                className="block w-full px-3 py-1.5 hover:bg-blue-50 text-gray-700"
                                              >
                                                💰 Full Payment
                                              </button>

                                              {/* ✅ Partial Payment Option (disabled if already partial) */}
                                              <button
                                                onClick={() => {
                                                  if (
                                                    approve.paymentprocessType ===
                                                    "partially"
                                                  )
                                                    return;
                                                  setPaymentProcessType(
                                                    "partially"
                                                  );
                                                  setSelectedPrNo(
                                                    approve.PR_no
                                                  );
                                                  setShowReceiptUpload(true);
                                                  setActivePaymentPrNo(null);
                                                }}
                                                disabled={
                                                  approve.paymentprocessType ===
                                                  "partially"
                                                }
                                                className={`block w-full px-3 py-1.5 text-gray-700 ${
                                                  approve.paymentprocessType ===
                                                  "partially"
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : "hover:bg-blue-50"
                                                }`}
                                              >
                                                💵 Partial Payment
                                              </button>

                                              {/* ❌ Cancel Option */}
                                              <button
                                                onClick={() =>
                                                  setActivePaymentPrNo(null)
                                                }
                                                className="block w-full px-3 py-1.5 text-red-500 hover:bg-red-50"
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      )}

                                    {/* ===== Receipt Upload Modal ===== */}
                                    {showReceiptUpload && (
                                      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                                        <div className="bg-white p-5 rounded-lg shadow-lg w-[420px]">
                                          <h3 className="text-lg font-semibold text-center mb-4">
                                            Payment Process
                                          </h3>

                                          {/* Receipt Amount */}
                                          <input
                                            type="number"
                                            placeholder="Receipt Amount"
                                            value={receiptAmount}
                                            onChange={(e) =>
                                              setReceiptAmount(e.target.value)
                                            }
                                            className="w-full border border-gray-300 rounded-md p-2 mb-3 text-sm"
                                          />

                                          {/* Reference Number */}
                                          <input
                                            type="text"
                                            placeholder="Reference Number"
                                            value={referenceNo}
                                            onChange={(e) =>
                                              setReferenceNo(e.target.value)
                                            }
                                            className="w-full border border-gray-300 rounded-md p-2 mb-3 text-sm"
                                          />

                                          {/* File Upload */}
                                          <input
                                            type="file"
                                            multiple
                                            onChange={(e) =>
                                              setReceiptFiles(
                                                Array.from(e.target.files)
                                              )
                                            }
                                            className="w-full border border-gray-300 rounded-md p-2 mb-4 text-sm"
                                          />

                                          {/* Payment Type – CHECKBOXES SIDE BY SIDE */}
                                          <div className="flex justify-between mb-4">
                                            {/* Full Payment */}
                                            <label className="flex items-center gap-2 cursor-pointer">
                                              <input
                                                type="checkbox"
                                                checked={
                                                  paymentprocessType === "fully"
                                                }
                                                onChange={() =>
                                                  setPaymentProcessType("fully")
                                                }
                                              />
                                              <span>Full Payment</span>
                                            </label>

                                            {/* Partial Payment */}
                                            <label className="flex items-center gap-2 cursor-pointer">
                                              <input
                                                type="checkbox"
                                                checked={
                                                  paymentprocessType ===
                                                  "partially"
                                                }
                                                onChange={() =>
                                                  setPaymentProcessType(
                                                    "partially"
                                                  )
                                                }
                                              />
                                              <span>Partial Payment</span>
                                            </label>
                                          </div>

                                          {/* Buttons */}
                                          <div className="flex justify-center gap-3 mt-2">
                                            <button
                                              onClick={() =>
                                                handleReceiptUpload(
                                                  selectedPrNo
                                                )
                                              }
                                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                                            >
                                              Upload
                                            </button>

                                            <button
                                              onClick={() =>
                                                setShowReceiptUpload(false)
                                              }
                                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`font-semibold ${
                              getDeviation(approve).color
                            }`}
                          >
                            {getDeviation(approve).value}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <p
                            className="text-blue-500 hover:underline text-xs font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedApproval(approve);
                            }}
                          >
                            View Details
                          </p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            className="text-blue-800 hover:text-blue-700 text-xl cursor-pointer"
                            onClick={(e) => openActivityModal(e, approve)}
                            title="View Activity"
                          >
                            <FaClockRotateLeft />
                          </button>
                        </td>
                      </tr>
                    </Tooltip>
                  </React.Fragment>
                ))
              ) : (
                <p style={{ textAlign: "center" }}>No matching records found</p>
              )}
            </tbody>
          </table>
        </div>
      )}

      <TablePagination
        component="div"
        count={totalCount || 0}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 20, 40, 80]}
      />
      {selectedApproval && (
        <ApprovalDetailsModal
          approve={selectedApproval}
          setSelectedApproval={setSelectedApproval}
          handleViewAttachment={handleViewAttachment}
        />
      )}

      <ActivityLogModal
        open={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        activityLogs={activityLogs}
        prNo={prNo} // pass the PR number
      />
    </div>
  );
};

export default Approvers;
