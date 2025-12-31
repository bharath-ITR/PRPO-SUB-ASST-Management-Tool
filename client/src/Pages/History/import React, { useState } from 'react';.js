import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './Home.css';
import { TextField, styled, MenuItem, Select } from '@mui/material';
const Field = styled(TextField)`
width: 30vw;
`;
const DrapDown = styled(Select)`
width: 30vw;

`
const Home = () => {

  const email = useSelector((state) => state.user.user.email);
  const [file, setFile] = useState();
  console.log('file',file);
  
  const [formData, setFormData] = useState({
    purchaseType: '',
    reportingTo: '',
    supervisor: '',
    finance: '',
    location: '',
    productName: '',
    quantity: '',
    approxCost: '',
    date: '',
    productDescription: '',
    productReason: '',
    file: '',
    paymentType: '', // Added paymentType
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  const handleFileInputChange = (e) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const attachment = e.target.files[0];
      setFile(attachment);
      const formDataCopy = new FormData();
      formDataCopy.append('attachment', attachment); // Append the file to FormData
      setFormData((prevFormData) => ({
        ...prevFormData,
        attachment: formDataCopy,
      }));
    }
  };
  

  function formatDateToDDMMYY(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(2); // Take the last two digits of the year
    return `${day}-${month}-${year}`;
  }

 
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append('usermail', email);
    formDataToSend.append('purchaseType', formData.purchaseType);
    formDataToSend.append('date', formatDateToDDMMYY(new Date(formData.date)));
    formDataToSend.append('reportingTo', formData.reportingTo);
    formDataToSend.append('supervisor', formData.supervisor);
    formDataToSend.append('finance', formData.finance);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('productDescription', formData.productDescription);
    formDataToSend.append('approxCost', formData.approxCost);
    formDataToSend.append('quantity', formData.quantity);
    formDataToSend.append('productName', formData.productName);
    formDataToSend.append('productReason', formData.productReason);
    formDataToSend.append('paymentType', formData.paymentType);
  
    // Check if an attachment is present before appending it to FormData
    if (file) {
      console.log(file);
      formDataToSend.append('attachment', file);
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API}/sendEmail`, {
        method: 'POST',
      
        body: formDataToSend,
      });
  
      console.log(response);
  
      if (response.ok) {
        alert('Email sent successfully.');
      } else {
        alert('Email sending failed.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Email sending failed.');
    }
  };
  
  
  return (
    <div className="home">
      <div className="home_wrapper">
        <h2>Purchase Requisition</h2>
        <form onSubmit={handleSubmit} className='form' encType="multipart/form-data">
          <div className="input-field-wrapper">

            <div className="input-field">
              <Field type="email" id="standard-basic Email" label="Your Email" variant="outlined" value={email} readOnly />
            </div>

            <div className="input-field">
              <DrapDown
                labelId="purchaseType-label"
                id="purchaseType-select"
                value={formData.purchaseType || ''}
                onChange={handleInputChange}
                name="purchaseType"
                displayEmpty
                required
              >
                <MenuItem value="" disabled>Purchase Type</MenuItem>
                <MenuItem value="Office supplies">Office supplies</MenuItem>
                <MenuItem value="Activities">Activities</MenuItem>
                <MenuItem value="Product And Service">Product And Service</MenuItem>
                <MenuItem value="Capital Expenditure">Capital Expenditure</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
              </DrapDown>
            </div>
            <div className="input-field">
              <Field id="standard-basic reportingTo" label="Approver1" variant="outlined"
                type="email"
                name='reportingTo'
                value={formData.reportingTo || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-field">
              <Field id="standard-basic supervisor" label="Approver2" variant="outlined"
                type="email"
                name='supervisor'
                value={formData.supervisor || ''}
                onChange={handleInputChange} required
              />
            </div>
            <div className="input-field">
              <Field id="standard-basic finance" label="Approver3" variant="outlined"
                type="email"
                name='finance'
                value={formData.finance || ''}
                onChange={handleInputChange} required
              />
            </div>
            <div className="input-field">

              <Field id="standard-basic location" label="Location" variant="outlined"
                type="text"
                name='location'
                value={formData.location || ''}
                required onChange={handleInputChange}
              />
            </div>
            <div className="input-field">
              <Field id="standard-basic productName" label="Product Name" variant="outlined"
                type="text"
                name='productName'
                value={formData.productName || ''}
                required
                onChange={handleInputChange}
              />
            </div>
            <div className="input-field" >
              <Field id="standard-basic quantity" label="Quantity" variant="outlined"
                type="text"
                name='quantity'
                value={formData.quantity || ''}
                required onChange={handleInputChange}
              />
            </div>
            <div className="input-field" >
              <Field id="standard-basic approxCost" label="Approx Cost" variant="outlined"
                type="text"
                name='approxCost'
                value={formData.approxCost || ''}
                required onChange={handleInputChange}
              />
            </div>
            <div className="input-field">
              <Field
                id="standard-basic date"
                label="Date"
                variant="outlined"
                type="date"
                name="date"
                value={formData.date}
                required
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div className="input-field">
              <Field id="standard-basic productDescription" label="Product Description" variant="outlined"
                type="text"
                name='productDescription'
                value={formData.productDescription || ''}
                required onChange={handleInputChange}
              />
            </div>
            <div className="input-field">
              <Field id="standard-basic 
               productReason" label="Product Reason" variant="outlined"
                type="text"
                name='productReason'
                value={formData.productReason || ''}
                required onChange={handleInputChange}
              />
            </div>

            <div className="input-field">
              <DrapDown
                labelId="paymentType-label"
                id="paymentType-select"
                value={formData.paymentType || ''}
                onChange={handleInputChange}
                name="paymentType"
                displayEmpty
                required
              >
                <MenuItem value="" disabled>Payment Type</MenuItem>
                <MenuItem value="One Time Payment">One Time Payment</MenuItem>
                <MenuItem value="Recurring Payment Monthly">Recurring Payment Monthly</MenuItem>
                <MenuItem value="Recurring Payment Quarterly">Recurring Payment Quarterly</MenuItem>
                <MenuItem value="Recurring Payment Halfy Yearly">Recurring Payment Halfy Yearly</MenuItem>
                <MenuItem value="Recurring Payment Yearly">Recurring Payment Yearly</MenuItem>
              </DrapDown>
            </div>

            <div className="input-field">
              <Field
                id="standard-basic attachment"
                type="file"
                variant="outlined"
                name="attachment"
                onChange={handleFileInputChange}
                /* onChange={(e)=>setFile(e.target.files[0])} */
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
          </div>

          <div className="submitButton">
            <button type="submit" className='submitBtn'>Submit</button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Home;





