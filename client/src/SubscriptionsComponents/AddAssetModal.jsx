import { useState } from "react";
import { validateAsset } from "../SubscriptionsUtils/validation";

export default function AddAssetModal({
  form,
  onChange,
  onSubmit,
  onClose
}) {
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const validation = validateAsset(form);
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
          Add New Asset
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Asset Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              placeholder="Enter asset name"
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
              Asset Type <span className="text-red-500">*</span>
            </label>
            <input
              name="type"
              placeholder="Enter asset type"
              value={form.type}
              onChange={(e) => {
                onChange(e);
                if (errors.type) setErrors({ ...errors, type: "" });
              }}
              className={`w-full border rounded px-3 py-2 ${errors.type ? "border-red-500" : ""}`}
            />
            {errors.type && (
              <p className="text-xs text-red-500 mt-1">{errors.type}</p>
            )}
          </div>

          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Assigned To
            </label>
            <input
              name="assignedTo"
              placeholder="Enter assignee name"
              value={form.assignedTo}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Warranty End Date
            </label>
            <input
              name="warrantyEnd"
              type="date"
              value={form.warrantyEnd}
              onChange={(e) => {
                onChange(e);
                if (errors.warrantyEnd) setErrors({ ...errors, warrantyEnd: "" });
              }}
              className={`w-full border rounded px-3 py-2 ${errors.warrantyEnd ? "border-red-500" : ""}`}
            />
            {errors.warrantyEnd && (
              <p className="text-xs text-red-500 mt-1">{errors.warrantyEnd}</p>
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
            Add Asset
          </button>
        </div>
      </div>
    </div>
  );
}

