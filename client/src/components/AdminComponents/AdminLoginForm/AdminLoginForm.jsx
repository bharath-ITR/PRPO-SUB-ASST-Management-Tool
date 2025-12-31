
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AdminLogin, setAdminAuthenticated } from '../../../redux/AdminSlice';
import AdminSignUpForm from './AdminSignUpForm';

const AdminLoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [switchAcc, setSwitchAcc] = useState(false);
  const [isError,SetIsError] = useState('');
  const { loading, error } = useSelector((state) => state.user);

  const handleLogin = async (e) => {
    e.preventDefault();
    let userCredentials = {
      email,
      password,
    };
    try {
      
      if (!email || !password) {
        // Display an error or prevent the dispatch
        SetIsError('Please enter both email and password');
        return;
      }
      const response = await dispatch(AdminLogin(userCredentials));
      console.log(response); // Log the entire response for debugging purposes

      if (response.payload && response.payload.token && response.payload.email) {

        const user = response.payload;

        /* localStorage.setItem('accessToken', JSON.stringify(user)); */
        setEmail('');
        setPassword('');
        dispatch(setAdminAuthenticated());
        navigate('/'); // Navigate to the home page after successful login
      } else {
        // Handle the case where login was unsuccessful
        SetIsError('Please check your email and password.');
      }
    } catch (error) {
      // Handle any errors here
      SetIsError('Error:', error.message);
    }
  };

  return (
    <>

         {switchAcc ? (
        <AdminSignUpForm setSwitchAcc={setSwitchAcc} />
      ) :
      (
        <div className="login">
          <svg id="sw-js-blob-svg" viewBox="0 0 88 88" xmlns="http://www.w3.org/2000/svg"
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
          <div className="login_wrapper">
            <form onSubmit={handleLogin} className='form'>
              <div className="form_wrapper">
                <h2>Sign In as Admin</h2>
                <input type="text" placeholder='Enter Your email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder='Enter Your Pasword' value={password} onChange={(e) => setPassword(e.target.value)} />
               {/*  {error && (
                  <div style={{ color: 'red' }}>something is wrong.</div>
                )} */}
                
                <div className="captions">
                  <span>If you don't have account than <span className='caption_action' onClick={() => setSwitchAcc(true)}>Sign Up</span> </span>
                </div>
               
                
                <div style={{ color: 'red' }}>{isError} </div>

                <div className="btn-primary">
                  <button type='submit'>{loading ? 'loading...' : 'Login'}</button>
                </div>
               

              </div>
            </form>
           
          </div>
        </div>

      )}
    </>
  )
}
export default AdminLoginForm


