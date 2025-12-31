import { useState } from "react";
import { validateWarrantyExtension } from "../SubscriptionsUtils/validation";

export default function ExtendWarrantyModal({ onClose, onConfirm }) {
  const [months, setMonths] = useState("");
  const [cost, setCost] = useState("");
  const [errors, setErrors] = useState({});

  const handleConfirm = () => {
    const validation = validateWarrantyExtension({ months, cost });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    onConfirm({
      months: Number(months),
      cost: cost ? Number(cost) : 0
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-[420px] p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-4">
          Extend Warranty
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Extend by (months) *
            </label>
            <input
              type="number"
              min="1"
              value={months}
              onChange={(e) => {
                setMonths(e.target.value);
                if (errors.months) setErrors({ ...errors, months: "" });
              }}
              className={`w-full border rounded px-3 py-2 text-sm ${errors.months ? "border-red-500" : ""}`}
            />
            {errors.months && (
              <p className="text-xs text-red-500 mt-1">{errors.months}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Cost (optional)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={cost}
              onChange={(e) => {
                setCost(e.target.value);
                if (errors.cost) setErrors({ ...errors, cost: "" });
              }}
              className={`w-full border rounded px-3 py-2 text-sm ${errors.cost ? "border-red-500" : ""}`}
            />
            {errors.cost && (
              <p className="text-xs text-red-500 mt-1">{errors.cost}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-sm w-full sm:w-auto"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm w-full sm:w-auto"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

