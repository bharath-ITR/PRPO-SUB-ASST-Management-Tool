import { useNavigate } from "react-router-dom";
import { getWarrantyStatus } from "../SubscriptionsUtils/warrantyStatus";
import { formatDate } from "../SubscriptionsUtils/dateFormatter";

export default function AssetCard({ asset, onEdit, onDelete }) {
  const navigate = useNavigate();
  const warranty = getWarrantyStatus(asset.warrantyEnd);

  return (
    <div
      onClick={() => navigate(`/assets/${asset._id}`)}
      className="rounded-xl bg-white p-6 border border-gray-200 hover:shadow-md cursor-pointer transition"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900">
              {asset.name}
            </h3>

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
              {warranty.daysLeft !== undefined && ` · ${warranty.daysLeft}d`}
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-1">
            {asset.type}
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-600">
        <div>
          <p className="text-gray-500">Assigned To</p>
          <p className="font-medium text-gray-900">
            {asset.assignedTo || "—"}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Warranty End</p>
          <p className="font-medium text-gray-900 text-xs">
            {formatDate(asset.warrantyEnd)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
       <button
  onClick={(e) => {
    e.stopPropagation();
    onEdit(asset);
  }}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
>
          Edit
        </button>

        <button
  onClick={(e) => {
    e.stopPropagation();
    onDelete(asset._id);
  }}
          className="text-sm font-medium text-red-600 hover:text-red-700"
>

          Delete
        </button>
      </div>
    </div>
  );
}

