import { useNavigate } from "react-router-dom";
import { FiFile } from "react-icons/fi";
import { getWarrantyStatus } from "../SubscriptionsUtils/warrantyStatus";
import { exportToExcel } from "../SubscriptionsUtils/exportUtils";
import { formatDate } from "../SubscriptionsUtils/dateFormatter";

export default function AssetTable({ data, allData, onEdit, onDelete }) {
  const navigate = useNavigate();

  const columns = [
    { header: "Asset Name", key: "name" },
    { header: "Type", key: "type" },
    { header: "Assigned To", key: "assignedTo" },
    { header: "Warranty End", key: "warrantyEnd" },
    {
      header: "Warranty Status",
      accessor: (row) => {
        const warranty = getWarrantyStatus(row.warrantyEnd);
        return `${warranty.label}${warranty.daysLeft !== undefined ? ` (${warranty.daysLeft}d)` : ""}`;
      },
    },
    { header: "Status", key: "status" },
  ];

  const handleExportExcel = () => {
    const exportData = allData || data;
    exportToExcel(exportData, columns, "assets", "Assets");
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Export Buttons */}
      {data.length > 0 && (
        <div className="flex justify-end gap-2 p-4 border-b bg-gray-50">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiFile className="text-green-600" />
            Export Excel
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-5 py-3 text-left font-medium">Asset Name</th>
              <th className="px-5 py-3 text-left font-medium">Type</th>
              <th className="px-5 py-3 text-left font-medium">Assigned To</th>
              <th className="px-5 py-3 text-left font-medium">Warranty End</th>
              <th className="px-5 py-3 text-left font-medium">Warranty Status</th>
              <th className="px-5 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>

        <tbody className="divide-y">
          {data.map((asset) => {
            const warranty = getWarrantyStatus(asset.warrantyEnd);

            return (
              <tr
                key={asset._id}
                onClick={() => navigate(`/assets/${asset._id}`)}
                className="hover:bg-gray-50 cursor-pointer transition"
              >
                <td className="px-5 py-4 font-medium text-gray-900">
                  {asset.name}
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {asset.type}
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {asset.assignedTo || "—"}
                </td>

                <td className="px-5 py-4 text-gray-600 text-xs">
                  {formatDate(asset.warrantyEnd)}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium
                      ${
                        warranty.color === "red"
                          ? "bg-red-100 text-red-700"
                          : warranty.color === "orange"
                          ? "bg-orange-100 text-orange-700"
                          : warranty.color === "yellow"
                          ? "bg-yellow-100 text-yellow-700"
                          : warranty.color === "green"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }
                    `}
                  >
                    {warranty.label}
                    {warranty.daysLeft !== undefined &&
                      ` · ${warranty.daysLeft}d`}
                  </span>
                </td>

                <td className="px-5 py-4 space-x-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(asset);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(asset._id);
                    }}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        </table>
      </div>
    </div>
  );
}

