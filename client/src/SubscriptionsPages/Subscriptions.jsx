import { useEffect, useMemo, useState,useRef} from "react";
import { motion,animate } from "framer-motion";
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
import { FiCalendar, FiAlertTriangle, FiXCircle, FiPlus, FiGrid, FiList, FiUser, FiSearch } from "react-icons/fi";
import { api } from "../SubscriptionsServices/api";
import SubscriptionCard from "../SubscriptionsComponents/SubscriptionCard";
import SubscriptionTable from "../SubscriptionsComponents/SubscriptionTable";
import AssetFilterSortBar from "../SubscriptionsComponents/AssetFilterSortBar";
import ConfirmModal from "../SubscriptionsComponents/ConfirmModal";
import { getWarrantyStatus } from "../SubscriptionsUtils/warrantyStatus";
import EditSubscriptionModal from "../SubscriptionsComponents/EditSubscriptionModal";
import Toast from "../SubscriptionsComponents/Toast";
import { useToast } from "../SubscriptionsHooks/useToast";
import AddSubscriptionModal from "../SubscriptionsComponents/AddSubscriptionModal";


/* ---------- Animated Counter ---------- */
function AnimatedNumber({ value }) {
  const ref = useRef(null);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate(v) {
        if (ref.current) {
          ref.current.textContent = Math.round(v);
        }
      }
    });

    return () => controls.stop();
  }, [value]);

  return <span ref={ref}>0</span>;
}


