export default function AssetFilterSortBar({
  filter,
  setFilter,
  sort,
  setSort
}) {
  return (
    <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border">

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "expired", "expiring", "upcoming", "valid"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 text-sm rounded-md border
              ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600"
              }
            `}
          >
            {f === "all"
              ? "All"
              : f === "expired"
              ? "Expired"
              : f === "expiring"
              ? "Expiring Soon"
              : f === "upcoming"
              ? "Upcoming"
              : "Valid"}
          </button>
        ))}
      </div>

      {/* Sorting */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="border rounded-md px-3 py-1 text-sm"
      >
        <option value="name">Sort by Name</option>
        <option value="priority">Sort by Warranty Status</option>
        <option value="expiry">Nearest Expiry</option>
      </select>
    </div>
  );
}

