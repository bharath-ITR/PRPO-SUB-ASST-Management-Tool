import { useState } from "react";
import { validateSubscription } from "../SubscriptionsUtils/validation";

export default function EditSubscriptionModal({
  subscription,
  onChange,
  onSubmit,
  onClose
}) {
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const validation = validateSubscription(subscription);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-[420px]">
        <h2 className="text-lg font-semibold mb-4">
          Edit Subscription
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Subscription Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={subscription.name}
              onChange={(e) => {
                onChange(e);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              placeholder="Enter subscription name"
              className={`w-full border rounded px-3 py-2 text-sm ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Vendor
            </label>
            <input
              name="vendor"
              value={subscription.vendor}
              onChange={onChange}
              placeholder="Enter vendor name"
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Cost <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <select
                name="costCurrency"
                value={subscription.costCurrency}
                onChange={onChange}
                className="border rounded px-3 py-2 text-sm"
                aria-label="Currency"
              >
                <option value="₹">₹</option>
                <option value="$">$</option>
                <option value="€">€</option>
              </select>

              <input
                name="cost"
                type="number"
                min="0"
                step="0.01"
                value={subscription.cost}
                onChange={(e) => {
                  onChange(e);
                  if (errors.cost) setErrors({ ...errors, cost: "" });
                }}
                placeholder="Enter cost"
                className={`w-full border rounded px-3 py-2 text-sm ${errors.cost ? "border-red-500" : ""}`}
              />
            </div>
            {errors.cost && (
              <p className="text-xs text-red-500 mt-1">{errors.cost}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Billing Cycle <span className="text-red-500">*</span>
            </label>
            <input
              name="billingCycle"
              value={subscription.billingCycle}
              onChange={(e) => {
                onChange(e);
                if (errors.billingCycle) setErrors({ ...errors, billingCycle: "" });
              }}
              placeholder="Enter billing cycle"
              className={`w-full border rounded px-3 py-2 text-sm ${errors.billingCycle ? "border-red-500" : ""}`}
            />
            {errors.billingCycle && (
              <p className="text-xs text-red-500 mt-1">{errors.billingCycle}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Next Renewal Date <span className="text-red-500">*</span>
            </label>
            <input
              name="dueDate"
              type="date"
              value={subscription.dueDate}
              onChange={(e) => {
                onChange(e);
                if (errors.dueDate) setErrors({ ...errors, dueDate: "" });
              }}
              className={`w-full border rounded px-3 py-2 text-sm ${errors.dueDate ? "border-red-500" : ""}`}
            />
            {errors.dueDate && (
              <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button onClick={onClose} className="border px-4 py-2 rounded text-sm w-full sm:w-auto">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm w-full sm:w-auto"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

