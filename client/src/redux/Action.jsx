/* // api.js
import axios from 'axios';
import * as actionTypes from './Constants';

 
const apiUrl = process.env.REACT_APP_API;
  
export const getHistory = (userEmail) => async (dispatch) => {
  
  try {

    const { data } = await axios.post(`${apiUrl}/getData`,{email:userEmail});
    dispatch({ type: actionTypes.GET_HISTORY_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({ type: actionTypes.GET_HISTORY_FAIL, payload: error.message });
  }
}

export const updateHistory = (userEmail) => async (dispatch) => {
  
  try {

    const { data } = await axios.put(`${apiUrl}/updateData`);
    dispatch({ type: actionTypes.UPDATE_HISTORY_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({ type: actionTypes.UPDATE_HISTORY_FAIL, payload: error.message });
  }
}

export const getApprovers = (userEmail) => async (dispatch) => {
  try {
    const { data } = await axios.post(`${apiUrl}/getApprovers`,{email:userEmail});
    dispatch({ type: actionTypes.GET_APPROVERS_SUCCESS, payload: data });
    console.log(data);
    return data;

  } catch (error) {
    dispatch({ type: actionTypes.GET_APPROVERS_FAIL, payload: error.message });
  }
}

export const getUsers = () => async (dispatch) => {
  try {
      const {data} = await axios.get(`${apiUrl}/allUsers`);
       console.log(data);
      dispatch({type:actionTypes.GET_USER_SUCCESS,payload:data})
  } catch (error) {
      dispatch({type:actionTypes.GET_USER_FAIL,payload:error.message})

  }
}
export const getRequests = () => async (dispatch) => {
  try {
      const {data} = await axios.get(`${apiUrl}/userData`);
       console.log(data);
      dispatch({type:actionTypes.GET_REQUESTS_SUCCESSFULLY,payload:data})
  } catch (error) {
      dispatch({type:actionTypes.GET_REQUESTS_FAIL,payload:error.message})

  }
}

export const getVendor = () => async (dispatch) => {
  try {
      const {data} = await axios.get(`${apiUrl}/vendorData`);
       console.log(data);
      dispatch({type:actionTypes.GET_VENDOR_SUCCESS,payload:data})
  } catch (error) {
      dispatch({type:actionTypes.GET_VENDOR_FAIL,payload:error.message})

  }
}
 */

// api.js
import axios from 'axios';
import * as actionTypes from './Constants';


const apiUrl = process.env.REACT_APP_API;

// export const getHistory = (userEmail, page = 1, limit = 10) => async (dispatch) => {

//   try {

//     const { data } = await axios.post(`${apiUrl}/getData`,{
//       params: { email: userEmail, page, limit }
//     });
//     dispatch({ type: actionTypes.GET_HISTORY_SUCCESS, payload: data });
//     return data;
//   } catch (error) {
//     dispatch({ type: actionTypes.GET_HISTORY_FAIL, payload: error.message });
//   }
// }


export const getHistory = (userEmail, page = 1, limit = 10, search = "") => async (dispatch) => {
  try {
    const { data } = await axios.get(`${apiUrl}/getData`, {
      params: { email: userEmail, page, limit, search },
    });
    dispatch({ type: actionTypes.GET_HISTORY_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({ type: actionTypes.GET_HISTORY_FAIL, payload: error.message });
  }
};




export const updateHistory = (userEmail) => async (dispatch) => {

  try {

    const { data } = await axios.put(`${apiUrl}/updateData`);
    dispatch({ type: actionTypes.UPDATE_HISTORY_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({ type: actionTypes.UPDATE_HISTORY_FAIL, payload: error.message });
  }
}

// export const getApprovers = (userEmail) => async (dispatch) => {
//   try {
//     const { data } = await axios.post(`${apiUrl}/getApprovers`,{email:userEmail});
//     dispatch({ type: actionTypes.GET_APPROVERS_SUCCESS, payload: data });
//     console.log(data);
//     return data;

//   } catch (error) {
//     dispatch({ type: actionTypes.GET_APPROVERS_FAIL, payload: error.message });
//   }
// }

export const getApprovers = (userEmail, page = 1, limit = 10, search, fromDate, toDate) => async (dispatch) => {
  try {
    const { data } = await axios.get(`${apiUrl}/getApprovers`, {
      params: { email: userEmail, page, limit, search, fromDate, toDate }

    });
    dispatch({ type: actionTypes.GET_APPROVERS_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({ type: actionTypes.GET_APPROVERS_FAIL, payload: error.message });
  }
};


export const getUsers = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${apiUrl}/allUsers`);
    console.log(data);
    dispatch({ type: actionTypes.GET_USER_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: actionTypes.GET_USER_FAIL, payload: error.message })

  }
}
// export const getRequests = () => async (dispatch) => {
//   try {
//       const {data} = await axios.get(`${apiUrl}/userData`);
//        console.log(data);
//       dispatch({type:actionTypes.GET_REQUESTS_SUCCESSFULLY,payload:data})
//   } catch (error) {
//       dispatch({type:actionTypes.GET_REQUESTS_FAIL,payload:error.message})

//   }
// }
// redux/Action.js
export const getRequests = (page = 1, limit = 10, search = "") => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/userData?page=${page}&limit=${limit}&search=${search}`
    );

    dispatch({
      type: actionTypes.GET_REQUESTS_SUCCESSFULLY,
      payload: data, // data now contains { page, limit, totalPages, totalRecords, data }
    });
  } catch (error) {
    dispatch({
      type: actionTypes.GET_REQUESTS_FAIL,
      payload: error.message,
    });
  }
};

export const getRequestForDashboard = () => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/dashboard`
    );

    dispatch({
      type: actionTypes.GET_DASHBOARD_REQUESTS_SUCCESSFULLY,
      payload: data, // data now contains { page, limit, totalPages, totalRecords, data }
    });
  } catch (error) {
    dispatch({
      type: actionTypes.GET_DASHBOARD_REQUESTS_FAIL,
      payload: error.message,
    });
  }
};

export const getReports = (page = 1, limit = 10, search = "", fromDate = "", toDate = "",status = "") => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/reports?page=${page}&limit=${limit}&search=${search}&fromDate=${fromDate}&toDate=${toDate}&status=${status}`
    );

    dispatch({
      type: actionTypes.GET_REPORTS_REQUESTS_SUCCESSFULLY,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: actionTypes.GET_REPORTS_REQUESTS_FAIL,
      payload: error.message,
    });
  }
};




export const getRequestById = (id) => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `${apiUrl}/userData/${id}`
    );

    dispatch({
      type: actionTypes.GET_REQUESTS_ID_SUCCESSFULLY,
      payload: data, // data now contains { page, limit, totalPages, totalRecords, data }
    });
  } catch (error) {
    dispatch({
      type: actionTypes.GET_REQUESTS_ID_FAIL,
      payload: error.message,
    });
  }
};

export const getPodata = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${apiUrl}/podata`);
    console.log(data);
    dispatch({ type: actionTypes.GET_PODATA_SUCCESSFULLY, payload: data })
  } catch (error) {
    dispatch({ type: actionTypes.GET_PODATA_FAIL, payload: error.message })

  }
}

export const getVendor = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${apiUrl}/vendorData`);
    console.log(data);
    dispatch({ type: actionTypes.GET_VENDOR_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: actionTypes.GET_VENDOR_FAIL, payload: error.message })

  }
}

export const getCategory = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${apiUrl}/getCategory`);
    console.log(data);
    dispatch({ type: actionTypes.GET_CATEGORY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: actionTypes.GET_CATEGORY_FAIL, payload: error.message });
  }
};
