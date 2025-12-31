export default function Toast({ message, type = "success", onClose }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-sm
        ${type === "success"
          ? "bg-green-600 text-white"
          : "bg-red-600 text-white"}
      `}
    >
      <div className="flex items-center gap-4">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="text-white font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
}

