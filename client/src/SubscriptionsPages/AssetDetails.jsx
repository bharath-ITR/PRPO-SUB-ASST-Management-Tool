import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { api } from "../SubscriptionsServices/api";
import ExtendWarrantyModal from "../SubscriptionsComponents/ExtendWarrantyModal";
import ConfirmModal from "../SubscriptionsComponents/ConfirmModal";
import {
  FiClock,
  FiAlertTriangle,
  FiCheckCircle,
  FiUploadCloud,
  FiInfo,
  FiPackage,
  FiShield,
  FiCalendar,
  FiUser,
  FiFileText,
  FiFile,
  FiDownload,
  FiTrash2,
  FiEdit3,
  FiRefreshCw,
  FiPlus
} from "react-icons/fi";
import { getWarrantyStatus } from "../SubscriptionsUtils/warrantyStatus";
import { formatDate } from "../SubscriptionsUtils/dateFormatter";

export default function AssetDetails() {
  const { id } = useParams();

  const [asset, setAsset] = useState(null);
  const [history, setHistory] = useState([]);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [description, setDescription] = useState("");
  const [savingDesc, setSavingDesc] = useState(false);

  const [showExtend, setShowExtend] = useState(false);

  const apiBase = (api.defaults.baseURL || "").replace(/\/api$/, "");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const summary = useMemo(() => {
    if (!asset) return [];
    const warranty = getWarrantyStatus(asset.warrantyEnd);
    return [
      {
        label: "Type",
        value: asset.type || "—",
        icon: <FiPackage className="text-blue-600" />
      },
      {
        label: "Warranty Status",
        value:
          warranty.daysLeft !== undefined
            ? `${warranty.label} · ${warranty.daysLeft}d`
            : warranty.label,
        icon: <FiShield className="text-green-600" />
      },
      {
        label: "Warranty End",
        value: formatDate(asset.warrantyEnd),
        icon: <FiCalendar className="text-orange-600" />
      },
      {
        label: "Assigned To",
        value: asset.assignedTo || "Unassigned",
        icon: <FiUser className="text-purple-600" />
      }
    ];
  }, [asset]);

  // ---------------- FETCH DATA ----------------
  const fetchData = async () => {
    const assetRes = await api.get(`/assets/${id}`);
    setAsset(assetRes.data);
    setDescription(assetRes.data.description || "");

    const historyRes = await api.get(`/assets/${id}/history`);
    setHistory(historyRes.data);
  };

  useEffect(() => {
    fetchData().catch(console.error);
  }, [id]);

  // ---------------- DESCRIPTION ----------------
  const saveDescription = async () => {
    setSavingDesc(true);
    try {
      await api.put(`/assets/${id}`, { description });
      setAsset(prev => ({ ...prev, description }));
    } finally {
      setSavingDesc(false);
    }
  };

  // ---------------- FILE UPLOAD ----------------
  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      await api.post(`/assets/${id}/upload`, formData);
      setFile(null);
      fetchData();
    } finally {
      setUploading(false);
    }
  };

  // ---------------- EXTEND WARRANTY ----------------
  const handleExtend = async ({ months, cost }) => {
    try {
      await api.post(`/assets/${id}/extend-warranty`, {
        months,
        cost
      });
      setShowExtend(false);
      fetchData();
    } catch (err) {
      console.error("Warranty extension failed", err);
    }
  };

  if (!asset) return <p className="p-6">Loading...</p>;

  const warranty = getWarrantyStatus(asset.warrantyEnd);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 sm:mb-8 my-11">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {asset.name}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium
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

            <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
              <FiInfo className="text-gray-400" />
              Asset details & warranty tracking
            </p>
          </div>

          <button
            onClick={() => setShowExtend(true)}
            className="group relative px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium inline-flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 overflow-hidden w-full sm:w-auto"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            <span className="relative z-10 flex items-center gap-2">
              <FiPlus className="transition-transform duration-200 group-hover:rotate-90" />
            Extend Warranty
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summary.map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-2xl p-4 flex items-start gap-3 shadow-sm"
            >
              <div className="mt-0.5">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <p className="text-sm font-semibold text-gray-900">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FiFileText className="text-blue-600" />
          Description
        </h2>

        <label htmlFor="asset-description" className="block text-sm font-medium text-gray-700 mb-1.5">
          Description
        </label>
        <textarea
          id="asset-description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Asset condition, usage notes, hardware details..."
          className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={saveDescription}
            disabled={savingDesc}
            className="group relative px-5 py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl text-sm font-medium inline-flex items-center gap-2 shadow-lg shadow-gray-900/30 hover:shadow-xl hover:shadow-gray-900/40 hover:from-gray-900 hover:to-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            <span className="relative z-10 flex items-center gap-2">
              <FiEdit3 className="transition-transform duration-200 group-hover:scale-110" />
            {savingDesc ? "Saving..." : "Save Description"}
            </span>
          </button>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FiFile className="text-blue-600" />
          Documents
        </h2>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <label className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium cursor-pointer bg-gradient-to-br from-gray-50 to-white hover:from-blue-50 hover:to-white hover:border-blue-400 hover:text-blue-600 transition-all duration-200 shadow-sm hover:shadow-md">
            <FiUploadCloud className="text-base" />
            <span>Choose file</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="group relative px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium inline-flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            <span className="relative z-10">{uploading ? "Uploading..." : "Upload File"}</span>
          </button>

          {file && (
            <span className="text-xs text-gray-500">
              Selected: {file.name}
            </span>
          )}
        </div>

        {asset.files?.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiAlertTriangle className="text-amber-500" />
            No documents uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {asset.files.map((f) => {
              const url = f.url
                ? `${apiBase}${f.url}`
                : `${apiBase}/uploads/${f.filename}`;
              const isImage = /\.(jpg|jpeg|png|webp)$/i.test(f.originalName);
              const isPdf = /\.pdf$/i.test(f.originalName);

              return (
                <div
                  key={f.filename}
                  className="rounded-xl p-3 relative text-sm bg-white shadow-sm"
                >
                  {isImage && (
                    <img
                      src={url}
                      className="h-28 w-full object-cover rounded mb-2"
                    />
                  )}

                  {isPdf && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 mb-2 text-xs"
                    >
                      <FiFileText />
                      Preview PDF
                    </a>
                  )}

                  {!isImage && !isPdf && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 mb-2 text-xs"
                    >
                      <FiDownload />
                      Download
                    </a>
                  )}

                  <p className="truncate text-xs font-medium">{f.originalName}</p>

                  <button
                    onClick={() => setDeleteTarget({ filename: f.filename, name: f.originalName })}
                    className="absolute top-2 right-2 px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-150 border border-red-200 hover:border-red-300 hover:shadow-sm"
                    title="Delete file"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Warranty History */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FiRefreshCw className="text-blue-600" />
          Warranty History
        </h2>

        {history.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiClock className="text-gray-400" />
            No warranty extensions recorded.
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((h, i) => (
              <div
                key={i}
                className="border-l-4 border-blue-500 pl-4 text-sm relative"
              >
                <div className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 flex items-center gap-2">
                      {h.action}
                      <span className="text-xs font-normal text-gray-500">
                        on {h.date}
                      </span>
                    </p>
                    <p className="text-gray-600 mt-1 flex items-center gap-2">
                      <FiClock className="text-gray-400 text-xs" />
                      Extended for {h.extendedForMonths} months
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <span className="text-gray-400">·</span>
                      Cost: ₹{h.cost}
                    </p>
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                      <FiCalendar className="text-gray-400 text-xs" />
                      Warranty Until: {formatDate(h.nextWarrantyEnd)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Extend Warranty Modal */}
      {showExtend && (
        <ExtendWarrantyModal
          onClose={() => setShowExtend(false)}
          onConfirm={handleExtend}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete File"
          message={`Are you sure you want to delete "${deleteTarget.name}"?`}
          onConfirm={async () => {
            await api.delete(`/assets/${id}/files/${deleteTarget.filename}`);
            setDeleteTarget(null);
            fetchData();
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

