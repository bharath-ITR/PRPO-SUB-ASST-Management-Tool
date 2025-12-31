import React, { useEffect, useState, useRef } from "react";
import { TablePagination, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getReports } from "../../redux/Action";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import MultipleStopOutlinedIcon from "@mui/icons-material/MultipleStopOutlined";
import ExportToExcel from "./Export";
import PRTOPDF from "../../components/PRToPDF/PRTOPDF";
import axios from "axios";
import AdminTableModal from "./AdminTableModal"; // 👈 import your existing modal
import { Search } from "@mui/icons-material";

const AdminTable = () => {
  const apiUrl = process.env.REACT_APP_API;
  const dispatch = useDispatch();

  const { Requests = [] } = useSelector((state) => state.getRequestReports);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [results, setResults] = useState();
  const [formattedFromDate, setFormattedFromDate] = useState(null);
  const [formattedToDate, setFormattedToDate] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const searchTimeoutRef = useRef(null);

  const [openModal, setOpenModal] = useState(false);
  const [selectedRequestData, setSelectedRequestData] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const from = formattedFromDate
      ? formattedFromDate.toISOString().split("T")[0]
      : "";
    const to = formattedToDate
      ? formattedToDate.toISOString().split("T")[0]
      : "";
    dispatch(getReports(page + 1, rowsPerPage, search, from, to, statusFilter));
  }, [dispatch, page, rowsPerPage, formattedToDate, statusFilter]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => {
      const from = formattedFromDate
        ? formattedFromDate.toISOString().split("T")[0]
        : "";
      const to = formattedToDate
        ? formattedToDate.toISOString().split("T")[0]
        : "";
      dispatch(getReports(page + 1, rowsPerPage, value, from, to));
    }, 3000);
  };

  useEffect(() => {
    if (selectAll) {
      setSelectedRequests(Requests?.data?.map((req) => req.PR_no));
    } else {
      setSelectedRequests([]);
    }
  }, [selectAll, Requests]);

  useEffect(() => {
    if (Requests?.totalRecords !== undefined) {
      setTotalCount(Requests.totalRecords);
    }
  }, [Requests]);

  const getStatusClassName = (status) => {
    switch (status) {
      case "pending for approval":
        return "bg-yellow-100 text-yellow-800";
      case "in process":
        return "bg-orange-100 text-orange-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "Ready For Purchase":
        return "bg-indigo-100 text-indigo-800";
      case "invoice full":
        return "bg-green-200 text-green-900";
      case "Completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "";
    }
  };

  const handleViewAttachment = async (file) => {
    try {
      const response = await axios.post(
        `${apiUrl}/attachment/${file.filename}`
      );
      if (response.status !== 200) throw new Error("Failed to get SAS URL");
      const { sasUrl } = response.data;
      window.open(sasUrl, "_blank");
    } catch (err) {
      console.error("Error opening attachment:", err);
      alert("Failed to open file. Please try again.");
    }
  };

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
  };

  const handleSelectRequest = (prNo) => {
    setSelectedRequests((prev) =>
      prev.includes(prNo) ? prev.filter((p) => p !== prNo) : [...prev, prNo]
    );
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
    setFormattedFromDate(null);
    setFormattedToDate(null);
  };

  const sortedRequests = Requests?.data || [];

  useEffect(() => {
    const filteredResults = sortedRequests.filter((_, index) =>
      selectedRequests.includes(index)
    );
    setResults(filteredResults);
  }, [selectedRequests, sortedRequests]);

  // 👇 Handle opening modal with selected request
  const handleOpenModal = (request) => {
    setSelectedRequestData(request);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRequestData(null);
  };

  const getDisplayStatus = (status) => {
    if (!status) return "";

    // Normalize (lowercase)
    const s = status.toLowerCase();

    if (s === "invoice full") return "Completed";
    if (s === "gr full" || s === "grfully" || s === "gr fully")
      return "GR Completed";

    return status; // default (no change)
  };

  return (
    <div className="relative flex flex-col min-h-[100vh] max-w-7xl mx-auto p-3 md:p-4">
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 w-full mt-4">
        {/* Left: Heading */}
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Reports
        </h2>

        {/* Right: Controls */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-600 font-medium whitespace-nowrap">
              Filter by Date
            </p>

            <input
              type="date"
              value={
                formattedFromDate
                  ? formattedFromDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={handleFromDate}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <MultipleStopOutlinedIcon className="text-gray-500" />

            <input
              type="date"
              value={
                formattedToDate
                  ? formattedToDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={handleToDate}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <RestartAltRoundedIcon
              className="cursor-pointer text-gray-500 hover:text-blue-600"
              onClick={handleDateResetButton}
            />
          </div>

          {/* Search Box */}
          <div className="relative w-48 sm:w-56 md:w-64">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500 dark:text-gray-100" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={handleSearchChange}
              className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm sm:text-base
          focus:outline-none focus:ring-2 focus:ring-blue-500
          dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending for approval">pending for approval</option>
            <option value="processing">Processing</option>
            <option value="in process">In Process</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="Ready For Purchase">Ready For Purchase</option>
            <option value="gr partial">GR Partial</option>
            <option value="gr full">GR Full</option>
            <option value="invoice partial">Invoice Partial</option>
            <option value="invoice full">Invoice Full</option>
          </select>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <PRTOPDF results={results} sortedRequests={sortedRequests} />
            <ExportToExcel results={results} sortedRequests={sortedRequests} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto flex-grow max-h-[100vh]">
        <table className="w-full table-auto min-w-[900px] border border-gray-300 rounded-lg overflow-hidden">
          <thead>
            <tr className="sticky top-0 bg-blue-800 text-gray-100 text-xs md:text-sm leading-normal">
              <th className="py-2 px-3 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRequests.length === Requests?.data?.length}
                />
                S/N
              </th>
              <th className="py-2 px-3 text-center">PR/N</th>
              <th className="py-2 px-3 text-center">Requestor</th>
              <th className="py-2 px-3 text-center">Created Date</th>
              <th className="py-2 px-3 text-center">Products</th>
              <th className="py-2 px-3 text-center">Status</th>
              <th className="py-2 px-3 text-center">Action</th>{" "}
              {/* 👈 New column */}
            </tr>
          </thead>
          <tbody className="text-sm">
            {sortedRequests && sortedRequests.length > 0 ? (
              sortedRequests.map((request, index) => (
                <React.Fragment key={request._id || index}>
                  <Tooltip
                    title={
                      request.isBlocked
                        ? `Cancelled By ${request.body?.sender_name ||
                            "Unknown"}`
                        : ""
                    }
                    arrow
                    disableHoverListener={!request.isBlocked}
                  >
                    <tr
                      className={`transition-colors ${
                        request.isBlocked
                          ? "bg-red-50 text-red-600 cursor-not-allowed"
                          : "hover:bg-blue-50 cursor-pointer"
                      }`}
                    >
                      {/* Checkbox + S/N */}
                      <td className="py-2 px-1 text-center">
                        <div className="flex items-center justify-center whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedRequests.includes(request.PR_no)}
                            onChange={() => handleSelectRequest(request.PR_no)}
                            disabled={request.isBlocked}
                          />

                          <span className="ml-2">
                            {page * rowsPerPage + index + 1}
                          </span>
                        </div>
                      </td>

                      {/* PR No */}
                      <td className="py-2 px-4 text-center">{request.PR_no}</td>

                      {/* Sender */}
                      <td className="py-2 px-4 text-center">
                        {request.body?.sender_name}
                      </td>

                      {/* Date */}
                      <td className="py-2 px-4 text-center">
                        {request.body?.currentDate
                          ? (() => {
                              const [
                                month,
                                day,
                                year,
                              ] = request.body.currentDate.split("/");
                              const formattedDate = new Date(
                                `${year}-${month}-${day}`
                              );
                              return formattedDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              });
                            })()
                          : "N/A"}
                      </td>

                      {/* Product */}
                      <td
                        className="py-2 px-4 text-center"
                        title={request.body?.productName}
                      >
                        {request.body?.productName}
                      </td>

                      {/* Status */}
                      <td className="py-2 px-2 text-center">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusClassName(
                            request.status
                          )}`}
                        >
                          {getDisplayStatus(request.status)
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(" ")}
                        </span>
                      </td>

                      {/* View Details */}
                      <td className="py-2 px-4 text-center">
                        <p
                          className={`text-blue-500 hover:underline text-sm cursor-pointer ${
                            request.isBlocked
                              ? "cursor-not-allowed text-gray-400 hover:underline-none"
                              : ""
                          }`}
                          onClick={(e) => {
                            if (request.isBlocked) return; // do nothing if blocked
                            e.stopPropagation();
                            setSelectedRequestData(request);
                            setOpenModal(true);
                          }}
                        >
                          View Details
                        </p>
                      </td>
                    </tr>
                  </Tooltip>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No matching records found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 20, 40]}
        />
      </div>

      {/* 👇 Modal for viewing details */}
      <AdminTableModal
        open={openModal}
        onClose={handleCloseModal}
        request={selectedRequestData} // rename to match modal
        onViewAttachment={handleViewAttachment} // rename to match modal
      />
    </div>
  );
};

export default AdminTable;
