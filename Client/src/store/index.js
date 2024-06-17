import { configureStore } from "@reduxjs/toolkit";
// import rootReducer from "../reducers";
import userReducer from "../reducers/userReducer";
import contactReducer from "../reducers/contactReducer";
import authReducer from "../reducers/authReducer";

const store = configureStore({
    reducer: {
        user: userReducer,
        auth: authReducer,
        contact: contactReducer
    }
})

export default store;