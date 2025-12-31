import React from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
const HistoryModal = ({
  request,
  setSelectedRequest,
  handleViewAttachment,
}) => {
  const getStatusClassName = (status) => {
    switch (status) {
      case "pending for approval":
        return "bg-yellow-100 text-yellow-800";
      case "in process":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "Ready For Purchase":
        return "bg-indigo-100 text-indigo-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto p-6 relative font-sans">
        {/* Close Button */}
        <button
          aria-label="Close Modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors text-2xl font-bold"
          onClick={() => setSelectedRequest(null)}
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-2">
          PR-{request.PR_no} Details
        </h2>

        {/* Combined Grid: Attachments + Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 text-gray-700 leading-relaxed">
          {/* Left Info Column */}
          <div className="space-y-3 border-r border-gray-300 pr-4 text-sm">
            <p>
              <span className="font-semibold text-gray-900">
                Delivery Date:
              </span>{" "}
              {request.body?.expectedDate
                ? (() => {
                    const [month, day, year] = request.body.expectedDate.split(
                      "/"
                    );
                    const formattedDate = new Date(`${year}-${month}-${day}`);
                    return formattedDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    });
                  })()
                : "N/A"}
            </p>

            <p
              className="truncate max-w-[300px] cursor-pointer"
              title={request.body?.comment}
            >
              <span className="font-semibold text-gray-900">User Comment:</span>{" "}
              {request.body?.comment || "N/A"}
            </p>

            <p
              className="truncate max-w-[300px] cursor-pointer"
              title={request.body?.productDescription}
            >
              <span className="font-semibold text-gray-900">
                Product Description:
              </span>{" "}
              {request.body?.productDescription || "N/A"}
            </p>

            <p
              className="truncate max-w-[300px] cursor-pointer"
              title={request.body?.productReason}
            >
              <span className="font-semibold text-gray-900">
                Reason for Product:
              </span>{" "}
              {request.body?.productReason || "N/A"}
            </p>
          </div>

          {/* Right Info Column */}
          <div className="space-y-3 border-r border-gray-300 px-4 text-sm">
            <p>
              <span className="font-semibold text-gray-900">Quantity:</span>{" "}
              {request.body?.quantity || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Unit Price:</span>{" "}
              {request.body?.unitPrice || "N/A"}
            </p>
               <p>
              <span className="font-semibold text-gray-900">Approx Cost:</span>{" "}
              {request.body?.approxCost || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-gray-900">
                Purchase Type:
              </span>{" "}
              {request.body?.purchaseType || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Payment Type:</span>{" "}
              {request.body?.paymentType || "N/A"}
            </p>
          </div>

          {/* Attachments Column */}
          <div className="pl-3 text-sm">
            <h3 className="text-md font-semibold mb-2 text-gray-900 pb-1">
              Attachments
            </h3>
            <ul className="max-h-48 overflow-y-auto space-y-1 pr-2">
              {request.body?.attachment?.length ? (
                request.body.attachment.map((file, index) => {
                  const maxLength = 25;
                  const extension = file.originalname.split(".").pop();
                  const nameWithoutExtension = file.originalname.slice(
                    0,
                    file.originalname.lastIndexOf(".")
                  );
                  const truncatedFileName =
                    nameWithoutExtension.length > maxLength
                      ? `${nameWithoutExtension.slice(
                          0,
                          maxLength
                        )}...${extension}`
                      : file.originalname;

                  return (
                    <li
                      key={index}
                      className="cursor-pointer hover:underline text-blue-600 text-sm flex items-center gap-1 truncate"
                      onClick={() => handleViewAttachment(file)}
                      title={file.originalname}
                    >
                      <AttachFileIcon />
                      {truncatedFileName}
                    </li>
                  );
                })
              ) : (
                <li className="text-gray-500 italic text-sm">
                  No attachments available.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Approvers Table */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-900  pb-2">
            Approvers
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200 rounded-lg">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    S.No
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    Approvers
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    Comment
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                    Responses
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {request.reportingToAndSupervisor?.length ? (
                  request.reportingToAndSupervisor.map((report, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <td className="px-4 py-2 border-b border-gray-200">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200">
                        {report.sendTo || "N/A"}
                      </td>
                      <td
                        className="px-4 py-2 border-b border-gray-200 max-w-xs truncate"
                        title={report.Comment} // shows full text on hover
                      >
                        {report.Comment || "-"}
                      </td>

                      <td className="py-1 px-2 text-center border-b">
                        <div className="flex items-center justify-center gap-1">
                          {/* Response badge */}
                          <span
                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusClassName(
                              report.response
                            )}`}
                          >
                            {report.response || "N/A"}
                          </span>

                          {/* Timestamp (very close to response) */}
                          {report.updatedAt ? (
                            <span className="text-[11px] text-gray-500 ml-1">
                              {new Date(report.updatedAt).toLocaleString(
                                "en-IN",
                                {
                                  timeZone: "Asia/Kolkata",
                                  hour12: true,
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric", // ✅ Added this line
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          ) : (
                            <span className="text-[11px] text-gray-400 ml-1">
                              —
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-3 text-center text-gray-400 italic"
                    >
                      No approvers available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HistoryModal;
