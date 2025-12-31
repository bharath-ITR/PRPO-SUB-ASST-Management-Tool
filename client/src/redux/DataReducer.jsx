/* 
import * as actionType from './Constants';
export const getHistoryReducer = (state = { history: [] }, action) => {
    switch (action.type) {
        case actionType.GET_HISTORY_SUCCESS:
            return { history: action.payload }
        case actionType.GET_HISTORY_FAIL:
            return { error: action.payload }
        default:
            return state
    }
};
export const getApproversReducer = (state = { approvers: [] }, action) => {
    switch (action.type) {
        case actionType.GET_APPROVERS_SUCCESS:
            return { approvers: action.payload }
        case actionType.GET_APPROVERS_FAIL:
            return { error: action.payload }
        default:
            return state
    }
};

export const getUserReducer = (state = { users: [] }, action) => {
    switch (action.type) {
        case actionType.GET_USER_SUCCESS:
            return { users: action.payload }
        case actionType.GET_USER_FAIL:
            return { error: action.payload }
        default:
            return state
    }
};
export const getRequestReducer = (state = { requests: [] }, action) => {
    switch (action.type) {
        case actionType.GET_REQUESTS_SUCCESSFULLY:
            return { Requests: action.payload }
        case actionType.GET_REQUESTS_FAIL:
            return { error: action.payload }
        default:
            return state
    }
}; */

import * as actionType from './Constants';
export const getHistoryReducer = (state = { history: [] }, action) => {
    switch (action.type) {
        case actionType.GET_HISTORY_SUCCESS:
            return { history: action.payload }
        case actionType.GET_HISTORY_FAIL:
            return { error: action.payload }
        default:
            return state
    }
};
export const getApproversReducer = (state = { approvers: [] }, action) => {
    switch (action.type) {
        case actionType.GET_APPROVERS_SUCCESS:
            return { approvers: action.payload }
        case actionType.GET_APPROVERS_FAIL:
            return { error: action.payload }
        default:
            return state
    }
};

export const getUserReducer = (state = { users: [], error: null }, action) => {
    switch (action.type) {
      case actionType.GET_USER_SUCCESS:
        return { users: action.payload, error: null };
      case actionType.GET_USER_FAIL:
        return { users: [], error: action.payload };
      default:
        return state;
    }
  };
  
export const getRequestReducer = (state = { requests: [] }, action) => {
    switch (action.type) {
        case actionType.GET_REQUESTS_SUCCESSFULLY:
            return { Requests: action.payload }
        case actionType.GET_REQUESTS_FAIL:
            return { error: action.payload }
        default:
            return state
    }
};
// export const getDashboardRequestReducer = (
//   state = { statusCounts: [], monthlyStatusCounts: [], processingCurrency: [] },
//   action
// ) => {
//   switch (action.type) {
//     case actionType.GET_DASHBOARD_REQUESTS_SUCCESSFULLY:
//       return {
//         statusCounts: action.payload.statusCounts,
//         monthlyStatusCounts: action.payload.monthlyStatusCounts,
//         processingCurrency: action.payload.processingCurrency,
//       };
//     case actionType.GET_DASHBOARD_REQUESTS_FAIL:
//       return { error: action.payload };
//     default:
//       return state;
//   }
// };

// Reducer to store raw dashboard data from backend
export const getDashboardRequestReducer = (
  state = { dashboardData: [], error: null },
  action
) => {
  switch (action.type) {
    case actionType.GET_DASHBOARD_REQUESTS_SUCCESSFULLY:
      return {
        ...state,
        dashboardData: action.payload, // raw data from BE
        error: null,
      };
    case actionType.GET_DASHBOARD_REQUESTS_FAIL:
      return { 
        ...state,
        error: action.payload 
      };
    default:
      return state;
  }
};

export const getRequestReportsReducer = (state = { Requests: [] }, action) => {
    switch (action.type) {
        case actionType.GET_REPORTS_REQUESTS_SUCCESSFULLY:
            return { Requests: action.payload }
        case actionType.GET_REPORTS_REQUESTS_FAIL:
            return { error: action.payload }
        default:
            return state
    }
};

export const getRequestIdReducer = (state = { request: [] }, action) => {
    switch (action.type) {
        case actionType.GET_REQUESTS_ID_SUCCESSFULLY:
            return { request: action.payload.data }
        case actionType.GET_REQUESTS_ID_FAIL:
            return { error: action.payload }
        default:
            return state
    }
};


export const getPodataReducer = (state = { podata: [] }, action) => {
    switch (action.type) {
        case actionType.GET_PODATA_SUCCESSFULLY:
            return { Requests: action.payload }
        case actionType.GET_PODATA_FAIL:
            return { error: action.payload }
        default:
            return state
    }
};

export const getVendorReducer  = (state = { vendors: [] }, action) => {
    switch (action.type) {
        case actionType.GET_VENDOR_SUCCESS:
            return { vendors: action.payload }
        case actionType.GET_VENDOR_FAIL:
            return { error: action.payload }
        default:
            return state
    }
};

export const getCategoryReducer  = (state = { Categories: [] }, action) => {
    switch (action.type) {
        case actionType.GET_CATEGORY_SUCCESS:
            return { Categories: action.payload }
        case actionType.GET_CATEGORY_FAIL:
            return { error: action.payload }
        default:
            return state
    }
};