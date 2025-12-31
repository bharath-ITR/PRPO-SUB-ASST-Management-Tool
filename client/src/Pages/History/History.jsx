import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHistory } from "../../redux/Action";
import EditForm from "../../components/EditForm/EditForm";
import axios from "axios";
import HistoryModal from "./HistoryModal";
import { Search } from "@mui/icons-material";

const History = () => {
  const apiUrl = process.env.REACT_APP_API;
  const dispatch = useDispatch();
  const { history } = useSelector((state) => state.getHistory);
  const userEmail = useSelector((state) => state.user.user.email);

  const [editedRequest, setEditedRequest] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedRequest, setSelectedRequest] = useState(null);

  // NEW: per-row loading
  const [cancelLoading, setCancelLoading] = useState({});
  const [editLoading, setEditLoading] = useState({});

  // Debounce search
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
  };

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (!userEmail) return;

    (async () => {
      setLoading(true);
      try {
        const response = await dispatch(
          getHistory(userEmail, page + 1, rowsPerPage, debouncedSearch)
        );
        if (response) setTotalCount(response.totalRecords);
      } finally {
        setLoading(false);
      }
    })();
  }, [userEmail, page, rowsPerPage, debouncedSearch, dispatch]);

  const getStatusClassName = (status) => {
    switch (status) {
      case "pending for approval":
        return "bg-amber-100 text-amber-800";
      case "in process":
        return "bg-orange-100 text-orange-800";
      case "processing":
        return "bg-sky-100 text-sky-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "Ready For Purchase":
        return "bg-teal-100 text-teal-800";
      case "invoice full":
        return "bg-green-200 text-green-900";
      case "PO Raised":
        return "bg-indigo-100 text-indigo-800";
      case "completed":
      case "Completed":
        return "bg-green-200 text-lime-800";
      case "rejected":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // UPDATE: per-row edit loading
  const handleEdit = (index) => {
    const request = history?.data[index];
    const pr = request.PR_no;

    setEditLoading((prev) => ({ ...prev, [pr]: true }));

    if (request.status === "pending for approval" && !request.isBlocked) {
      setIsEditing(true);
      const { PR_no, body } = request;
      setEditedRequest({ PR_no, ...body });
    } else {
      console.log("Editing not allowed");
    }

    setTimeout(() => {
      setEditLoading((prev) => ({ ...prev, [pr]: false }));
    }, 500);
  };

  // UPDATE: per-row cancel loading
  const handleCancel = async (index) => {
    const request = history?.data[index];
    const pr = request.PR_no;

    setCancelLoading((prev) => ({ ...prev, [pr]: true }));

    try {
      const response = await fetch(`${apiUrl}/cancel/${pr}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const updatedHistory = history?.data.map((req, i) =>
          i === index ? { ...req, isBlocked: true } : req
        );

        dispatch({ type: "UPDATE_HISTORY", payload: updatedHistory });
        alert(`PR-${pr} has been cancelled`);

        // reload SHOULD go inside the success block
        window.location.reload();
      } else {
        console.error("Failed to cancel request");
      }
    } catch (error) {
      console.error("Cancel error:", error);
    } finally {
      setCancelLoading((prev) => ({ ...prev, [pr]: false }));
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
      alert("Failed to open file.");
    }
  };

  const getDisplayStatus = (status) => {
    if (!status) return "";
    const s = status.toLowerCase();
    if (s === "invoice full") return "Completed";
    if (s === "gr full" || s === "grfully" || s === "gr fully")
      return "GR Completed";

    return status;
  };

  return (
    <div className="relative flex flex-col min-h-[100vh] max-w-7xl mx-auto p-4 md:p-4 ">
      <div className="flex justify-between items-center mb-3 mt-16">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
          History
        </h2>

        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search by Product Name, PR No or Sender"
            className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm 
            focus:outline-none focus:ring-2 focus:ring-blue-500
            dark:bg-gray-700 dark:text-gray-100"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={loading}
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500 dark:text-gray-100" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto flex-grow max-h-[100vh]">
          <table className="w-full table-auto min-w-[900px] border border-gray-300 rounded-lg overflow-hidden dark:border-gray-700">
            <thead>
              <tr className=" sticky top-0 bg-blue-800 text-gray-100 text-xs md:text-sm">
                <th className="py-2 px-3 text-center">S/N</th>
                <th className="py-2 px-3 text-center">PR/N</th>
                <th className="py-2 px-3 text-center">Created Date</th>
                <th className="py-2 px-3 text-center">Office</th>
                <th className="py-2 px-3 text-center">Products</th>
                <th className="py-2 px-3 text-center">Cost</th>
                <th className="py-2 px-3 text-center">Edit</th>
                <th className="py-2 px-3 text-center">Status</th>
                <th className="py-2 px-3 text-center">Action</th>
                <th className="py-2 px-3 text-center">View</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {history?.data?.map((request, index) => (
                <React.Fragment key={request.PR_no || index}>
                  <tr
                    className={`${
                      request.isBlocked
                        ? "bg-red-50 text-red-600 opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-50 cursor-pointer"
                    } transition-colors`}
                    onClick={() =>
                      !request.isBlocked && setSelectedRequest(request)
                    }
                  >
                    <td className="py-3 px-4 text-center">
                      {page * rowsPerPage + index + 1}
                    </td>

                    <td className="py-3 px-4 text-center">{request.PR_no}</td>

                    <td className="py-3 px-4 text-center">
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

                    <td className="py-3 px-4 text-center">
                      {request.body?.location}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {request.body?.productName}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {request.body?.approxCost}
                    </td>

                    {/* EDIT BUTTON WITH ROW LOADING */}
                    <td className="py-3 px-4 text-center">
                      {editLoading[request.PR_no] ? (
                        <div className="loader border-t-2 border-orange-500 w-4 h-4 rounded-full animate-spin mx-auto"></div>
                      ) : request.isBlocked ? null : request.status ===
                        "pending for approval" ? (
                        <p
                          className="text-orange-500 hover:underline text-sm cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(index);
                          }}
                        >
                          Edit
                        </p>
                      ) : (
                        <p className="text-gray-400 text-sm">━</p>
                      )}
                    </td>

                    {/* STATUS */}
                    <td className="py-1 px-2 text-center">
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

                    {/* CANCEL BUTTON WITH ROW LOADING */}
                    <td className="py-3 px-4 text-center">
                      {request.isBlocked ? (
                        <span className="text-red-500 text-xs">Cancelled</span>
                      ) : cancelLoading[request.PR_no] ? (
                        <div className="loader border-t-2 border-red-500 w-4 h-4 rounded-full animate-spin mx-auto"></div>
                      ) : request.status === "Ready For Purchase" ? (
                        <p
                          className="text-gray-400 text-sm cursor-not-allowed"
                          title="Cannot cancel, status is Ready For Purchase"
                        >
                          Cancel
                        </p>
                      ) : (
                        <p
                          className="text-red-500 hover:underline text-sm cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancel(index);
                          }}
                        >
                          Cancel
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <p
                        className="text-blue-500 hover:underline text-sm cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(request);
                        }}
                      >
                        View Details
                      </p>
                    </td>
                  </tr>

                  <tr className="bg-gray-200 dark:bg-gray-600">
                    <td colSpan={10} className="h-px p-0"></td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-end items-center mt-4 space-x-2">
        <select
          className="border rounded p-1"
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(parseInt(e.target.value));
            setPage(0);
          }}
        >
          {[10, 20, 40].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <button
          className="px-2 py-1 border rounded"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <button
          className="px-2 py-1 border rounded"
          disabled={(page + 1) * rowsPerPage >= totalCount}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      {isEditing && editedRequest && (
        <EditForm
          requestData={editedRequest}
          setEditedRequest={setEditedRequest}
          setIsEditing={setIsEditing}
        />
      )}

      {/* View Details Modal */}
      {selectedRequest && (
        <HistoryModal
          request={selectedRequest}
          setSelectedRequest={setSelectedRequest}
          handleViewAttachment={handleViewAttachment}
        />
      )}
    </div>
  );
};

export default History;
