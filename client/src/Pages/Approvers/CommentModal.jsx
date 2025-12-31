// src/components/CommentModal.jsx
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress } from "@mui/material";

const CommentModal = ({
  isOpen,
  onClose,
  comment,
  setComment,
  error,
  onApprove,
  onReject,
  loading,
}) => {
  if (!isOpen) return null;

  // Close modal if click is on the overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray/50 backdrop-blur-sm"
      onClick={handleOverlayClick} // <-- overlay click handler
    >
      <div
        className="relative w-full max-w-lg bg-gradient-to-br from-white to-gray-50 
                   dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl 
                   border border-gray-200 dark:border-gray-700 p-8 
                   animate-fadeInUp"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 
                     dark:hover:text-gray-300 transition-colors"
        >
          <CloseIcon fontSize="medium" />
        </button>

        {/* Header */}
        <h2 className="text-xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          💬 Add Your Comment
        </h2>

        {/* Textarea */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Type Your Comment...."
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 
                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:border-blue-500 text-sm p-3 transition-shadow shadow-sm hover:shadow-md"
        />

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm text-center mt-2 font-medium">
            {error}
          </p>
        )}

        {/* Divider */}
        <div className="w-full border-t border-gray-200 dark:border-gray-700 mt-6 mb-4" />

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          {loading ? (
            <div className="flex items-center justify-center">
              <CircularProgress size={24} />
            </div>
          ) : (
            <>
              <button
                onClick={onApprove}
                className="px-6 py-2.5 rounded-lg text-white font-semibold 
                           bg-gradient-to-r from-green-500 to-green-600 
                           hover:from-green-600 hover:to-green-700 
                           focus:outline-none focus:ring-2 focus:ring-green-300 
                           shadow-md hover:shadow-lg transition-all duration-150"
              >
                Approve
              </button>
              <button
                onClick={onReject}
                className="px-6 py-2.5 rounded-lg text-white font-semibold 
                           bg-gradient-to-r from-red-500 to-red-600 
                           hover:from-red-600 hover:to-red-700 
                           focus:outline-none focus:ring-2 focus:ring-red-300 
                           shadow-md hover:shadow-lg transition-all duration-150"
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
