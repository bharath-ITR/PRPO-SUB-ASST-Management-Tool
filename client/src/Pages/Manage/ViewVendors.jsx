import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVendor } from "../../redux/Action"; // Import the action
import axios from "axios"; // Import axios for making HTTP requests
import EditIcon from "@mui/icons-material/Edit"; // Import MUI Edit icon
import DeleteIcon from "@mui/icons-material/Delete"; // Import MUI Delete icon
import "./ViewVendors.css"; // Import CSS for styling

const Vendors = () => {
  const apiUrl = process.env.REACT_APP_API;

  const dispatch = useDispatch();
  const { vendors, error } = useSelector((state) => state.getVendor); // Access vendor data from Redux state

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    companyname: "",
    primaryemail: "",
    primarycontactNo: "",
    secondarycontactNo: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    gstNo: "",
  });

  useEffect(() => {
    dispatch(getVendor()); // Fetch vendor data when component mounts
  }, [dispatch]);

  const handleEditClick = (vendor) => {
    setCurrentVendor(vendor);
    setFormData({
      name: vendor.name,
      primaryemail: vendor.primaryemail,
      secondaryemail: vendor.secondaryemail,
      companyname: vendor.companyname,
      primarycontactNo: vendor.primarycontactNo,
      secondarycontactNo: vendor.secondarycontactNo,
      street: vendor.street,
      city: vendor.city,
      state: vendor.state,
      postalCode: vendor.postalCode,
      country: vendor.country,
      gstNo: vendor.gstNo,
    });
    setIsEditPopupOpen(true);
  };

  const handleDeleteClick = (vendor) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete vendor ${vendor.name}?`
    );
    if (confirmed) {
      handleDelete(vendor._id); // Pass vendor ID to handleDelete
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const truncateText = (text, maxLength) => {
    if (text?.length > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }
    return text;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${apiUrl}/vendors/${currentVendor._id}`, formData);
      dispatch(getVendor()); // Refresh vendor list
      setIsEditPopupOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error updating vendor");
    }
  };

  const handleDelete = async (vendorId) => {
    try {
      await axios.delete(`${apiUrl}/account/${vendorId}`); // Use vendorId for deletion
      dispatch(getVendor());
    } catch (err) {
      console.error(err);
      alert("Error deleting vendor");
    }
  };

  return (
    <div className="vendors-container">
      <h2 className="vendors-heading">All Vendors</h2>
      {error && <p className="vendors-error">Error: {error}</p>}
      <table className="vendors-table">
        <thead>
          <tr>
            <th className="vendors-header">Sl No</th>
            <th className="vendors-header">Company Name</th>
            <th className="vendors-header">Email</th>
            <th className="vendors-header">Contact No</th>
            <th className="vendors-header">Address</th>{" "}
            {/* Changed to "Address" */}
            <th className="vendors-header">GST No</th>
            <th className="vendors-header">Edit</th>
            <th className="vendors-header">Delete</th>
          </tr>
        </thead>

        <tbody>
          {vendors && vendors?.length > 0 ? (
            vendors?.map((vendor, index) => (
              <tr key={vendor._id} className="vendors-row">
                <td className="vendors-cell">{index + 1}</td>
                <td className="vendors-cell">
                  {truncateText(vendor.companyname, 20)}
                </td>
                <td className="vendors-cell">
                  {truncateText(vendor.primaryemail, 20)}
                </td>
                <td className="vendors-cell">{vendor.primarycontactNo}</td>
                <td className="vendors-cell">{`${vendor.street}, ${vendor.city}, ${vendor.state}, ${vendor.postalCode}, ${vendor.country}`}</td>{" "}
                {/* Concatenated Address */}
                <td className="vendors-cell">{vendor.gstNo}</td>
                <td className="vendors-cell">
                  <EditIcon
                    className="vendors-icon"
                    onClick={() => handleEditClick(vendor)}
                    style={{ cursor: "pointer", color: "#0c720c" }}
                  />
                </td>
                <td className="vendors-cell">
                  <DeleteIcon
                    className="vendors-icon"
                    onClick={() => handleDeleteClick(vendor)}
                    style={{ cursor: "pointer", color: "#c94444" }}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="vendors-no-data">
                No vendors found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {isEditPopupOpen && (
        <div className="edit-popup1">
          <form onSubmit={handleSubmit} className="edit-form2">
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Primary Email:
              <input
                type="email"
                name="primaryemail"
                value={formData.primaryemail}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Secondary Email:
              <input
                type="email"
                name="secondaryemail"
                value={formData.secondaryemail}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Primary Contact No:
              <input
                type="text"
                name="primarycontactNo"
                value={formData.primarycontactNo}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Secondary Contact No:
              <input
                type="text"
                name="secondarycontactNo"
                value={formData.secondarycontactNo}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Street:
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
              />
            </label>
            <label>
              City:
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </label>
            <label>
              State:
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Postal Code:
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Country:
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              />
            </label>
            {/* <label>
        GST No:
        <input
          type="text"
          name="gstNo"
          value={formData.gstNo}
          onChange={handleInputChange}
        />
      </label> */}
            <div className="form-buttons">
              <button type="submit">Submit</button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setIsEditPopupOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Vendors;
