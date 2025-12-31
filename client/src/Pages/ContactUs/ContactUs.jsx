import React from "react";
import "./ContactUs.css";
import { Divider } from "@mui/material";

const ContactUs = () => {
  return (
    <div className="contact-container">
      <div className="contact">
        <div className="column">
          <h2>POC-1</h2>
          <Divider/>
          <p>
            <strong>Name:</strong> ITR Support
          </p>
          <p>
            <strong>Email:</strong> support@itradiant.com
          </p>
          <p>
            <strong>Contact:</strong> +91 1234567890
          </p>
          <p>
            <strong>Address:</strong> ITRadiant Solutions Pvt. Ltd, Capital Park, Image Gardens Road, Madhapur, Hyderabad-500081 Telangana
          </p>
        </div>
        <div className="column">
          <h2>POC-2</h2>
          <Divider/>
          <p>
            <strong>Name:</strong> Lavina Lalwani
          </p>
          <p>
            <strong>Email:</strong> lavina.l@itradiant.com
          </p>
          <p>
            <strong>Contact:</strong> +1234567890
          </p>
          <p>
            <strong>Address:</strong> ITRadiant Solutions Pvt. Ltd, Capital Park, Image Gardens Road, Madhapur, Hyderabad-500081 Telangana
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
