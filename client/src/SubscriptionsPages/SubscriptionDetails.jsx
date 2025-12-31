import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiRefreshCcw,
  FiPauseCircle,
  FiPlayCircle,
  FiXCircle,
  FiUploadCloud,
  FiFileText,
  FiClock,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo
} from "react-icons/fi";
import { GiMoneyStack } from "react-icons/gi";
import { api } from "../SubscriptionsServices/api";
import RenewSubscriptionModal from "../SubscriptionsComponents/RenewSubscriptionModal";
import Toast from "../SubscriptionsComponents/Toast";
import { useToast } from "../SubscriptionsHooks/useToast";
import { getWarrantyStatus } from "../SubscriptionsUtils/warrantyStatus";
import { formatDate } from "../SubscriptionsUtils/dateFormatter";
import ConfirmModal from "../SubscriptionsComponents/ConfirmModal";

/* ---------------- ANIMATIONS ---------------- */

const pageAnim = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
};

const sectionAnim = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

/* ---------------- COMPONENT ---------------- */

export default function SubscriptionDetails() {
  const { id } = useParams();

  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [fileNote, setFileNote] = useState("");
  const [fileDescriptions, setFileDescriptions] = useState({});
  const [showRenew, setShowRenew] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { toast, showToast, clearToast } = useToast();

  const apiBase = useMemo(() => {
    const base = api.defaults.baseURL || "";
    return base.replace(/\/api$/, "");
  }, []);

  const totalSpend = useMemo(() => {
    if (!sub) return 0;
    const fromHistory = (sub.history || []).reduce(
      (sum, h) => sum + (Number(h.newCost ?? h.cost ?? 0) || 0),
      0
    );
    const current = Number(sub.cost || 0);
    return fromHistory + current;
  }, [sub]);

  const summary = useMemo(() => {
    if (!sub) return null;
    const expiry = getWarrantyStatus(sub.dueDate);
    return [
      {
        label: "Billing Cycle",
        value: sub.billingCycle || "—",
        icon: <FiRefreshCcw className="text-blue-600" />
      },
      {
        label: "Next Renewal",
        value: formatDate(sub.dueDate),
        icon: <FiClock className="text-amber-600" />
      },
      {
        label: "Status",
        value: sub.status,
        icon:
          sub.status === "ACTIVE" ? (
            <FiCheckCircle className="text-emerald-600" />
          ) : sub.status === "PAUSED" ? (
            <FiPauseCircle className="text-amber-600" />
          ) : (
            <FiXCircle className="text-rose-600" />
          )
      },
      {
        label: "Total Spend",
        value: `${sub.costCurrency || "₹"}${totalSpend.toLocaleString()}`,
        icon: <GiMoneyStack className="text-emerald-400"/>
      }
    ];
  }, [sub, totalSpend]);

  /* ---------------- FETCH ---------------- */

  const fetchData = async () => {
    try {
      const res = await api.get(`/subscriptions/${id}`);
      setSub(res.data);
      setDescription(res.data.description || "");
    } catch {
      showToast("Failed to load subscription", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (sub?.files) {
      const map = {};
      sub.files.forEach((f) => {
        map[f._id] = f.description || "";
      });
      setFileDescriptions(map);
    }
  }, [sub]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!sub) return <p className="p-6">Subscription not found</p>;

  const expiry = getWarrantyStatus(sub.dueDate);

  /* ---------------- ACTIONS ---------------- */

  const handleRenew = async ({ newCost, costCurrency }) => {
    try {
      await api.post(`/subscriptions/${id}/renew`, { newCost, costCurrency });
      showToast("Subscription renewed", "success");
      setShowRenew(false);
      fetchData();
    } catch {
      showToast("Renewal failed", "error");
    }
  };

  const handlePause = async () => {
    await api.post(`/subscriptions/${id}/pause`);
    showToast("Subscription paused", "success");
    fetchData();
  };

  const handleResume = async () => {
    await api.post(`/subscriptions/${id}/resume`);
    showToast("Subscription resumed", "success");
    fetchData();
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancel this subscription?")) return;
    await api.post(`/subscriptions/${id}/cancel`);
    showToast("Subscription cancelled", "success");
    fetchData();
  };

  const saveDescription = async () => {
    try {
      await api.put(`/subscriptions/${id}/description`, { description });
      setSub(prev => ({ ...prev, description }));
      showToast("Description updated", "success");
    } catch {
      showToast("Failed to update description", "error");
    }
  };

  /* ---------------- FILE UPLOAD ---------------- */

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    if (fileNote) formData.append("description", fileNote);

    try {
      const res = await api.post(`/subscriptions/${id}/files`, formData);
      setSub(res.data);
      setFile(null);
      setFileNote("");
      showToast("File uploaded", "success");
    } catch {
      showToast("Upload failed", "error");
    }
  };

  /* ---------------- FILE DELETE ---------------- */

const handleDeleteFile = async (fileId) => {
  try {
    const res = await api.delete(
      `/subscriptions/${id}/files/${fileId}`
    );

    setSub(res.data);
    showToast("File deleted", "success");
  } catch {
    showToast("Delete failed", "error");
  }
};

  const handleSaveFileDescription = async (fileId) => {
    try {
      const res = await api.put(
        `/subscriptions/${id}/files/${fileId}/description`,
        { description: fileDescriptions[fileId] || "" }
      );
      setSub(res.data);
      showToast("File notes updated", "success");
    } catch {
      showToast("Failed to update notes", "error");
    }
  };

  const handleClearFileDescription = async (fileId) => {
    try {
      const res = await api.put(
        `/subscriptions/${id}/files/${fileId}/description`,
        { description: "" }
      );
      setSub(res.data);
      setFileDescriptions((prev) => ({ ...prev, [fileId]: "" }));
      showToast("File notes removed", "success");
    } catch {
      showToast("Failed to remove notes", "error");
    }
  };


  /* ---------------- UI ---------------- */

  return (
    <motion.div
      variants={pageAnim}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.35 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 bg-gray-50 min-h-screen"
    >
      {/* HEADER */}
      <div className="flex flex-col gap-4 mb-6 sm:mb-8 my-11">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {sub.name}
              </h1>
              <Badge type={expiry.color}>
                {expiry.label}
                {expiry.daysLeft !== undefined && ` · ${expiry.daysLeft}d`}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
              <FiInfo className="text-gray-400" />
              Vendor: {sub.vendor || "Not specified"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <PrimaryBtn icon={<FiRefreshCcw />} onClick={() => setShowRenew(true)}>
              Renew
            </PrimaryBtn>
            {sub.status === "ACTIVE" && (
              <WarningBtn icon={<FiPauseCircle />} onClick={handlePause}>
                Pause
              </WarningBtn>
            )}
            {sub.status === "PAUSED" && (
              <SecondaryBtn icon={<FiPlayCircle />} onClick={handleResume}>
                Resume
              </SecondaryBtn>
            )}
            <DangerBtn icon={<FiXCircle />} onClick={handleCancel}>
              Cancel
            </DangerBtn>
          </div>
        </div>

        <motion.div
          variants={sectionAnim}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {summary?.map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm"
            >
              <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="font-semibold text-gray-900">{item.value}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Section title="Overview" icon={<FiInfo />}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Info label="Billing Cycle" value={sub.billingCycle} />
              <Info
                label="Cost"
                value={`${sub.costCurrency || "₹"}${sub.cost}`}
              />
              <Info label="Next Renewal" value={formatDate(sub.dueDate)} />
            </div>
          </Section>

          <Section title="Description" icon={<FiFileText />}>
            
            <label htmlFor="subscription-description" className="block text-sm font-medium text-gray-700 mb-1.5">
              
              Description
            </label>
            <textarea
              id="subscription-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Contract notes, usage remarks..."
            />
            <div className="flex justify-end mt-4">
              <PrimaryBtn onClick={saveDescription}>
                Save Description
              </PrimaryBtn>
            </div>
          </Section>

          {/* DOCUMENTS */}
          <Section title="Documents" icon={<FiUploadCloud />}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Upload Document
              </label>
              <div className="flex flex-wrap items-center gap-4">
                <label className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <FiUploadCloud />
                  <span>Choose file</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </label>
                <div className="flex-1 min-w-[200px]">
                  <label htmlFor="file-description" className="block text-xs text-gray-600 mb-1">
                    File Description (optional)
                  </label>
                  <input
                    id="file-description"
                    type="text"
                    value={fileNote}
                    onChange={(e) => setFileNote(e.target.value)}
                    placeholder="Add description for this upload"
                    className="border rounded-lg px-3 py-2 text-sm w-full"
                  />
                </div>
                <PrimaryBtn onClick={handleUpload} disabled={!file}>
                  Upload File
                </PrimaryBtn>
                {file && (
                  <span className="text-xs text-gray-500">
                    Selected: {file.name}
                  </span>
                )}
              </div>
            </div>

            {sub.files?.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiAlertTriangle className="text-amber-500" />
                No documents uploaded yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {sub.files.map((f) => {
                  const url = f.url
                    ? `${apiBase}${f.url}`
                    : `${apiBase}/uploads/${f.filename}`;
                  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(f.originalName);
                  const isPdf = /\.pdf$/i.test(f.originalName);

                  return (
                    <motion.div
                      key={f._id}
                      variants={sectionAnim}
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
                          className="text-blue-600 underline block mb-2"
                        >
                          Preview PDF
                        </a>
                      )}

                      {!isImage && !isPdf && (
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline block mb-2"
                        >
                          Download
                        </a>
                      )}

                      <p className="truncate">{f.originalName}</p>

                      {f.description && (
                        <p className="text-xs text-gray-500 mt-1">
                          {f.description}
                        </p>
                      )}

                      <div className="mt-3 space-y-2">
                        <label htmlFor={`file-desc-${f._id}`} className="block text-xs text-gray-600 mb-1">
                          Description
                        </label>
                        <input
                          id={`file-desc-${f._id}`}
                          type="text"
                          value={fileDescriptions[f._id] || ""}
                          onChange={(e) =>
                            setFileDescriptions((prev) => ({
                              ...prev,
                              [f._id]: e.target.value
                            }))
                          }
                          placeholder="Add / edit description"
                          className="border rounded px-2 py-1 text-xs w-full"
                        />
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => handleSaveFileDescription(f._id)}
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            Save
                          </button>
                          {f.description && (
                            <button
                              onClick={() => handleClearFileDescription(f._id)}
                              className="text-xs text-gray-500 hover:text-gray-700"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setDeleteTarget({ id: f._id, name: f.originalName })}
                        className="absolute top-2 right-2 text-xs text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </Section>
        </div>

        {/* RIGHT */}
        <div className="space-y-4 sm:space-y-6">
          <Section title="Renewal History" icon={<FiClock />}>
            {sub.history?.length === 0 ? (
              <p className="text-sm text-gray-500">
                No renewal history available.
              </p>
            ) : (
              <div className="space-y-3">
                {sub.history.map((h, idx) => (
                  <motion.div
                    key={idx}
                    variants={sectionAnim}
                    className="rounded-2xl p-4 bg-white text-sm shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">
                        {h.action || "Renewed"}
                      </p>
                      <span className="text-xs text-gray-500">
                        {formatDate(h.date)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {h.previousDueDate && (
                        <>
                          Prev: {formatDate(h.previousDueDate)} →{" "}
                        </>
                      )}
                      Next: {formatDate(h.nextDueDate)}
                    </p>
                    {h.newCost && (
                      <p className="text-xs text-gray-600">
                        Cost: {h.costCurrency || "₹"}
                        {h.newCost}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </Section>
        </div>
      </div>

      {showRenew && (
        <RenewSubscriptionModal
          currentCost={sub.cost}
          currentCurrency={sub.costCurrency}
          onConfirm={handleRenew}
          onClose={() => setShowRenew(false)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={clearToast}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete File"
          message={`Are you sure you want to delete "${deleteTarget.name}"?`}
          onConfirm={() => {
            handleDeleteFile(deleteTarget.id);
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </motion.div>
  );
}

/* ---------------- UI HELPERS ---------------- */

const Section = ({ title, icon, children }) => (
  <motion.div
    variants={sectionAnim}
    className="bg-white rounded-2xl p-6 shadow-sm"
  >
    <h2 className="font-semibold mb-4 flex items-center gap-2 text-gray-900">
      {icon && (
        <span className="text-gray-500">
          {icon}
        </span>
      )}
      {title}
    </h2>
    {children}
  </motion.div>
);


const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

const Badge = ({ children, type }) => {
  const map = {
    red: "bg-red-100 text-red-700",
    orange: "bg-orange-100 text-orange-700",
    yellow: "bg-yellow-100 text-yellow-700",
    green: "bg-green-100 text-green-700",
    gray: "bg-gray-100 text-gray-600"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs ${map[type]}`}>
      {children}
    </span>
  );
};

const PrimaryBtn = ({ children, icon, ...p }) => (
  <button
    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm inline-flex items-center gap-2 shadow hover:bg-blue-700 disabled:opacity-60"
    {...p}
  >
    {icon}
    {children}
  </button>
);

const SecondaryBtn = ({ children, icon, ...p }) => (
  <button
    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm inline-flex items-center gap-2 shadow hover:bg-green-700 disabled:opacity-60"
    {...p}
  >
    {icon}
    {children}
  </button>
);

const WarningBtn = ({ children, icon, ...p }) => (
  <button
    className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm inline-flex items-center gap-2 shadow hover:bg-yellow-600 disabled:opacity-60"
    {...p}
  >
    {icon}
    {children}
  </button>
);

const DangerBtn = ({ children, icon, ...p }) => (
  <button
    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm inline-flex items-center gap-2 shadow hover:bg-red-700 disabled:opacity-60"
    {...p}
  >
    {icon}
    {children}
  </button>
);

