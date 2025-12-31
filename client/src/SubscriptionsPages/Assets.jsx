import { useEffect, useMemo, useState } from "react";
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
    return [...assets]
      .filter((a) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          a.name.toLowerCase().includes(q) ||
          a.type?.toLowerCase().includes(q) ||
          a.assignedTo?.toLowerCase().includes(q)
        );
      })
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

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg w-full sm:w-auto"
          >
            + Add Asset
          </button>

          <div className="flex border rounded-md overflow-hidden bg-white">
            <button
              onClick={() => setView("card")}
              className={`px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium
                ${view === "card"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600"}
              `}
            >
              Cards
            </button>

            <button
              onClick={() => setView("table")}
              className={`px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium
                ${view === "table"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600"}
              `}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <label htmlFor="asset-search" className="block text-sm font-medium text-gray-700 mb-1.5">
          Search Assets
        </label>
        <input
          id="asset-search"
          type="text"
          placeholder="Search by asset name, type, or assignee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg px-4 py-2 text-sm bg-white shadow-sm focus:outline-none"
        />
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
        <div className="flex justify-end items-center gap-3 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

