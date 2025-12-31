import React, { useState } from 'react';
import { logout } from '../../../redux/AdminSlice';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';

const AdminNavbar = ({ isSidebarOn }) => {
  const apiUrl = process.env.REACT_APP_API;

  const email = useSelector((state) => state.admin.admin.email);
  const [forget, setForget] = useState(false);

  const [isShow, setIsShow] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = () => {
    console.log('click');
    dispatch(logout());
  };
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleUpdated = async (e) => {
    e.preventDefault();

    // Validation

    // Reset error
    setError('');

    try {
      // Send data to server (replace with your actual API call)
      const response = await fetch(`${apiUrl}/forgetpass`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email, // Include user's email
          newPassword,
          confirmPassword,
        }),
      });
      const data = await response.json();
      // Handle server response
      if (response.ok) {
        // Password updated successfully, handle success (e.g., redirect)
        console.log('Password updated successfully');
      } else {
        // Handle server error
        setError(data.error || 'Failed to update password');
      }
    } catch (error) {
      setError('Error while updating password');
    }
  };

  return (
    <div className={`navbar ${isSidebarOn ? '' : 'navbar-off'}`}>
      <div className="navbar_wrapper">
        <div className="otherAction">
          {/*  <Searchbar/> */}
          <h1 className='animate-charcter'>Dashboard</h1>

          <div className="profileContainer" >
            {/*  <NotificationsNoneIcon style={{fontSize:30,color:'#090855 '}}/> */}
            <img
              src="https://thumbs.dreamstime.com/b/flat-male-avatar-image-beard-hairstyle-businessman-profile-icon-vector-179285629.jpg"
              className='profileImage'
              alt='profile'
              onClick={() => setIsShow(!isShow)}
            />
            {isShow && (
              <div className="profile_wrapper">

                <div className='profile_data'>
                  <div className="profile_data_wrapper">
                    <p style={{ color: 'black' }}>{email}</p>
                    <CloseIcon className='closeIcons' onClick={() => setIsShow(false)} />
                  </div>

                  <img
                    src="https://thumbs.dreamstime.com/b/flat-male-avatar-image-beard-hairstyle-businessman-profile-icon-vector-179285629.jpg"
                    className='userProfile'
                    alt='profile'
                  />

                  <div className="btn-danger">
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                  <div className="forgetBtn">
                    <span onClick={() => setForget(!forget)}>Change Password</span>
                  </div>
                  {forget && (
                    <div className="forget">

                      <div className="forget_wrappers" >
                        <form onSubmit={handleUpdated} className='form_wrapper'>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                          />
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                          />
                          {error && <div style={{ color: 'red' }}>{error}</div>}
                          <div className="btn-change">
                            <button type="submit">Continue</button>

                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
