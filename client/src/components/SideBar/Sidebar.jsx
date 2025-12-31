import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CreateIcon from '@mui/icons-material/Create';
import HistoryIcon from '@mui/icons-material/History';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import FullLogo from '../Assist/FullLogo.png';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Tooltip } from '@mui/material';
 
const Sidebar = ({ isSidebarOn, onToggle, buttonLeft, isAdmin }) => {
  return (
    <div className={`sidebar ${isSidebarOn ? '' : 'sidebar-off'}`}>
      <div className="sidebar_wrapper">
        <div className="wrapper_container">
          <div className="logo_wrap">
            <div>
              {/* If the sidebar is open, show the full logo, otherwise show the default logo */}
              {isSidebarOn ? (
                <img src={FullLogo} alt="Full Logo" className="logo" />
              ) : (
                <img
                  src="https://media.licdn.com/dms/image/v2/C4E0BAQFDPrfDy0YOgg/company-logo_200_200/company-logo_200_200/0/1630640187054/itradiant_logo?e=2147483647&v=beta&t=OTwJ21fHzgXu0LdgEsJkHE-gn1XkEzS23F3x3vSmCxU"
                  alt="Default Logo"
                  className="shortlogo"
                />
              )}
            </div>
            {/* <img src={FullLogo} alt="Logo" className="logo" /> */}
            {/* {isSidebarOn && (
              <div className="sub_logo">
                <span className="ITlogo">IT</span>
                <p>Radiant</p>
              </div>
            )} */}
          </div>
          <div className="action_container">
            {isAdmin ? (
              <>
                <Tooltip title="Dashboard" placement="top">
                  <Link to="/admin">
                    <DashboardIcon />
                    {isSidebarOn && <span> Dashboard</span>}
                  </Link>
                </Tooltip>
                <Tooltip title="New Request" placement="top">
                  <Link to="/purchase-requisition">
                    <CreateIcon />
                    {isSidebarOn && <span>New Request</span>}
                  </Link>
                </Tooltip>
                <Tooltip title="Approvals" placement="top">
                  <Link to="/approvers">
                    <HowToRegIcon />
                    {isSidebarOn && <span> Approvals</span>}
                  </Link>
                </Tooltip>
                <Tooltip title="History" placement="top">
                  <Link to="/history">
                    <HistoryIcon />
                    {isSidebarOn && <span> History</span>}
                  </Link>
                </Tooltip>
 
             
                <Tooltip title="Reports" placement="top">
                  <Link to="/admin-table">
                    <ListAltIcon />
                    {isSidebarOn && <span> Reports</span>}
                  </Link>
                </Tooltip>
 
                <Tooltip title="Manage" placement="top">
                  <Link to="/manage">
                    <ManageAccountsIcon />
                    {isSidebarOn && <span> Manage</span>}
                  </Link>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="New Request" placement="top">
                  <Link to="/">
                    <CreateIcon />
                    {isSidebarOn && <span>New Request</span>}
                  </Link>
                </Tooltip>
                <Tooltip title="History" placement="top">
                  <Link to="/history">
                    <HistoryIcon />
                    {isSidebarOn && <span> History</span>}
                  </Link>
                </Tooltip>
                <Tooltip title="Approvals" placement="top">
                  <Link to="/approvers">
                    <HowToRegIcon />
                    {isSidebarOn && <span> Approvals</span>}
                  </Link>
                </Tooltip>
                <Tooltip title="Contact Us" placement="top">
                  <Link to="/contactus">
                    <HeadsetMicIcon />
                    {isSidebarOn && <span> Contact Us</span>}
                  </Link>
                </Tooltip>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="toggle-buttons">
        <button onClick={onToggle} style={{ left: `${buttonLeft}px` }}>
          {isSidebarOn ? (
            <ChevronLeftIcon className="leftIcon" style={{ fontSize: 23 }} />
          ) : (
            <ChevronRightIcon className="rightIcon" style={{ fontSize: 23 }} />
          )}
        </button>
      </div>
    </div>
  );
};
 
export default Sidebar;
 
 