import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { setUserData, storeTokenInLS } from "../constants/utilities";
import apiService from "../service/apiService";

export const loginUser = createAsyncThunk('auth/loginUser', async (formData) => {
    return await apiService.postRequest('auth/login', formData);
});

export const addUser = createAsyncThunk('auth/addUser', async (newUser) => {
    return await apiService.postRequest('auth/register', newUser);
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
    return await apiService.postRequest('auth/logout', {});
});

const handleResponse = async (response) => {
    const data = await response.json();
    if (response.ok) {
        return data;
    }

    if (["token expired. please login again", "Access denied. User is not an admin."].includes(data.message)) {
        toast.error(data.message);
        localStorage.clear();
        window.location.replace('/login');
    } else {
        toast.error(data.message);
    }

    return { isError: true, response: data };
};

const userData = JSON.parse(localStorage.getItem("loginUserData")) || null;

const initialState = {
    loginUserData: userData || {
        email: "",
        password: "",
        isAdmin: false,
        name: "",
        _id: "",
    },
    isLoggedIn: !!userData,
    isAdmin: userData?.isAdmin || false,
    isAPIRunning: false,
    loading: false,
    error: null,
    isUserAdded: false,
    response: null,
};

const authReducer = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoadingState: (state, action) => {
            state.loading = action.payload.loading;
        },
        resetState: (state) => {
            state.isUserAdded = false;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        updateLoginUserData: (state, action) => {
            const user = action.payload;
            state.loginUserData = user;
            setUserData(user);
            state.isAdmin = user?.isAdmin;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isUserAdded = false;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const data = action.payload;
                state.loading = false;
                state.error = data.message;

                if (!data.isError) {
                    toast.success(data.message);
                    const { token, user } = data;

                    if (token && user) {
                        localStorage.setItem('token', token);
                        state.token = token;
                        state.loginUserData = user;
                        storeTokenInLS(token);
                        setUserData(user);
                        state.isLoggedIn = true;
                        state.isAdmin = user?.isAdmin;
                    }
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.isUserAdded = false;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loginUserData = {};
                state.isAdmin = false;
                state.isLoggedIn = false;
                state.token = null;
            })
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isUserAdded = false;
                state.response = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                const data = action.payload;
                state.loading = false;
                state.response = data;

                if (!data.isError) {
                    toast.success(data.message);
                    state.isUserAdded = true;
                }
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.isUserAdded = false;
            });
    }
});

export const { setLoadingState, resetState, updateLoginUserData } = authReducer.actions;
export default authReducer.reducer;