export default function Subscriptions() {
  const [subs, setSubs] = useState([]);

  const resultsRef = useRef(null);
  
  const [view, setView] = useState("card");
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("name");

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  const [confirm, setConfirm] = useState(null);

  const [selectedSub, setSelectedSub] = useState(null);

  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const { toast, showToast, clearToast } = useToast();

  const [showAdd, setShowAdd] = useState(false);

const [newSub, setNewSub] = useState({
  name: "",
  vendor: "",
  billingCycle: "",
  cost: "",
  costCurrency: "₹",
  dueDate: "",
  owners: []
});




  // ---------------- FETCH ----------------
  useEffect(() => {
    api.get("/subscriptions").then(res => {
      const normalized = res.data.map(s => ({
        ...s,
        owners: s.owners?.length ? s.owners : (s.owner ? [s.owner] : [])
      }));
      setSubs(normalized);
    });
  }, []);

  // ---------------- KPI CALC ----------------
  const kpis = useMemo(() => {
    // let totalCost = 0;
    let expired = 0;
    let expiringSoon = 0;
    let upcoming = 0

    const today = new Date();
    const m = today.getMonth();
    const y = today.getFullYear();

    subs.forEach(s => {
      const status = getWarrantyStatus(s.dueDate);
      const due = new Date(s.dueDate);

      // totalCost += Number(s.cost || 0);
      if (status.label === "Expired") expired++;
      if (status.label === "Expiring Soon") expiringSoon++;
if (status.label === "Upcoming") upcoming++;

    });

    return { expired, expiringSoon, upcoming };
  }, [subs]);

  // ---------------- ANALYTICS DATA ----------------
  const {
    spendingTrendData,
    renewalCalendarData,
    costByVendorData,
    currencySymbol,
    hasOtherCurrencies,
    currencies
  } = useMemo(() => {
    if (!subs || subs.length === 0) {
      return {
        spendingTrendData: [],
        renewalCalendarData: [],
        costByVendorData: [],
        currencySymbol: "₹",
        hasOtherCurrencies: false,
        currencies: []
      };
    }

    const defaultCurrency = "₹";
    const detectedCurrencies = Array.from(
      new Set(
        subs
          .map((s) => s.costCurrency)
          .filter(Boolean)
      )
    );

    if (detectedCurrencies.length === 0) {
      detectedCurrencies.push(defaultCurrency);
    }

    const activeCurrency =
      selectedCurrency && detectedCurrencies.includes(selectedCurrency)
        ? selectedCurrency
        : detectedCurrencies[0];

    const hasOtherCurrencies = detectedCurrencies.length > 1;

    const byMonthSpending = new Map();
    const byMonthRenewals = new Map();
    const byVendor = new Map();

    subs.forEach((s) => {
      const cost = Number(s.cost || 0);
      const due = s.dueDate ? new Date(s.dueDate) : null;
      if (!due || Number.isNaN(due.getTime())) return;

      const ymKey = `${due.getFullYear()}-${String(due.getMonth() + 1).padStart(2, "0")}`;
      const label = due.toLocaleString("default", { month: "short", year: "2-digit" });

      // Spending trend
      // Only include subscriptions in the active currency to avoid mixing currencies
      if (!s.costCurrency || s.costCurrency === activeCurrency) {
        if (!byMonthSpending.has(ymKey)) {
          byMonthSpending.set(ymKey, { month: label, total: 0 });
        }
        if (cost > 0) {
          byMonthSpending.get(ymKey).total += cost;
        }
      }

      // Renewal calendar (count of renewals)
      if (!byMonthRenewals.has(ymKey)) {
        byMonthRenewals.set(ymKey, { month: label, count: 0 });
      }
      byMonthRenewals.get(ymKey).count += 1;

      // Cost by vendor
      if (
        s.vendor &&
        cost > 0 &&
        (!s.costCurrency || s.costCurrency === activeCurrency)
      ) {
        if (!byVendor.has(s.vendor)) {
          byVendor.set(s.vendor, { vendor: s.vendor, total: 0 });
        }
        byVendor.get(s.vendor).total += cost;
      }
    });

    const sortByMonthKey = (entries) =>
      entries.sort((a, b) => (a.key > b.key ? 1 : -1)).map((x) => x.value);

    const spendingTrendData = sortByMonthKey(
      Array.from(byMonthSpending.entries()).map(([key, value]) => ({ key, value }))
    );

    const renewalCalendarData = sortByMonthKey(
      Array.from(byMonthRenewals.entries()).map(([key, value]) => ({ key, value }))
    );

    const costByVendorData = Array.from(byVendor.values()).sort(
      (a, b) => b.total - a.total
    );

    return {
      spendingTrendData,
      renewalCalendarData,
      costByVendorData,
      currencySymbol: activeCurrency,
      hasOtherCurrencies,
      currencies: detectedCurrencies
    };
  }, [subs, selectedCurrency]);



  /* ---------- KPI INTERACTIONS ---------- */
  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKpiClick = (type) => {
    setFilter(type);
    setPage(1);
    scrollToResults();
  };

  const handleKpiReset = () => {
    setFilter("all");
    setPage(1);
  };



  // ---------------- FILTER + SORT + SEARCH ----------------
  const processedSubs = useMemo(() => {
    const q = search.trim().toLowerCase();

    const fullTextMatch = (s) => {
      if (!q) return true;

      const ownerNames = (s.owners || [])
        .map(o => `${o.name || ""} ${o.email || ""}`.toLowerCase())
        .join(" ");

      return [
        s.name,
        s.vendor,
        s.billingCycle,
        s.status,
        s.costCurrency,
      ]
        .filter(Boolean)
        .some(val => String(val).toLowerCase().includes(q))
        || ownerNames.includes(q);
    };

    return [...subs]
      .filter(fullTextMatch)
      .filter(s => {
        if (filter === "all") return true;
        const status = getWarrantyStatus(s.dueDate).label;
        if (filter === "expired") return status === "Expired";
        if (filter === "expiring") return status === "Expiring Soon";
        if (filter === "upcoming") return status === "Upcoming";
        if (filter === "valid") return status === "Valid";
        return true;
      })
      .sort((a, b) => {
        if (sort === "name") return a.name.localeCompare(b.name);
        if (sort === "priority") {
          return (
            getWarrantyStatus(a.dueDate).priority -
            getWarrantyStatus(b.dueDate).priority
          );
        }
        if (sort === "expiry") {
          return (
            new Date(a.dueDate || "9999-12-31") -
            new Date(b.dueDate || "9999-12-31")
          );
        }
        return 0;
      });
  }, [subs, search, filter, sort]);

  // ---------------- SEARCH SUGGESTIONS ----------------
  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      return;
    }

    const pool = subs.slice(0, 100); // cap for safety

    const nameMatches = new Set();
    const vendorMatches = new Set();
    const ownerMatches = new Set();

    pool.forEach((s) => {
      if (s.name?.toLowerCase().includes(q)) {
        nameMatches.add(s.name);
      }
      if (s.vendor?.toLowerCase().includes(q)) {
        vendorMatches.add(s.vendor);
      }
      (s.owners || []).forEach((o) => {
        const label = o.name || o.email;
        if (label?.toLowerCase().includes(q)) {
          ownerMatches.add(label);
        }
      });
    });

    const toItems = (set, type, icon) =>
      Array.from(set).slice(0, 5).map((label) => ({ type, label, icon }));

    const next = [
      ...toItems(nameMatches, "Name", <FiSearch className="text-blue-500" />),
      ...toItems(vendorMatches, "Vendor", <FiSearch className="text-emerald-500" />),
      ...toItems(ownerMatches, "Owner", <FiUser className="text-indigo-500" />),
    ].slice(0, 10);

    setSuggestions(next);
  }, [search, subs]);

  const applySuggestion = (label) => {
    setSearch(label);
    setSuggestions([]);
    setPage(1);
  };

  // ---------------- PAGINATION ----------------
  const totalPages = Math.ceil(processedSubs.length / PAGE_SIZE);
  const paginatedSubs = processedSubs.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => setPage(1), [search, filter, sort]);

  // ---------------- DELETE ----------------
  const handleDelete = (id) => {
    setConfirm({
      title: "Delete Subscription",
      message: "Are you sure? This action cannot be undone.",
     action: async () => {
  const prev = subs;
  setSubs(subs.filter(s => s._id !== id));
  setConfirm(null);

  try {
    await api.delete(`/subscriptions/${id}`);
    showToast("Subscription deleted", "success");
  } catch {
    setSubs(prev);
    showToast("Failed to delete subscription", "error");
  }
}
    });
  };

