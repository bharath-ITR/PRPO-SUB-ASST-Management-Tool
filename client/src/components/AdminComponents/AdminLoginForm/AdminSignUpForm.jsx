import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuthenticated } from '../../../redux/UserSlice';
import { AdminSignUp } from '../../../redux/AdminSlice';
const AdminSignUpForm = ({ setSwitchAcc }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    let userCredentials = {
      name,
      email,
      password,
    };
    // Validate form inputs
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }



    try {
      const response = await dispatch(AdminSignUp(userCredentials));
    /*   const accessToken = response.data.token;
      console.log(accessToken); */
      // Check if the response indicates a successful signup
      if (response.payload && response.payload.user) {
       /*  localStorage.setItem('accessToken', JSON.stringify(response.payload.user));
       */  setName('');
        setEmail('');
        setPassword('');
        dispatch(setAuthenticated());
        setSwitchAcc(true);
      } else {
        // Handle the case where signup was unsuccessful
        setError('Signup failed. Please check your input data.');
      }
    } catch (error) {
      // Handle any errors here
      setError('Signup failed. An error occurred.');
    }
  };

  return (



    <div className="signup">
      <svg id="sw-js-blob-svg" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg"
        className="svg-background"
      >
        <defs>
          <linearGradient id="sw-gradient" x1="0" x2="1" y1="1" y2="0">
            <stop id="stop1" stopColor="rgba(55, 212.042, 248, 1)" offset="0%"></stop>
            <stop id="stop2" stopColor="rgba(18.346, 28.178, 161.972, 1)" offset="100%"></stop>
          </linearGradient>
        </defs>
        <path
          fill="url(#sw-gradient)"
          d="M19.4,-24.3C25.4,-18.1,30.8,-12.2,33.5,-4.8C36.1,2.6,35.9,11.6,32.6,20.1C29.2,28.6,22.7,36.6,15,37.9C7.4,39.2,-1.5,33.8,-11.2,30.4C-20.8,27,-31.3,25.6,-35.3,19.8C-39.2,14.1,-36.6,4,-34.4,-5.7C-32.2,-15.4,-30.4,-24.7,-24.7,-31C-19.1,-37.3,-9.5,-40.6,-1.4,-38.9C6.7,-37.2,13.4,-30.5,19.4,-24.3Z"
          width="100%"
          height="100%"
          transform="translate(50 50)"
          strokeWidth="0"
          style={{ transition: "all 0.3s ease 0s" }}
          stroke="url(#sw-gradient)"
        ></path>
      </svg>
      <div className="signup_wrapper">
        <form onSubmit={handleSignUp} className='form'>
          <div className="form_wrapper">
            <h2>Sign Up Admin</h2>
            <input type='text' placeholder='Name' onChange={(e) => setName(e.target.value)} value={name} />
            <input type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} value={email} />
            <input type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} value={password} />
            <div className="captions">
              <span>Already have account  <span className='caption_action' onClick={() => setSwitchAcc(false)}>Sign In</span> </span>
            </div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            
            <div className="btn-primary">
              <button >Signup</button>

            </div>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AdminSignUpForm;
