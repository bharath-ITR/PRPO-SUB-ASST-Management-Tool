// userSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const saveUserDataToLocalStorage = (userData) => {
  localStorage.setItem('accessToken', JSON.stringify(userData));
  console.log('userData', userData)
};

const clearUserDataFromLocalStorage = () => {
  localStorage.removeItem('accessToken');
};
export const SignUpUser = createAsyncThunk(
  'user/signUpUser',
  async (userCredentials, { rejectWithValue }) => {
    try {
      const apiUrl = process.env.REACT_APP_API;

      const response = await axios.post(`${apiUrl}/signup`, userCredentials);
      const responseData = response.data;
      saveUserDataToLocalStorage(responseData);
      return responseData;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const LoginUser = createAsyncThunk(
  'user/loginUser',
  async (userCredentials, { rejectWithValue }) => {
    try {
      const apiUrl = process.env.REACT_APP_API;
      const response = await axios.post(`${apiUrl}/login`, userCredentials);
      const responseData = response.data;
      console.log(responseData);
      saveUserDataToLocalStorage(responseData);
      return responseData;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// userSlice.js

// ... (imports and localStorage functions remain the same)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuthenticated: !!localStorage.getItem('accessToken'),
    loading: false,
    user: JSON.parse(localStorage.getItem('accessToken')) || null,
    error: null,
  },
  reducers: {
    setAuthenticated: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      clearUserDataFromLocalStorage();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LoginUser.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload;
        if (user && user.email && user.token) {
          state.user = user;
          state.isAuthenticated = true;
          state.error = null;
          saveUserDataToLocalStorage(user);
        } else {
          state.user = null;
          state.isAuthenticated = false;
          state.error = 'Invalid response data';
          clearUserDataFromLocalStorage();
        }
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        if (action.payload && action.payload.message === 'Request fail with status code 401') {
          state.error = 'Access denied! Invalid credentials';
        } else {
          state.error = action.payload ? action.payload.message : 'Login failed';
        }
      })
      .addCase(SignUpUser.pending, (state) => {
        // Separate loading state for signup
        state.loading = true;
        state.user = null;
        state.error = null;
      })
      .addCase(SignUpUser.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload;

        if (user && user.email && user.token) {
          state.user = user;
          state.isAuthenticated = true;
          state.error = null;
          saveUserDataToLocalStorage(user);
        } else {
          state.user = null;
          state.isAuthenticated = false;
          state.error = 'Invalid response data';
          clearUserDataFromLocalStorage();
        }
      })
      .addCase(SignUpUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload ? action.payload.message : 'Signup failed';
      });
  },
});

export const { setAuthenticated, logout } = userSlice.actions;
export default userSlice.reducer;
