import { useState } from "react";
import { validateRenewal } from "../SubscriptionsUtils/validation";

export default function RenewSubscriptionModal({
  currentCost,
  currentCurrency = "₹",
  onConfirm,
  onClose
}) {
  const [cost, setCost] = useState(currentCost);
  const [costCurrency, setCostCurrency] = useState(currentCurrency);
  const [errors, setErrors] = useState({});

  const handleConfirm = () => {
    const validation = validateRenewal({ newCost: cost });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    onConfirm({ newCost: Number(cost), costCurrency });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-[420px]">
        <h2 className="text-lg font-semibold mb-4">
          Renew Subscription
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Renewal Cost <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <select
                value={costCurrency}
                onChange={(e) => setCostCurrency(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
                aria-label="Currency"
              >
                <option value="₹">₹</option>
                <option value="$">$</option>
                <option value="€">€</option>
              </select>

              <input
                type="number"
                min="0"
                step="0.01"
                value={cost}
                onChange={(e) => {
                  setCost(e.target.value);
                  if (errors.newCost) setErrors({ ...errors, newCost: "" });
                }}
                placeholder="Enter renewal cost"
                className={`w-full border rounded px-3 py-2 text-sm ${errors.newCost ? "border-red-500" : ""}`}
              />
            </div>
            {errors.newCost && (
              <p className="text-xs text-red-500 mt-1">{errors.newCost}</p>
            )}
            <p className="text-xs text-gray-500 mt-1.5">
              Leave unchanged to continue with previous cost
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button onClick={onClose} className="border px-4 py-2 rounded text-sm w-full sm:w-auto">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm w-full sm:w-auto"
          >
            Renew
          </button>
        </div>
      </div>
    </div>
  );
}

