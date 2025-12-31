import React, { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Modal, Tooltip, CircularProgress } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Create as CreateIcon,
  History as HistoryIcon,
  HowToReg as HowToRegIcon,
  ListAlt as ListAltIcon,
  ManageAccounts as ManageAccountsIcon,
  HeadsetMic as HeadsetMicIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/UserSlice";
import FullLogo from "../Assist/FullLogo.png";
import HomeIcon from "@mui/icons-material/Home";
import { motion } from "framer-motion";


const Navbar = ({ heading, isAdmin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = process.env.REACT_APP_API;
  const name = useSelector((state) => state.user?.user?.name);
  const email = useSelector((state) => state.user.user?.email);

  const [open, setOpen] = useState(false);
  const [forget, setForget] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // <- redirect to home page
  };  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleUpdated = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/forgetpass`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword, confirmPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Password Changed Successfully");
        setForget(false);
        setNewPassword("");
        setConfirmPassword("");
        handleClose();
      } else setError(data.error || "Failed to update password");
    } catch {
      setError("Error while updating password");
    } finally {
      setLoading(false);
    }
  };

  const role = useSelector((state) => state.user.user?.role);

  // Common links for non-admin users
  const commonLinks = [
    { to: "/", label: "Home", icon: <HomeIcon fontSize="small" /> },
    {
      to: "/purchase-requisition",
      label: "New Request",
      icon: <CreateIcon fontSize="small" />,
    },

    {
      to: "/history",
      label: "My PRs",
      icon: <HistoryIcon fontSize="small" />,
    },
    {
      to: "/approvers",
      label: "Approvals",
      icon: <HowToRegIcon fontSize="small" />,
    },
    {
      to: "/contactus",
      label: "Contact Us",
      icon: <HeadsetMicIcon fontSize="small" />,
    },
  ];

  // Admin links
  const adminLinks = [
    {
      to: "/admin",
      label: "Dashboard",
      icon: <DashboardIcon fontSize="small" />,
    },
    {
      to: "/purchase-requisition",
      label: "New Request",
      icon: <CreateIcon fontSize="small" />,
    },
       {
      to: "/history",
      label: "My PRs",
      icon: <HistoryIcon fontSize="small" />,
    },
    {
      to: "/approvers",
      label: "Approvals",
      icon: <HowToRegIcon fontSize="small" />,
    },
    {
      to: "/admin-table",
      label: "Reports",
      icon: <ListAltIcon fontSize="small" />,
    },
    {
      to: "/manage",
      label: "Manage",
      icon: <ManageAccountsIcon fontSize="small" />,
    },
  ];

  // Decide links based on role
  const links = role === "admin" ? adminLinks : commonLinks;

  // Determine if we're in Subscriptions section
  const isSubscriptionsRoute = useMemo(() => {
    const subscriptionsRoutes = [
      "/subscriptions-dashboard",
      "/subscriptions",
      "/assets"
    ];
    return subscriptionsRoutes.some(route => 
      location.pathname.startsWith(route)
    );
  }, [location.pathname]);

  const handleAppSwitch = (app) => {
    if (app === "PR-PO") {
      // Navigate to PR-PO home based on role
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      // Navigate to Subscriptions dashboard
      navigate("/subscriptions-dashboard");
    }
  };

  const userInitials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="navbar fixed top-0 left-0 w-full bg-white z-50 shadow transition-all">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-3 shadow-sm relative dark:bg-[#09090B] dark:shadow-[0_2px_2px_gray]">
        {/* Logo + Heading */}
        <div className="flex items-center gap-3">
          <img src={FullLogo} alt="Logo" className="h-8 w-auto" />
          <h1 className="text-lg font-semibold text-gray-800">{heading}</h1>
        </div>

        {/* Desktop Links + Profile Section (aligned right) */}
        <div className="hidden md:flex items-center gap-6 ml-auto">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center relative text-sm font-semibold text-gray-700 hover:text-blue-600 transition ${
                location.pathname === link.to ? "text-blue-600 font-medium" : ""
              }`}
            >
              <div className="flex items-center gap-1 mb-1">
                {link.icon}
                <span>{link.label}</span>
              </div>
              {location.pathname === link.to && (
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-blue-600 rounded-full"></span>
              )}
            </Link>
          ))}

          {/* App Switcher Slider - Only for Admin */}
          {role === "admin" && (
            <div className="ml-4 relative flex bg-gray-200 rounded-full p-0.5 w-32 h-7">
              <motion.div
                className="absolute top-0.5 left-0.5 w-[calc(50%-0.125rem)] h-6 bg-white rounded-full shadow-sm"
                animate={{
                  x: isSubscriptionsRoute ? "calc(100% + 0.125rem)" : 0
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
              />
              <button
                onClick={() => handleAppSwitch("PR-PO")}
                className={`relative z-10 flex-1 text-xs font-medium transition-colors rounded-full ${
                  !isSubscriptionsRoute
                    ? "text-gray-900"
                    : "text-gray-600"
                }`}
              >
                PR-PO
              </button>
              <button
                onClick={() => handleAppSwitch("Subscriptions")}
                className={`relative z-10 flex-1 text-xs font-medium transition-colors rounded-full ${
                  isSubscriptionsRoute
                    ? "text-gray-900"
                    : "text-gray-600"
                }`}
              >
                S & A
              </button>
            </div>
          )}

          {/* Profile Icon */}
          <div
            className="ml-2 h-8 w-8 bg-blue-600 text-white text-sm font-semibold rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition"
            onClick={handleOpen}
            title={email}
          >
            {userInitials}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenu && (
        <div className="md:hidden flex flex-col gap-2 px-4 pb-3 bg-gray-50 border-t border-gray-200 text-sm">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenu(false)}
              className={`flex items-center gap-2 py-1 text-gray-700 hover:text-blue-600 transition ${
                location.pathname === link.to ? "text-blue-600 font-medium" : ""
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          
          {/* Mobile App Switcher - Only for Admin */}
          {role === "admin" && (
            <div className="mt-2 pt-2 border-t border-gray-300">
              <div className="relative flex bg-gray-200 rounded-full p-0.5 w-32 h-7 mx-auto">
                <motion.div
                  className="absolute top-0.5 left-0.5 w-[calc(50%-0.125rem)] h-6 bg-white rounded-full shadow-sm"
                  animate={{
                    x: isSubscriptionsRoute ? "calc(100% + 0.125rem)" : 0
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                />
                <button
                  onClick={() => {
                    handleAppSwitch("PR-PO");
                    setMobileMenu(false);
                  }}
                  className={`relative z-10 flex-1 text-xs font-medium transition-colors rounded-full ${
                    !isSubscriptionsRoute
                      ? "text-gray-900"
                      : "text-gray-600"
                  }`}
                >
                  PR-PO
                </button>
                <button
                  onClick={() => {
                    handleAppSwitch("Subscriptions");
                    setMobileMenu(false);
                  }}
                  className={`relative z-10 flex-1 text-xs font-medium transition-colors rounded-full ${
                    isSubscriptionsRoute
                      ? "text-gray-900"
                      : "text-gray-600"
                  }`}
                >
                  S & A
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Profile Modal */}
      <Modal open={open} onClose={handleClose}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="bg-white rounded-xl shadow-xl w-[90%] sm:w-[400px] p-6 relative">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            >
              <CloseIcon />
            </button>

            {/* User Info */}
            <div className="flex flex-col items-center mt-2">
              <div className="h-20 w-20 bg-blue-600 text-white text-2xl font-semibold rounded-full flex items-center justify-center mb-2">
                {userInitials}
              </div>
              <p className="text-gray-700 text-sm font-medium">{email}</p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <button
                onClick={handleLogout}
                className="w-full flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition text-sm"
              >
                Logout
              </button>

              <button
                onClick={() => setForget(!forget)}
                className="text-blue-600 text-sm hover:underline"
              >
                Change Password
              </button>

              {forget && (
                <form
                  onSubmit={handleUpdated}
                  className="flex flex-col gap-3 w-full mt-3"
                >
                  <input
                    type="password"
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm transition"
                  >
                    {loading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      "Continue"
                    )}
                  </button>
                  {error && (
                    <p className="text-red-500 text-xs text-center mt-1">
                      {error}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Navbar;
