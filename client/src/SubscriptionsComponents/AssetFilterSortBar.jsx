export default function AssetFilterSortBar({
  filter,
  setFilter,
  sort,
  setSort
}) {
  return (
    <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border">

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "expired", "expiring", "upcoming", "valid"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`group relative px-4 py-2 text-sm font-medium rounded-xl border-2 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 ${
              filter === f
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg shadow-blue-500/30"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-50 shadow-sm hover:shadow-md"
            }`}
          >
            <span className="relative z-10">
              {f === "all"
                ? "All"
                : f === "expired"
                ? "Expired"
                : f === "expiring"
                ? "Expiring Soon"
                : f === "upcoming"
                ? "Upcoming"
                : "Valid"}
            </span>
          </button>
        ))}
      </div>

      {/* Sorting */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="border-2 border-gray-300 rounded-xl px-4 py-2 text-sm font-medium bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <option value="name">Sort by Name</option>
        <option value="priority">Sort by Warranty Status</option>
        <option value="expiry">Nearest Expiry</option>
      </select>
    </div>
  );
}