const handleEdit = (sub) => {
  setSelectedSub({ 
    costCurrency: "₹", 
    ...sub, 
    owners: sub.owners?.length ? sub.owners : (sub.owner ? [sub.owner] : [])
  });
};

const handleChange = (e) => {
  const { name, value } = e.target;
  setSelectedSub(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = async () => {
  const prev = subs;

  setSubs(subs.map(s =>
    s._id === selectedSub._id ? selectedSub : s
  ));
  setSelectedSub(null);

  try {
    await api.put(`/subscriptions/${selectedSub._id}`, selectedSub);
    showToast("Subscription updated successfully", "success");
  } catch {
    setSubs(prev);
    showToast("Failed to update subscription", "error");
  }
};


const handleAddChange = (e) => {
  const { name, value } = e.target;
  setNewSub(prev => ({ ...prev, [name]: value }));
};

const handleAddSubmit = async () => {
  try {
    const res = await api.post("/subscriptions", {
      ...newSub,
      status: "ACTIVE"
    });

    const normalized = {
      ...res.data,
      owners: res.data.owners?.length ? res.data.owners : (res.data.owner ? [res.data.owner] : [])
    };

    setSubs(prev => [normalized, ...prev]);
    setShowAdd(false);
    setNewSub({
      name: "",
      vendor: "",
      billingCycle: "",
      cost: "",
      costCurrency: "₹",
      dueDate: "",
      owners: []
    });

    showToast("Subscription added successfully", "success");
  } catch {
    showToast("Failed to add subscription", "error");
  }
};




  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Subscriptions</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Track renewals, cost & expiry risks
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
              Add Subscription
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

          {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Kpi
          title="Upcoming"
          value={kpis.upcoming}
          color="orange"
          icon={<FiCalendar />}
          onClick={() => handleKpiClick("upcoming")}
          onDoubleClick={handleKpiReset}
        />
        <Kpi
          title="Expiring Soon"
          value={kpis.expiringSoon}
          color="yellow"
          icon={<FiAlertTriangle />}
          onClick={() => handleKpiClick("expiring")}
          onDoubleClick={handleKpiReset}
        />
        <Kpi
          title="Expired"
          value={kpis.expired}
          color="red"
          icon={<FiXCircle />}
          onClick={() => handleKpiClick("expired")}
          onDoubleClick={handleKpiReset}
        />
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Spending Trend */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Spending Trend
              </p>
              <p className="text-sm text-gray-500">
                {currencySymbol} per month (based on renewal cost)
              </p>
              {hasOtherCurrencies && (
                <p className="mt-1 text-[11px] text-amber-500">
                  Showing amounts in {currencySymbol} only; subscriptions in other currencies
                  are excluded from totals.
                </p>
              )}
            </div>
            {currencies.length > 1 && (
              <div className="flex items-center">
                <div className="inline-flex items-center bg-gray-100 rounded-full p-0.5">
                  {currencies.map((cur) => {
                    const isActive = cur === currencySymbol;
                    return (
                      <button
                        key={cur}
                        type="button"
                        onClick={() => setSelectedCurrency(cur)}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-all ${
                          isActive
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        {cur}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="h-48">
            {spendingTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendingTrendData}>
                  <defs>
                    <linearGradient id="subSpending" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    formatter={(val) => [`${currencySymbol}${val}`, "Total"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#2563eb"
                    fillOpacity={1}
                    fill="url(#subSpending)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-gray-400">
                Not enough data to show spending trend.
              </p>
            )}
          </div>
        </div>

        {/* Renewal Calendar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Renewal Calendar
              </p>
              <p className="text-sm text-gray-500">
                Count of renewals by month
              </p>
            </div>
          </div>
          <div className="h-48">
            {renewalCalendarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={renewalCalendarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-gray-400">
                Not enough data to show renewal calendar.
              </p>
            )}
          </div>
        </div>

        {/* Cost by Vendor */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Cost by Vendor
              </p>
              <p className="text-sm text-gray-500">
                {currencySymbol} total per vendor
              </p>
              {hasOtherCurrencies && (
                <p className="mt-1 text-[11px] text-amber-500">
                  Showing amounts in {currencySymbol} only; subscriptions in other currencies
                  are excluded from totals.
                </p>
              )}
            </div>
          </div>
          <div className="h-48 flex items-center justify-center">
            {costByVendorData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costByVendorData}
                    dataKey="total"
                    nameKey="vendor"
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
                          key={`cell-${entry.vendor}-${index}`}
                          fill={colors[index % colors.length]}
                        />
                      );
                    })}
                  </Pie>
                  <Tooltip
                    formatter={(val, _name, { payload }) => [
                      `${currencySymbol}${val}`,
                      payload.vendor
                    ]}
                  />
                  <Legend layout="horizontal" verticalAlign="bottom" height={24} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-gray-400">
                Not enough data to show cost breakdown.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <label
          htmlFor="subscription-search"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Search Subscriptions
        </label>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            id="subscription-search"
            className="w-full border-2 border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
            placeholder="Full-text search by name, vendor, owner, status, billing cycle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 120)}
            autoComplete="off"
          />
        </div>

        {isFocused && suggestions.length > 0 && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((sug, idx) => (
              <button
                key={`${sug.type}-${sug.label}-${idx}`}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault(); // avoid input blur before applying
                  applySuggestion(sug.label);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-left hover:bg-gray-50"
              >
                <span>{sug.icon}</span>
                <span className="truncate">{sug.label}</span>
                <span className="ml-auto text-[10px] uppercase tracking-wide text-gray-400">
                  {sug.type}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <AssetFilterSortBar
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        setSort={setSort}
      />

      {/* Content */}
      <div ref={resultsRef}>
      {view === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {paginatedSubs.map(sub => (
            <SubscriptionCard
              key={sub._id}
              sub={sub}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <SubscriptionTable
            data={paginatedSubs}
            allData={processedSubs}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}
      </div>
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

      {confirm && (
        <ConfirmModal
          title={confirm.title}
          message={confirm.message}
          onConfirm={confirm.action}
          onCancel={() => setConfirm(null)}
        />
      )}

      {toast && (
  <Toast
    message={toast.message}
    type={toast.type}
    onClose={clearToast}
  />
)}


      {selectedSub && (
  <EditSubscriptionModal
    subscription={selectedSub}
    onChange={handleChange}
    onSubmit={handleSubmit}
    onClose={() => setSelectedSub(null)}
  />
)}

{showAdd && (
  <AddSubscriptionModal
    form={newSub}
    onChange={handleAddChange}
    onSubmit={handleAddSubmit}
    onClose={() => setShowAdd(false)}
  />
)}


    </div>
  );
}

function Kpi({ title, value, color, icon, onClick, onDoubleClick }) {
  const palette = {
    orange: { bg: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-100" },
    yellow: { bg: "bg-yellow-50", text: "text-amber-700", ring: "ring-yellow-100" },
    red: { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-100" },
    default: { bg: "bg-gray-50", text: "text-gray-700", ring: "ring-gray-100" }
  };

  const theme = palette[color] || palette.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer select-none"
    >
      <div
        className={`h-12 w-12 rounded-full flex items-center justify-center ${theme.bg} ${theme.text} ring-4 ${theme.ring}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className={`text-2xl font-semibold ${theme.text}`}>
          <AnimatedNumber value={value} />
        </p>
      </div>
    </motion.div>
  );
}


