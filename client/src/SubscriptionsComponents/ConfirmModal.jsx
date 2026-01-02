export default function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Delete",
  cancelLabel = "Cancel"
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[380px] shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="group relative px-5 py-2.5 rounded-xl border-2 border-gray-300 bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-white hover:border-gray-400 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 font-medium text-sm text-gray-700 hover:text-gray-900 shadow-sm hover:shadow-md"
          >
            <span className="relative z-10">{cancelLabel}</span>
          </button>
          <button
            onClick={onConfirm}
            className="group relative px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl text-sm font-medium shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:from-red-700 hover:to-red-800 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            <span className="relative z-10">{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

