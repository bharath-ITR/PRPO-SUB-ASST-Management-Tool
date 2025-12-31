import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoginUser, setAuthenticated } from '../../redux/UserSlice';
import { useNavigate } from 'react-router-dom';
import SignUp from '../SignUp/SignUp';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [switchAcc, setSwitchAcc] = useState(false);
  const [isError, SetIsError] = useState('');

  const { loading } = useSelector((state) => state.user);

  const handleLogin = async (e) => {
    e.preventDefault();

    let userCredentials = { email, password };

    try {
      const response = await dispatch(LoginUser(userCredentials));

      if (response.payload && response.payload.token && response.payload.email) {
        setEmail('');
        setPassword('');
        dispatch(setAuthenticated());
        navigate('/');
      } else {
        SetIsError(response.payload.message);
      }
    } catch (error) {
      SetIsError('Error: ' + error.message);
    }
  };

  if (switchAcc) {
    return <SignUp setSwitchAcc={setSwitchAcc} />;
  }

  return (
    <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-8">
      <form onSubmit={handleLogin} className="space-y-6">
        <h2 className="text-2xl font-bold text-center mb-4">Log In</h2>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />

        {isError && <p className="text-red-600 text-sm">{isError}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'loading...' : 'Login'}
        </button>

        <p className="text-center text-gray-700">
          Don&apos;t have an Account?{' '}
          <button
            type="button"
            onClick={() => setSwitchAcc(true)}
            className="text-blue-600 hover:underline font-semibold"
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
