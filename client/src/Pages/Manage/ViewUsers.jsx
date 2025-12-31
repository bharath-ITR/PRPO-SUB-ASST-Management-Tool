import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../../redux/Action'; // Import the action
import './ViewUsers.css';
import axios from 'axios'; // Import axios for making HTTP requests
import EditIcon from '@mui/icons-material/Edit'; // Import MUI Edit icon
import DeleteIcon from '@mui/icons-material/Delete'; // Import MUI Delete icon

const ViewUsers = () => {
  const apiUrl = process.env.REACT_APP_API;

  const dispatch = useDispatch();
  const { users: allUsers, error } = useSelector((state) => state.getUsers);
  
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    dispatch(getUsers()); // Dispatch the action to fetch users when component mounts
  }, [dispatch]);

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      confirmPassword: ''
    });
    setIsEditPopupOpen(true);
  };

  const handleDeleteClick = (user) => {
    const confirmed = window.confirm(`Are you sure you want to delete user ${user.name}?`);
    if (confirmed) {
      handleDelete(user._id); // Pass user ID to handleDelete
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await axios.put(`${apiUrl}/users/${currentUser._id}`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      dispatch(getUsers());
      setIsEditPopupOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error updating user');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${apiUrl}/account/${userId}`); // Use userId for deletion
      dispatch(getUsers());
    } catch (err) {
      console.error(err);
      alert('Error deleting user');
    }
  };

  return (
    <div className="view-users-container">
      <h2 className="view-users-heading">All Users</h2>
      {error && <p className="view-users-error">Error: {error}</p>}
      <table className="view-users-table">
        <thead>
          <tr>
            <th className="view-users-header">S No</th>
            <th className="view-users-header">Name</th>
            <th className="view-users-header">Email</th>
            <th className="view-users-header">Edit</th>
            <th className="view-users-header">Delete</th>
          </tr>
        </thead>
        <tbody>
          {allUsers && allUsers.length > 0 ? (
            allUsers.map((user, index) => (
              <tr key={user._id} className="view-users-row">
                <td className="view-users-cell">{index + 1}</td>
                <td className="view-users-cell">{user.name}</td>
                <td className="view-users-cell">{user.email}</td>
                <td className="view-users-cell">
                  <EditIcon 
                    className="view-users-icon"
                    onClick={() => handleEditClick(user)} 
                    style={{ cursor: 'pointer',color:'#0c720c' }}
                  />
                </td>
                <td className="view-users-cell">
                  <DeleteIcon 
                    className="view-users-icon"
                    onClick={() => handleDeleteClick(user)} 
                    style={{ cursor: 'pointer' ,color:'#c94444'}}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="view-users-no-data">No users found</td>
            </tr>
          )}
        </tbody>
      </table>

      {isEditPopupOpen && (
        <div className="edit-popup">
          <form onSubmit={handleSubmit} className="edit-form1">
            <h3>Edit User</h3>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled
              />
            </label>
            <label>
              New Password:
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Confirm Password:
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </label>
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setIsEditPopupOpen(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ViewUsers;
