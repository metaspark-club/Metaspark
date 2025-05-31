import { combineReducers } from "@reduxjs/toolkit";
import postReducer from "./slices/postSlice";
import authReducer from "./slices/authSlice";

const rootReducer = combineReducers({ auth: authReducer, posts: postReducer });

export default rootReducer;
