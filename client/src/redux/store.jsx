
import {combineReducers, createStore,applyMiddleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import userReducer from './UserSlice';
import adminReducer from './AdminSlice'
import thunk from 'redux-thunk';
import { getApproversReducer, getHistoryReducer, getRequestReducer, getUserReducer,getVendorReducer ,getCategoryReducer, getPodataReducer, getRequestIdReducer, getRequestReportsReducer, getDashboardRequestReducer} from "./DataReducer";
const reducer = combineReducers({
    user:userReducer,
    admin:adminReducer,
    getHistory:getHistoryReducer,
    getApprovers:getApproversReducer,
     getUsers: getUserReducer,
    getRequests:getRequestReducer,
    getVendor: getVendorReducer,
    getCategory:getCategoryReducer,
    getPodata:getPodataReducer,
    getDataById:getRequestIdReducer,
    getRequestReports:getRequestReportsReducer,
    getDashboardRequest:getDashboardRequestReducer
})
const middleware = [thunk];
const Store = createStore(
reducer,composeWithDevTools(applyMiddleware(...middleware))
)
export default Store;
