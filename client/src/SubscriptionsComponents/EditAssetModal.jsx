import { useState } from "react";
import { validateAsset } from "../SubscriptionsUtils/validation";

export default function EditAssetModal({
  asset,
  onChange,
  onSubmit,
  onClose
}) {
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const validation = validateAsset(asset);
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
          Edit Asset
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Asset Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={asset.name}
              onChange={(e) => {
                onChange(e);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              placeholder="Enter asset name"
              className={`w-full border rounded px-3 py-2 text-sm ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Asset Type <span className="text-red-500">*</span>
            </label>
            <input
              name="type"
              value={asset.type}
              onChange={(e) => {
                onChange(e);
                if (errors.type) setErrors({ ...errors, type: "" });
              }}
              placeholder="Enter asset type"
              className={`w-full border rounded px-3 py-2 text-sm ${errors.type ? "border-red-500" : ""}`}
            />
            {errors.type && (
              <p className="text-xs text-red-500 mt-1">{errors.type}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Assigned To
            </label>
            <input
              name="assignedTo"
              value={asset.assignedTo || ""}
              onChange={onChange}
              placeholder="Enter assignee name"
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Warranty End Date
            </label>
            <input
              name="warrantyEnd"
              type="date"
              value={asset.warrantyEnd || ""}
              onChange={(e) => {
                onChange(e);
                if (errors.warrantyEnd) setErrors({ ...errors, warrantyEnd: "" });
              }}
              className={`w-full border rounded px-3 py-2 text-sm ${errors.warrantyEnd ? "border-red-500" : ""}`}
            />
            {errors.warrantyEnd && (
              <p className="text-xs text-red-500 mt-1">{errors.warrantyEnd}</p>
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

