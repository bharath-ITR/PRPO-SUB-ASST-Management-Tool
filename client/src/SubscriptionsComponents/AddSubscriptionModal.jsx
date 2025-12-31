import { useState } from "react";
import { validateSubscription } from "../SubscriptionsUtils/validation";

export default function AddSubscriptionModal({
  form,
  onChange,
  onSubmit,
  onClose
}) {
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const validation = validateSubscription(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[520px] rounded-xl p-4 sm:p-6 shadow-xl">
        <h2 className="text-lg font-semibold mb-4">
          Add New Subscription
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Subscription Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              placeholder="Enter subscription name"
              value={form.name}
              onChange={(e) => {
                onChange(e);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              className={`w-full border rounded px-3 py-2 ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Vendor
            </label>
            <input
              name="vendor"
              placeholder="Enter vendor name"
              value={form.vendor}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Billing Cycle <span className="text-red-500">*</span>
            </label>
            <select
              name="billingCycle"
              value={form.billingCycle}
              onChange={(e) => {
                onChange(e);
                if (errors.billingCycle) setErrors({ ...errors, billingCycle: "" });
              }}
              className={`w-full border rounded px-3 py-2 ${errors.billingCycle ? "border-red-500" : ""}`}
            >
              <option value="">Select billing cycle</option>
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </select>
            {errors.billingCycle && (
              <p className="text-xs text-red-500 mt-1">{errors.billingCycle}</p>
            )}
          </div>

          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Cost <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <select
                name="costCurrency"
                value={form.costCurrency}
                onChange={onChange}
                className="border rounded px-3 py-2"
                aria-label="Currency"
              >
                <option value="₹">₹</option>
                <option value="$">$</option>
                <option value="€">€</option>
              </select>

              <div className="flex-1">
                <input
                  name="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter cost"
                  value={form.cost}
                  onChange={(e) => {
                    onChange(e);
                    if (errors.cost) setErrors({ ...errors, cost: "" });
                  }}
                  className={`w-full border rounded px-3 py-2 ${errors.cost ? "border-red-500" : ""}`}
                />
                {errors.cost && (
                  <p className="text-xs text-red-500 mt-1">{errors.cost}</p>
                )}
              </div>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Next Renewal Date <span className="text-red-500">*</span>
            </label>
            <input
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={(e) => {
                onChange(e);
                if (errors.dueDate) setErrors({ ...errors, dueDate: "" });
              }}
              className={`w-full border rounded px-3 py-2 ${errors.dueDate ? "border-red-500" : ""}`}
            />
            {errors.dueDate && (
              <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-sm w-full sm:w-auto"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm w-full sm:w-auto"
          >
            Add Subscription
          </button>
        </div>
      </div>
    </div>
  );
}

