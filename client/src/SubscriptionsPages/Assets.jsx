import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import { FiPlus, FiGrid, FiList, FiSearch } from "react-icons/fi";
import { api } from "../SubscriptionsServices/api";
import AssetCard from "../SubscriptionsComponents/AssetCard";
import AssetTable from "../SubscriptionsComponents/AssetTable";
import AssetFilterSortBar from "../SubscriptionsComponents/AssetFilterSortBar";
import { getWarrantyStatus } from "../SubscriptionsUtils/warrantyStatus";
import EditAssetModal from "../SubscriptionsComponents/EditAssetModal";
import AddAssetModal from "../SubscriptionsComponents/AddAssetModal";



export default function Assets() {
  const [assets, setAssets] = useState([]);

  const [view, setView] = useState("card");
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("name");

  const [selectedAsset, setSelectedAsset] = useState(null);

  const [showAdd, setShowAdd] = useState(false);

const [newAsset, setNewAsset] = useState({
  name: "",
  type: "",
  assignedTo: "",
  warrantyEnd: ""
});

  // ---------------- PAGINATION ----------------


  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  // ---------------- FETCH ----------------
  useEffect(() => {
    api.get("/assets").then(res => setAssets(res.data));
  }, []);

  // ---------------- FILTER + SORT + SEARCH ----------------
  const processedAssets = useMemo(() => {
    const q = search.trim().toLowerCase();

    const fullTextMatch = (a) => {
      if (!q) return true;
      return [
        a.name,
        a.type,
        a.assignedTo,
        a.status
      ]
        .filter(Boolean)
        .some(val => String(val).toLowerCase().includes(q));
    };

    return [...assets]
      .filter(fullTextMatch)
      .filter((a) => {
        if (filter === "all") return true;

        const status = getWarrantyStatus(a.warrantyEnd).label;
        if (filter === "expired") return status === "Expired";
        if (filter === "expiring") return status === "Expiring Soon";
        if (filter === "upcoming") return status === "Upcoming";
        if (filter === "valid") return status === "Valid";

        return true;
      })
      .sort((a, b) => {
        if (sort === "name") {
          return a.name.localeCompare(b.name);
        }

        if (sort === "priority") {
          return (
            getWarrantyStatus(a.warrantyEnd).priority -
            getWarrantyStatus(b.warrantyEnd).priority
          );
        }

        if (sort === "expiry") {
          return (
            new Date(a.warrantyEnd || "9999-12-31") -
            new Date(b.warrantyEnd || "9999-12-31")
          );
        }

        return 0;
      });
  }, [assets, search, filter, sort]);

  // ---------------- ANALYTICS DATA ----------------
  const { warrantyTimelineData, assetSpendingTrendData, costByVendorData } = useMemo(() => {
    if (!assets || assets.length === 0) {
      return { warrantyTimelineData: [], assetSpendingTrendData: [], costByVendorData: [] };
    }

    const byMonthWarranty = new Map();
    const byMonthSpend = new Map();
    const byVendor = new Map();

    assets.forEach((a) => {
      const end = a.warrantyEnd ? new Date(a.warrantyEnd) : null;
      if (!end || Number.isNaN(end.getTime())) return;

      const ymKey = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}`;
      const label = end.toLocaleString("default", { month: "short", year: "2-digit" });

      // Warranty timeline (count)
      if (!byMonthWarranty.has(ymKey)) {
        byMonthWarranty.set(ymKey, { month: label, count: 0 });
      }
      byMonthWarranty.get(ymKey).count += 1;

      // Asset spending trend (best-effort)
      const cost = Number(a.cost || a.price || a.purchaseCost || 0);
      if (!byMonthSpend.has(ymKey)) {
        byMonthSpend.set(ymKey, { month: label, total: 0 });
      }
      if (cost > 0) {
        byMonthSpend.get(ymKey).total += cost;
      }

      // Cost by vendor / type (best-effort)
      const vendorKey = a.vendor || a.type || "Unknown";
      if (cost > 0 && vendorKey) {
        if (!byVendor.has(vendorKey)) {
          byVendor.set(vendorKey, { label: vendorKey, total: 0 });
        }
        byVendor.get(vendorKey).total += cost;
      }
    });

    const sortByMonthKey = (entries) =>
      entries.sort((a, b) => (a.key > b.key ? 1 : -1)).map((x) => x.value);

    const warrantyTimelineData = sortByMonthKey(
      Array.from(byMonthWarranty.entries()).map(([key, value]) => ({ key, value }))
    );

    const assetSpendingTrendData = sortByMonthKey(
      Array.from(byMonthSpend.entries()).map(([key, value]) => ({ key, value }))
    );

    const costByVendorData = Array.from(byVendor.values()).sort(
      (a, b) => b.total - a.total
    );

    return { warrantyTimelineData, assetSpendingTrendData, costByVendorData };
  }, [assets]);

  // ---------------- SEARCH SUGGESTIONS ----------------
  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      return;
    }

    const pool = assets.slice(0, 100);

    const nameMatches = new Set();
    const typeMatches = new Set();
    const assignedMatches = new Set();

    pool.forEach((a) => {
      if (a.name?.toLowerCase().includes(q)) nameMatches.add(a.name);
      if (a.type?.toLowerCase().includes(q)) typeMatches.add(a.type);
      if (a.assignedTo?.toLowerCase().includes(q)) assignedMatches.add(a.assignedTo);
    });

    const toItems = (set, type) =>
      Array.from(set).slice(0, 5).map((label) => ({ type, label }));

    const next = [
      ...toItems(nameMatches, "Name"),
      ...toItems(typeMatches, "Type"),
      ...toItems(assignedMatches, "Assignee")
    ].slice(0, 10);

    setSuggestions(next);
  }, [search, assets]);

  const applySuggestion = (label) => {
    setSearch(label);
    setSuggestions([]);
    setPage(1);
  };

  // ---------------- PAGINATION ----------------
  const totalPages = Math.ceil(processedAssets.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const paginatedAssets = processedAssets.slice(start, start + PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, filter, sort]);

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this asset?")) return;

    const prev = assets;
    setAssets(assets.filter(a => a._id !== id));

    try {
      await api.delete(`/assets/${id}`);
    } catch {
      setAssets(prev);
    }
  };

const handleEdit = (asset) => {
  setSelectedAsset({ ...asset });
};

const handleChange = (e) => {
  const { name, value } = e.target;
  setSelectedAsset(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = async () => {
  const prev = assets;
  setAssets(assets.map(a => a._id === selectedAsset._id ? selectedAsset : a));
  setSelectedAsset(null);

  try {
    await api.put(`/assets/${selectedAsset._id}`, selectedAsset);
  } catch {
    setAssets(prev);
  }
};

const handleAddChange = (e) => {
  const { name, value } = e.target;
  setNewAsset(prev => ({ ...prev, [name]: value }));
};

const handleAddSubmit = async () => {
  try {
    const res = await api.post("/assets", {
      ...newAsset,
      status: "Active"
    });

    setAssets(prev => [res.data, ...prev]);
    setShowAdd(false);
    setNewAsset({
      name: "",
      type: "",
      assignedTo: "",
      warrantyEnd: ""
    });
  } catch {
    alert("Failed to add asset");
  }
};



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Assets
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Track hardware, warranty status, and ownership
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => setShowAdd(true)}
            className="group relative px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium inline-flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 overflow-hidden w-full sm:w-auto"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            <span className="relative z-10 flex items-center gap-2">
              <FiPlus className="transition-transform duration-200 group-hover:rotate-90" />
              Add Asset
            </span>
          </button>

          <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
            <button
              onClick={() => setView("card")}
              className={`group relative px-4 py-2 text-sm font-medium inline-flex items-center gap-2 transition-all duration-200 ${
                view === "card"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <FiGrid className={`transition-transform duration-200 ${view === "card" ? "scale-110" : "group-hover:scale-110"}`} />
              Cards
            </button>

            <div className="w-px bg-gray-200"></div>

            <button
              onClick={() => setView("table")}
              className={`group relative px-4 py-2 text-sm font-medium inline-flex items-center gap-2 transition-all duration-200 ${
                view === "table"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <FiList className={`transition-transform duration-200 ${view === "table" ? "scale-110" : "group-hover:scale-110"}`} />
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Warranty Expiration Timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Warranty Expiration Timeline
            </p>
            <p className="text-sm text-gray-500">
              Count of assets whose warranty ends by month
            </p>
          </div>
          <div className="h-48">
            {warrantyTimelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={warrantyTimelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-gray-400">
                Not enough data to show warranty timeline.
              </p>
            )}
          </div>
        </div>

        {/* Asset Spending Trend (best-effort) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Asset Spending Trend
            </p>
            <p className="text-sm text-gray-500">
              Based on asset cost fields (if available)
            </p>
          </div>
          <div className="h-48">
            {assetSpendingTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={assetSpendingTrendData}>
                  <defs>
                    <linearGradient id="assetSpending" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#059669"
                    fillOpacity={1}
                    fill="url(#assetSpending)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-gray-400">
                Not enough data to show asset spending trend.
              </p>
            )}
          </div>
        </div>

        {/* Cost by Vendor / Type (best-effort) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Cost by Vendor / Type
            </p>
            <p className="text-sm text-gray-500">
              Based on asset cost fields grouped by vendor or type
            </p>
          </div>
          <div className="h-48 flex items-center justify-center">
            {costByVendorData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costByVendorData}
                    dataKey="total"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                  >
                    {costByVendorData.map((entry, index) => {
                      const colors = ["#6366f1", "#22c55e", "#f97316", "#14b8a6", "#e11d48", "#0ea5e9"];
                      return (
                        <Cell
                          key={`asset-cell-${entry.label}-${index}`}
                          fill={colors[index % colors.length]}
                        />
                      );
                    })}
                  </Pie>
                  <Tooltip />
                  <Legend layout="horizontal" verticalAlign="bottom" height={24} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-gray-400">
                Not enough data to show cost breakdown by vendor/type.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <label htmlFor="asset-search" className="block text-sm font-medium text-gray-700 mb-1.5">
          Search Assets
        </label>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            id="asset-search"
            type="text"
            placeholder="Full-text search by asset name, type, status, or assignee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 120)}
            className="w-full border-2 border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
            autoComplete="off"
          />
        </div>

        {isFocused && suggestions.length > 0 && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((sug, idx) => (
              <button
                key={`${sug.type}-${sug.label}-${idx}`}
                type="button"
                onClick={() => applySuggestion(sug.label)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-left hover:bg-gray-50"
              >
                <span className="truncate">{sug.label}</span>
                <span className="ml-auto text-[10px] uppercase tracking-wide text-gray-400">
                  {sug.type}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter + Sort */}
      <AssetFilterSortBar
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        setSort={setSort}
      />

      {/* Content */}
      {paginatedAssets.length === 0 ? (
        <p className="text-sm text-gray-500 mt-8">
          No assets found.
        </p>
      ) : view === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {paginatedAssets.map((asset) => (
            <AssetCard
              key={asset._id}
              asset={asset}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <AssetTable
            data={paginatedAssets}
            allData={processedAssets}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

{/* Edit */}
      {selectedAsset && (
  <EditAssetModal
    asset={selectedAsset}
    onChange={handleChange}
    onSubmit={handleSubmit}
    onClose={() => setSelectedAsset(null)}
  />
)}

{showAdd && (
  <AddAssetModal
    form={newAsset}
    onChange={handleAddChange}
    onSubmit={handleAddSubmit}
    onClose={() => setShowAdd(false)}
  />
)}


      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-4 mt-8 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="group relative px-4 py-2 rounded-xl border-2 border-gray-300 bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-white hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 font-medium text-gray-700 hover:text-gray-900 shadow-sm hover:shadow-md"
          >
            <span className="relative z-10">Prev</span>
          </button>

          <div className="px-4 py-2 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm">
            <span className="text-gray-600">
              Page <span className="font-semibold text-gray-900">{page}</span> of{" "}
              <span className="font-semibold text-gray-900">{totalPages}</span>
          </span>
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="group relative px-4 py-2 rounded-xl border-2 border-gray-300 bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-white hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 font-medium text-gray-700 hover:text-gray-900 shadow-sm hover:shadow-md"
          >
            <span className="relative z-10">Next</span>
          </button>
        </div>
      )}
    </div>
  );
}

