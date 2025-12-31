import React from 'react';
import { Link } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CreateIcon from '@mui/icons-material/Create';
import HistoryIcon from '@mui/icons-material/History';
import EmailIcon from '@mui/icons-material/Email';
import Logo from '../../Assist/Logo.png'
const AdminSidebar = ({ isSidebarOn, onToggle, buttonLeft }) => {
  return (
    <div className={`sidebar ${isSidebarOn ? '' : 'sidebar-off'}`}>
     <div className="sidebar_wrapper">
      <div className="wrapper_container">
      <div className="logo_wrap">
        <img src={Logo} alt="" className='logo' />
        {isSidebarOn && <div className='sub_logo'><span className='ITlogo'>IT</span><p>Radiant</p></div> }
      </div>
      <div className="action_container">
        <Link to="/">
          <CreateIcon alt='Create Request' />
          {isSidebarOn && <span>Requests</span>}
        </Link>
        {/* <Link to="/history">
          <HistoryIcon />
          {isSidebarOn && <span> Requests</span>}
        </Link> */}
       {/* <Link to="/">
          <ReportIcon />
          {isSidebarOn && <span> Complain</span>}
        </Link>
        <Link to="/">
          <DarkModeIcon />
          {isSidebarOn && <span> Mode</span>}
        </Link>*/}
        {/* <Link to="/approvers">
          <EmailIcon />
          {isSidebarOn && <span>Analytics</span>}
        </Link> */}
      </div>
      </div>
      </div>
      <div className="toggle-buttons">
        <button onClick={onToggle} style={{ left: `${buttonLeft}px` }}>
        {isSidebarOn ? <ChevronLeftIcon className='leftIcon' style={{ fontSize: 30 }} /> : <ChevronRightIcon className='rightIcon' style={{ fontSize: 30 }} />}

        </button>
        
      </div>
    </div>
  );
};

export default AdminSidebar;
