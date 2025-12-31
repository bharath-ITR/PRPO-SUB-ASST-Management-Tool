import React from 'react';
import './Manage.css';
import { Link } from 'react-router-dom';

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';

const Manage = () => {
  return (
    <div className="manage-container">
      <div className="widget1">
        <Link to="/vendor-onboard" className="widget-link">
          <div className="widget-content1">
            <PersonAddIcon className="widget-icon" />
            <h2>Vendor Onboarding</h2>
          </div>
        </Link>
      </div>
      <div className="widget1">
        <Link to="/create-category" className="widget-link">
          <div className="widget-content1">
            <CategoryIcon className="widget-icon" />
            <h2>Create Category</h2>
          </div>
        </Link>
      </div>
      <div className="widget1">
        <div className="widget-content1">
          <PeopleIcon className="widget-icon" />
          <h2>Manage </h2>
          <div className="sub-links">
            <Link to="/view-users" className="sub-link"> Users</Link>
            <Link to="/view-vendors" className="sub-link"> Vendors</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manage;
