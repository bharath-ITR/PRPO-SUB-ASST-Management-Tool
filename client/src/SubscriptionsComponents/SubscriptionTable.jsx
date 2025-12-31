import { useNavigate } from "react-router-dom";
import { FiFile } from "react-icons/fi";
import { getWarrantyStatus } from "../SubscriptionsUtils/warrantyStatus";
import { exportToExcel } from "../SubscriptionsUtils/exportUtils";
import { formatDate } from "../SubscriptionsUtils/dateFormatter";

export default function SubscriptionTable({ data, allData, onEdit, onDelete }) {
  const navigate = useNavigate();

  const columns = [
    { header: "Name", key: "name" },
    { header: "Vendor", key: "vendor" },
    { header: "Billing Cycle", key: "billingCycle" },
    { 
      header: "Cost", 
      accessor: (row) => {
        const currency = row.costCurrency || "₹";
        const cost = row.cost || 0;
        return `${currency}${cost}`;
      }
    },
    { header: "Next Renewal", key: "dueDate" },
    {
      header: "Status",
      accessor: (row) => {
        const expiry = getWarrantyStatus(row.dueDate);
        return `${expiry.label}${expiry.daysLeft !== undefined ? ` (${expiry.daysLeft}d)` : ""}`;
      },
    },
  ];

  const handleExportExcel = () => {
    const exportData = allData || data;
    exportToExcel(exportData, columns, "subscriptions", "Subscriptions");
  };

  return (
    <div className="rounded-xl border bg-white overflow-hidden">
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
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">Vendor</th>
              <th className="px-5 py-3 text-left">Billing</th>
              <th className="px-5 py-3 text-left">Next Renewal</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Actions</th>
            </tr>
          </thead>

        <tbody className="divide-y">
          {data.map((sub) => {
            const expiry = getWarrantyStatus(sub.dueDate);

            return (
              <tr
                key={sub._id}
                onClick={() => navigate(`/subscriptions/${sub._id}`)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-5 py-4 font-medium">
                  {sub.name}
                </td>

                <td className="px-5 py-4">{sub.vendor}</td>
                <td className="px-5 py-4">{sub.billingCycle}</td>
                <td className="px-5 py-4 text-xs">{formatDate(sub.dueDate)}</td>

                <td className="px-5 py-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium
                      ${
                        expiry.color === "red"
                          ? "bg-red-100 text-red-700"
                          : expiry.color === "orange"
                          ? "bg-orange-100 text-orange-700"
                          : expiry.color === "yellow"
                          ? "bg-yellow-100 text-yellow-700"
                          : expiry.color === "green"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }
                    `}
                  >
                    {expiry.label}
                    {expiry.daysLeft !== undefined &&
                      ` · ${expiry.daysLeft}d`}
                  </span>
                </td>

                <td className="px-5 py-4 space-x-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(sub);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(sub._id);
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

