
import React, { useState } from 'react';
import './VendorForm.css';
import axios from 'axios';
 
const VendorOnboarding = () => {
  const apiUrl = process.env.REACT_APP_API;

  const [formData, setFormData] = useState({
    name: '',
    companyname:'',
    primaryemail: '',
    secondaryemail: '',
    primarycontactNo: '',
    secondarycontactNo:'',
    street: '',
    area:'',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    gstNo: '',
  });
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData); // Check the payload being sent
    try {
      const response = await axios.post(`${apiUrl}/vendor-add`, formData);
      console.log(response.data);
      alert('Vendor added successfully!');
     
      // Clear form data
      setFormData({
        name: '',
        companyname:'',
        primaryemail: '',
        secondaryemail: '',
        primarycontactNo: '',
        secondarycontactNo:'',
        street: '',
        area:'',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        gstNo: '',

      });
    } catch (error) {
      console.error('There was an error adding the vendor!', error);
      alert('Error adding vendor');
    }
  };
 
  return (
    <div className="vendor-form-container">
      <form className="vendor-form" onSubmit={handleSubmit}>
        <h2>Vendor Onboarding</h2>
        <div className="form-group-container">
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Comapny Name</label>
            <input
        type="text"
        name="companyname"
        value={formData.companyname || ''}  // Ensure there's a fallback to avoid `undefined` errors
        onChange={handleChange}
        required
    />
          </div>
          <div className="form-group">
            <label>Primary Email</label>
            <input type="email" name="primaryemail" value={formData.primaryemail} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Secondary Email</label>
            <input type="email" name="secondaryemail" value={formData.secondaryemail} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Primary Contact No</label>
            <input type="text" name="primarycontactNo" value={formData.primarycontactNo} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Secondary Contact No</label>
            <input type="text" name="secondarycontactNo" value={formData.secondarycontactNo} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Street</label>
            <input type="text" name="street" value={formData.street} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Area</label>
            <input type="text" name="area" value={formData.Area} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>State</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Postal Code</label>
            <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input type="text" name="country" value={formData.country} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>GST No</label>
            <input type="text" name="gstNo" value={formData.gstNo} onChange={handleChange} required />
          </div>
        </div>
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};
 
export default VendorOnboarding;
 
 