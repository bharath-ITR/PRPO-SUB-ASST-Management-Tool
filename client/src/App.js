import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./Pages/Home/Home";
import { setAuthenticated } from "./redux/UserSlice";
// import "./App.css";
import Approve from "./Pages/Approve";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/SideBar/Sidebar";
import History from "./Pages/History/History";
import ContactUs from "./Pages/ContactUs/ContactUs";
import LendingPage from "./Pages/LendingPage/LendingPage";
import Approvers from "./Pages/Approvers/Approvers";
import AdminHome from "./Pages/AdminPages/AdminHome";
import Notfound from "./Pages/NotFound/Notfound";
import Main from "./Pages/Main/Main";
import Footer from "./components/Footer/Footer";
import POForm from "./Pages/POCreation/POForm";
import PurchaseOrder from "./Pages/PurchaseOrder/PurchaseOrder";
import Manage from "./Pages/Manage/Manage";
import VendorForm from "./Pages/Manage/VendorForm";
import AdminTable from "./Pages/AdminPages/AdminTable";
import CreateCategory from "./Pages/Manage/CreateCategory";
import ViewUsers from "./Pages/Manage/ViewUsers";
import ViewVendors from "./Pages/Manage/ViewVendors";
import { Bounce, ToastContainer } from "react-toastify";
// Subscriptions Pages
import Dashboard from "./SubscriptionsPages/Dashboard";
import Subscriptions from "./SubscriptionsPages/Subscriptions";
import SubscriptionDetails from "./SubscriptionsPages/SubscriptionDetails";
import Assets from "./SubscriptionsPages/Assets";
import AssetDetails from "./SubscriptionsPages/AssetDetails";

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user.user);
  const [isSidebarOn, setIsSidebarOn] = useState(true);
  const [buttonLeft, setButtonLeft] = useState(60);
  const location = useLocation();
  const [heading, setHeading] = useState("");


  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const user = localStorage.getItem("accessToken");
    if (user) {
      dispatch(setAuthenticated());
    }
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
    switch (location.pathname) {
      case "/purchase-requisition":
        setHeading("Purchase Requisition");
        break;
      case "/purchase-order-creation":
        setHeading("Purchase Order Creation");
        break;
      case "/action":
        setHeading("Purchase Requisition");
        break;
      case "/history":
        setHeading("Purchase Requisition");
        break;
      case "/approvers":
        setHeading("Purchase Requisition");
        break;
      case "/contactus":
        setHeading("Purchase Requisition");
        break;
      case "/admin":
        setHeading("Purchase Requisition");
        break;
      case "/purchase-order":
        setHeading("Purchase Requisition");
        break;
      case "/admin-table":
        setHeading("Purchase Requisition");
        break;
      case "/manage":
        setHeading("Purchase Requisition");
        break;
      case "/subscriptions":
      case "/subscriptions-dashboard":
        setHeading("Manage Subscriptions");
        break;
      default:
        setHeading("");
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOn(!isSidebarOn);
    setButtonLeft(isSidebarOn ? 60 : 200);
  };

  const sidebarWidth = isSidebarOn ? "200px" : "90px";
  const contentWidth = isSidebarOn ? "calc(100% - 200px)" : "calc(100% - 90px)";
  const leftmargin = isSidebarOn ? "200px" : "90px";
  
return (
  <div className="h-full dark:bg-[#09090B] relative">
    {/* Show Navbar only if user is authenticated */}
    {isAuthenticated && <Navbar user={user} heading={heading} />}

    {/* App Routes */}
    <Routes>
      {/* Default Route */}
      <Route
        path="/"
        element={
          user ? (
            isAdmin ? <Navigate to="/admin" replace /> : <Main setHeading={setHeading} />
          ) : (
            <LendingPage />
          )
        }
      />

      {/* User Routes */}
      {!isAdmin && (
        <>
          <Route path="/purchase-requisition" element={<Home />} />
          <Route path="/purchase-order-creation/:id" element={<POForm />} />
          <Route path="/action" element={<Approve />} />
          <Route path="/history" element={<History />} />
          <Route path="/approvers" element={<Approvers />} />
          <Route path="/contactus" element={<ContactUs />} />
          {/* Subscriptions Routes */}
          <Route path="/subscriptions-dashboard" element={<Dashboard />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/subscriptions/:id" element={<SubscriptionDetails />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/assets/:id" element={<AssetDetails />} />
        </>
      )}

      {/* Admin Routes */}
      {isAdmin && (
        <>
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/purchase-requisition" element={<Home />} />
          <Route path="/purchase-order" element={<PurchaseOrder />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/vendor-onboard" element={<VendorForm />} />
          <Route path="/admin-table" element={<AdminTable />} />
          <Route path="/create-category" element={<CreateCategory />} />
          <Route path="/view-users" element={<ViewUsers />} />
          <Route path="/view-vendors" element={<ViewVendors />} />
          <Route path="/approvers" element={<Approvers />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/history" element={<History />} />
          <Route path="/purchase-order-creation/:id" element={<POForm />} />
          {/* Subscriptions Routes */}
          <Route path="/subscriptions-dashboard" element={<Dashboard />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/subscriptions/:id" element={<SubscriptionDetails />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/assets/:id" element={<AssetDetails />} />
        </>
      )}

      {/* Catch-all route */}
      <Route path="*" element={<Notfound />} />
    </Routes>

    {/* Toast Notifications */}
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
    />
  </div>
);

};

export default App;
