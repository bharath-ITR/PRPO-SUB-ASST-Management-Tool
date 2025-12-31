
import React from 'react';
import { Link } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import './Widgets.css';

const Widgets = ({ title, number, amount, currency, className, link, icon }) => {
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'ListAltIcon':
        return <ListAltIcon style={{ fontSize: 40 ,color:'#19a31c'}} />;
      case 'AttachMoneyIcon':
        return <AttachMoneyIcon style={{ fontSize: 40,color:'#19a31c' }} />;
      case 'CurrencyRupeeIcon':
        return <CurrencyRupeeIcon style={{ fontSize: 40,color:'#19a31c' }} />;
      case 'MonetizationOnIcon':
        return <MonetizationOnIcon style={{ fontSize: 40,color:'#19a31c' }} />;
      default:
        return null;
    }
  };

  return (
    <div className={`widget ${link ? 'clickable' : ''}`}>
      <div className={`widget_box ${className}`}>
        <div className="widget_box_wrapper">
          <div className="widget_icon">
            {getIconComponent(icon)} {/* Render the icon based on the provided prop */}
          </div>
          <div className="title-pr">
            <h3>{title}</h3>
          </div>
          <div style={{ marginTop: 30, lineHeight: 0.5 }}>
            {title === "PR List" ? (
              <Link to={link} style={{ textDecoration: 'none' }}>
                <button className="click-button">CLICK</button>
              </Link>
            ) : (
              <>
                <p>Total Cost: {amount}</p>
                <p>Number: {number}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Widgets;

