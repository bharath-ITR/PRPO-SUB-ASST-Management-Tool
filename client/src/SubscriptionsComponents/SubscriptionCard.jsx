import { useNavigate } from "react-router-dom";
import { getWarrantyStatus } from "../SubscriptionsUtils/warrantyStatus";
import { formatDate } from "../SubscriptionsUtils/dateFormatter";

export default function SubscriptionCard({ sub, onEdit, onDelete }) {
  const navigate = useNavigate();
  const expiry = getWarrantyStatus(sub.dueDate);

  return (
    <div
      onClick={() => navigate(`/subscriptions/${sub._id}`)}
      className="rounded-xl bg-white p-6 border border-gray-200 hover:shadow-md cursor-pointer transition"
    >
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-gray-900">
            {sub.name}
          </h3>

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
            {expiry.daysLeft !== undefined && ` · ${expiry.daysLeft}d`}
          </span>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          {sub.vendor}
        </p>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-600">
        <div>
          <p className="text-gray-500">Billing</p>
          <p className="font-medium text-gray-900">
            {sub.billingCycle}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Next Renewal</p>
          <p className="font-medium text-gray-900 text-xs">
            {formatDate(sub.dueDate)}
          </p>
        </div>
      </div>

      {/* Actions */}
     <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
  <button
    onClick={(e) => {
      e.stopPropagation();
      onEdit(sub);
    }}
    className="text-sm font-medium text-blue-600 hover:text-blue-700"
  >
    Edit
  </button>

  <button
    onClick={(e) => {
      e.stopPropagation();
      onDelete(sub._id);
    }}
    className="text-sm font-medium text-red-600 hover:text-red-700"
  >
    Delete
  </button>
</div>

    </div>
  );
}

