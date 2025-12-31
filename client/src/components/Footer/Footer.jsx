import React from 'react';
import './Footer.css';// Import CSS for styling
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import logo from "./../Assist/FullLogo.png";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
 
 
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer_container">
        <div className='logo-social'>
          <img src={logo} height={60} width="auto"/>        
          <div className='footer_socials'>
            <a href='' target='blank'><FacebookIcon /></a>
            <a href='' target='blank'><InstagramIcon /></a>
            <a href='' target='blank'><XIcon /></a>
            <a href='' target='blank'><LinkedInIcon /></a>
          </div>
        </div>
        <div className="links">
          <div>
          <h1 className='linkHeader'>Explore</h1>
            <div className='quickLinks'>
              <li>About Us</li>
              <li>Blogs</li>
              <li>News</li>
              <li>Contact Us</li>
            </div>
          </div>
          <div>
          <h1 className='linkHeader'>Useful Links</h1>
            <div className='quickLinks'>
              <li>SAP Suite</li>
              <li>Salesforce</li>
              <li>Career</li>
            </div>
          </div>
        </div>
        <div className='subscribe'>
            <h1 className='linkHeader'>Subscribe Now</h1>
            <input placeholder='Enter your email' className='mail'></input>
            <button>Subscribe</button>
        </div>
      </div>
      <hr/>
      <div className='bottom'>
      <p><span>Privacy Policy </span> •<span> Terms & Conditions</span></p>
      </div>
    </footer>
  );
};
 
export default Footer;
