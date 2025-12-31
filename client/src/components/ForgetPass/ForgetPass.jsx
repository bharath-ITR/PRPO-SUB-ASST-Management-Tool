import React, { useState } from 'react';
import './Forgetpass.css'

const ForgetPass = () => {
  const apiUrl = process.env.REACT_APP_API;

    const [email, setEmail] = useState('');
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

        <div className="forget">
           
            <div className="forget_wrapper" >
                <form onSubmit={handleUpdated} className='form_wrapper'>
                    <h4>Change Password</h4>
                    <input type="text" value={email} placeholder='Enter your email'
                        onChange={(e) => setEmail(e.target.value)}
                    />
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
                    <div className="btn-primary">
                        <button type="submit">Submit</button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgetPass;
