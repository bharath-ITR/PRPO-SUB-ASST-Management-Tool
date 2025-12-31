// adminSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const saveUserDataToLocalStorage = (adminData) => {
  localStorage.setItem('adminaccessToken', JSON.stringify(adminData));
  console.log('adminData', adminData)
};

const clearUserDataFromLocalStorage = () => {
  localStorage.removeItem('adminaccessToken');
};
export const AdminSignUp = createAsyncThunk(
  'admin/signUp',
  async (userCredentials, { rejectWithValue }) => {
    try {
  const apiUrl = process.env.REACT_APP_API;

      const response = await axios.post(`${apiUrl}/adminsignup`, userCredentials);
      const responseData = response.data;
      saveUserDataToLocalStorage(responseData);
      return responseData;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const AdminLogin = createAsyncThunk(
  'admin/login',
  async (userCredentials, { rejectWithValue }) => {
    try {
  const apiUrl = process.env.REACT_APP_API;

      const response = await axios.post(`${apiUrl}/adminlogin`, userCredentials);
      const responseData = response.data;
      console.log(responseData);
      saveUserDataToLocalStorage(responseData);
      return responseData;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// adminSlice.js

// ... (imports and localStorage functions remain the same)

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    isAdminAuthenticated: !!localStorage.getItem('adminaccessToken'),
    loading: false,
    admin: JSON.parse(localStorage.getItem('adminaccessToken')) || null,
    error: null,
  },
  reducers: {
    setAdminAuthenticated: (state) => {
      state.isAdminAuthenticated = true;
    },
    logout: (state) => {
      state.isAdminAuthenticated = false;
      state.admin = null;
      clearUserDataFromLocalStorage();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AdminLogin.pending, (state) => {
        state.loading = true;
        state.admin = null;
        state.error = null;
      })
      .addCase(AdminLogin.fulfilled, (state, action) => {
        state.loading = false;
        const admin = action.payload;
        console.log(admin);

        if (admin && admin.email && admin.token) {
          state.admin = admin;
          state.isAdminAuthenticated = true;
          state.error = null;
          saveUserDataToLocalStorage(admin);
        } else {
          state.admin = null;
          state.isAdminAuthenticated = false;
          state.error = 'Invalid response data';
          clearUserDataFromLocalStorage();
        }
      })
      .addCase(AdminLogin.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.isAdminAuthenticated = false;
        if (action.payload && action.payload.message === 'Request fail with status code 401') {
          state.error = 'Access denied! Invalid credentials';
        } else {
          state.error = action.payload ? action.payload.message : 'Login failed';
        }
      })
      .addCase(AdminSignUp.pending, (state) => {
        // Separate loading state for signup
        state.loading = true;
        state.admin = null;
        state.error = null;
      })
      .addCase(AdminSignUp.fulfilled, (state, action) => {
        state.loading = false;
        const admin = action.payload;
        console.log(admin);
        if (admin && admin.email && admin.token) {
          state.admin = admin;
          state.isAdminAuthenticated = true;
          state.error = null;
          saveUserDataToLocalStorage(admin);
        } else {
          state.admin = null;
          state.isAdminAuthenticated = false;
          state.error = 'Invalid response data';
          clearUserDataFromLocalStorage();
        }
      })
      .addCase(AdminSignUp.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.isAdminAuthenticated = false;
        state.error = action.payload ? action.payload.message : 'Signup failed';
      });
  },
});

export const { setAdminAuthenticated, logout } = adminSlice.actions;
export default adminSlice.reducer;
