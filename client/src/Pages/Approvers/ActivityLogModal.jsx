// components/ActivityLogModal.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Modal, Box, Button } from "@mui/material";

export default function ActivityLogModal({ open, onClose, activityLogs = [], prNo }) {
  const sortedLogs = useMemo(() => {
    return (activityLogs || []).slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [activityLogs]);

  const formatTimestamp = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  const getBgColorAndLabel = (action) => {
    if (!action) return { bg: "bg-gray-100 dark:bg-gray-700", label: "Update" };
    const a = action.toLowerCase();
    if (a.includes("po")) return { bg: "bg-blue-50 dark:bg-blue-800", label: "PO Update" };
    if (a.includes("gr") || a.includes("invoice"))
      return { bg: "bg-green-50 dark:bg-green-800", label: "GR / Invoice Update" };
    if (a.includes("receipt") || a.includes("payment"))
      return { bg: "bg-orange-50 dark:bg-yellow-800", label: "Payment Update" };
    return { bg: "bg-gray-100 dark:bg-gray-700", label: action };
  };

  // Helper to detect and build friendly completion messages only
  const buildCompletionMessages = (changes = {}) => {
    const messages = [];
    if (!changes || typeof changes !== "object") return messages;

    const safeGet = (k) => changes[k] ?? changes[k.toLowerCase()] ?? changes[k.charAt(0).toLowerCase() + k.slice(1)];

    const grFully = safeGet("grFully");
    if (grFully && typeof grFully === "object" && "new" in grFully && grFully.new === true) {
      messages.push("GR completed fully");
    }
    const grPartially = safeGet("grPartially");
    if (grPartially && typeof grPartially === "object" && "new" in grPartially && grPartially.new === true) {
      messages.push("GR completed partially");
    }
    const invoiceFully = safeGet("invoiceFully");
    if (invoiceFully && typeof invoiceFully === "object" && "new" in invoiceFully && invoiceFully.new === true) {
      messages.push("Invoice completed fully");
    }
    const invoicePartially = safeGet("invoicePartially");
    if (invoicePartially && typeof invoicePartially === "object" && "new" in invoicePartially && invoicePartially.new === true) {
      messages.push("Invoice completed partially");
    }

    return messages;
  };

  // Helper to decide whether to render a generic chip for a key
  const shouldRenderChip = (key, displayValue) => {
    if (displayValue === null || displayValue === undefined) return false;
    if (typeof displayValue === "string" && displayValue.trim() === "") return false;

    const kl = key.toLowerCase();
    // Do NOT render completion flag keys as raw chips — we show friendly messages instead
    if (kl.includes("fully") || kl.includes("partially")) return false;

    return true;
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="activity-log-modal"
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto"
        sx={{ outline: "none" }}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold">
            Activity Logs{prNo ? ` - PR No: ${prNo}` : ""}
          </h3>
          <Button size="small" onClick={onClose} className="text-blue-600">
            Close
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {sortedLogs.length === 0 ? (
            <div className="text-center text-sm text-gray-500">No activity found</div>
          ) : (
            sortedLogs.map((act) => {
              const { bg, label } = getBgColorAndLabel(act.action);
              const completionMessages = buildCompletionMessages(act.changes || {});

              return (
                <div
                  key={act._id || `${act.timestamp}-${act.name}`}
                  className={`border rounded-lg p-4 ${bg}`}
                >
                  {/* User & Timestamp */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold">{act.name || "Unknown"}</span>
                    <span className="text-xs text-gray-500">{formatTimestamp(act.timestamp)}</span>
                  </div>

                  {/* Action Label */}
                  <div className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    {label}
                  </div>

                  {/* Completion Messages (only) */}
                  {completionMessages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {completionMessages.map((m, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm text-sm"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Existing Changes rendering (unchanged, but skip fully/partially raw chips and empty values) */}
                  {act.changes && Object.keys(act.changes).length > 0 && (
                    <div className="flex flex-wrap gap-3 text-xs">
                      {Object.entries(act.changes).map(([key, val]) => {
                        // compute displayValue: prefer new/totalAmount when available
                        let displayValue = val;
                        if (val && typeof val === "object" && "new" in val) {
                          displayValue = val.new;
                        } else if (val && typeof val === "object" && "totalAmount" in val) {
                          displayValue = val.totalAmount;
                        } else if (val && typeof val === "object") {
                          // fallback to stringify for non-empty objects
                          try {
                            displayValue = JSON.stringify(val);
                          } catch {
                            displayValue = String(val);
                          }
                        }

                        // decide whether to render this chip
                        if (!shouldRenderChip(key, displayValue)) return null;

                        return (
                          <span
                            key={key}
                            className="px-3 py-1 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm"
                            title={key}
                          >
                            <span className="font-semibold">{key}:</span> {displayValue}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Uploaded Files */}
                  {act.uploadedFiles && act.uploadedFiles.length > 0 && (
                    <div className="mt-4 text-sm">
                      <div className="font-medium text-xs mb-1">Uploaded files:</div>
                      <div className="flex flex-wrap gap-2">
                        {act.uploadedFiles.map((f) => (
                          <a
                            key={f._id || f.filename}
                            href={f.path || f.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            {f.originalname || f.filename}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="p-3 border-t dark:border-gray-700 flex justify-end gap-2">
          <Button size="small" variant="outlined" onClick={onClose}>
            Close
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

ActivityLogModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  activityLogs: PropTypes.array,
  prNo: PropTypes.string,
};
