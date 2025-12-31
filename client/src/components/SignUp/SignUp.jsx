import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthenticated, SignUpUser } from "../../redux/UserSlice";
import { IoPerson, IoMail, IoLockClosed } from "react-icons/io5"; 
import { Button } from "@mui/material";

const SignUp = ({ setSwitchAcc }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await dispatch(SignUpUser({ name, email, password }));

      if (response.payload && response.payload.user) {
        setName("");
        setEmail("");
        setPassword("");
        dispatch(setAuthenticated());
        setSwitchAcc(true);
      } else {
        setError(response.payload.message);
      }
    } catch (error) {
      setError("Something is wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-3">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Sign Up
        </h2>

        <form onSubmit={handleSignUp} className="space-y-5">
          {/* NAME */}
          <div className="relative">
            <IoPerson className="absolute top-3 left-3 text-gray-500 text-xl" />
            <input
              type="text"
              placeholder="Name"
              className="w-full pl-10 pr-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          {/* EMAIL */}
          <div className="relative">
            <IoMail className="absolute top-3 left-3 text-gray-500 text-xl" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-10 pr-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <IoLockClosed className="absolute top-3 left-3 text-gray-500 text-xl" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          {/* ERROR MESSAGE */}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          {/* BUTTON */}
          <div className="pt-2">
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Signup
            </Button>
          </div>
        </form>

        {/* SWITCH TO SIGN IN */}
        <p className="text-center mt-4 text-sm text-gray-700">
          Already have an account?{" "}
          <span
            className="text-blue-600 font-semibold cursor-pointer"
            onClick={() => setSwitchAcc(false)}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
