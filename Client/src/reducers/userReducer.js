import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { toast } from "react-toastify";
import apiService from "../service/apiService";

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (params) => {
    return await apiService.getRequest(params ? `user?${params.toString()}` : 'user');
});

export const fetchUsersById = createAsyncThunk('users/fetchUsersById', async (id, isLoginUser) => {
    return await apiService.getRequest(isLoginUser ? `user/me/${id}` : `user/${id}`);
    // return await middleware(response);
});

export const addUser = createAsyncThunk('users/addUser', async (newUser) => {
    return await apiService.postRequest('user/register', newUser);
});

export const updateUser = createAsyncThunk('users/updateUser', async (updatedUser) => {
    return await apiService.patchRequest(`user/${updatedUser?.userID}`, updatedUser.formData);
});

export const removeUser = createAsyncThunk('users/removeUser', async (userID) => {
    return await apiService.deleteRequest(`user/${userID}`);
});

const getUsersFLS = () => {
    if (localStorage.getItem('user')) {
        return JSON.parse(localStorage.getItem('user'));
    }
    return [];
}

const initState = {
    users: getUsersFLS(),
    isUserAdded: false,
    isUserUpdated: false,
    isUserDeleted: false,
    data: null,
    user: {},
    loading: false,
    error: null,
    userData: {
        userName: "",
        email: "",
        mobileNumber: "",
    },
    response: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
}

const userReducer = createSlice({
    name: 'user',
    initialState: initState,
    reducers: {
        resetUserState: (state, action) => {
            state.userData = {
                userName: "",
                email: "",
                mobileNumber: "",
            };
            state.loading = false;
            state.error = null;
            state.user = {};
            state.users = [];

        },
        // getUser: (state) => {
        //     return state.users;
        // },
        // updateAddUserFlag: (state, action) => {
        //     return state.isUserAdded = action.payload;
        // },
        // addUser: (state, action) => {
        //     const user = action.payload;
        //     try {
        //         fetch(`${BASE_URL}user/register`, {
        //             method: "POST",
        //             headers: {
        //                 "Content-Type": "application/json",
        //             },
        //             body: JSON.stringify(user),
        //         })
        //             .then(response => {
        //                 if (!response.ok) {
        //                     throw new Error('Network response was not ok');
        //                 }
        //                 return response.json();
        //             })
        //             .then(data => {
        //                 // Do something with the parsed data
        //                 
        //                 if (data) {
        //                     toast.success(data.message);
        //                     
        //                     // state.isUserAdded = true;
        //                     dispatch(updateAddUserFlag(true));
        //                     // useState.users.push(data);
        //                 } else {
        //                     state.isUserAdded = false;
        //                     toast.error(data.message);
        //                 }
        //             })
        //             .catch(error => {
        //                 // Handle any errors that occurred during the fetch
        //                 console.error('There was a problem with the fetch operation:', error);
        //             });
        //     } catch (error) {
        //         console.log("getting error while submitting", error);
        //         // toast.error("getting error while submitting");
        //     }
        // },
        // removeUser: (state, action) => {
        //     state.users = state.users.filter(item => item._id != action.payload);
        //     localStorage.setItem('user', JSON.stringify(state.users));
        // },
        // updateUser: (state, action) => {
        //     state.users.map(item => {
        //         if (item._id === action.payload._id) {
        //             item.userName = action.payload.userName;
        //             item.email = action.payload.email;
        //             item.password = action.payload.password;
        //             item.mobileNumber = action.payload.mobileNumber;
        //             item.isAdmin = action.payload.isAdmin;
        //         }
        //     })
        //     localStorage.setItem('user', JSON.stringify(state.users));
        // }
    }, extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.isUserUpdated = false;
                state.loading = true;
                state.error = null;
                state.status = 'loading';
                state.response = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isUserUpdated = false;
                state.loading = false;
                state.status = 'succeeded';
                state.users = action.payload.users;
                state.response = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.status = 'rejected';
                state.response = null;
                state.error = action.error.message;

            })
            .addCase(fetchUsersById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = 'loading';
                state.response = null;
            })
            .addCase(fetchUsersById.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.userData = action.payload.userData;
                state.response = action.payload;
            })
            .addCase(fetchUsersById.rejected, (state, action) => {
                state.loading = false;
                state.status = 'rejected';
                state.response = null;
                state.error = action.error.message;

            })
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isUserAdded = false;
                state.status = 'loading';
                state.response = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                const data = action.payload;
                state.loading = false;
                state.status = 'succeeded';
                state.response = action.payload;
                if (!data.isError) {
                    toast.success(data.message);
                    state.users.push(data.user);
                    state.isUserAdded = true;
                }
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.status = 'rejected';
                state.response = null;
                state.error = action.error.message;
                state.isUserAdded = false;

            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isUserUpdated = false;
                state.status = 'loading';
                state.response = null;
                state.user = {};
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const data = action.payload;
                state.loading = false;
                state.status = 'succeeded';
                state.response = action.payload;
                if (!data.isError) {
                    state.loading = false;
                    state.status = 'succeeded';
                    state.isUserUpdated = true;
                    state.user = data.user;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.status = 'rejected';
                state.response = null;
                state.error = action.error.message;
                state.isUserUpdated = false;
                state.user = {};
            })
            .addCase(removeUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isUserDeleted = false;
                state.status = 'loading';
                state.response = null;
            })
            .addCase(removeUser.fulfilled, (state, action) => {
                const data = action.payload;
                state.loading = false;
                state.status = 'succeeded';
                state.response = data;
                if (!data.isError) {
                    toast.success(data.message);
                    state.isUserDeleted = true;
                }
            })
            .addCase(removeUser.rejected, (state, action) => {
                state.loading = false;
                state.status = 'rejected';
                state.response = null;
                state.error = action.error.message;
                state.isUserDeleted = false;

            });
    },
})

export const { resetUserState } = userReducer.actions;

export default userReducer.reducer;