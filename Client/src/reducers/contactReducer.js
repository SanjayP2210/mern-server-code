import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiService from "../service/apiService";
import { toast } from "react-toastify";

export const fetchContact = createAsyncThunk('/contact/fetchContact', async () => {
    return await apiService.getRequest('contact');
})

export const createContact = createAsyncThunk('/contact/createContact', async (payload) => {
    return await apiService.postRequest('contact', payload);
})

export const deleteContact = createAsyncThunk('/contact/deleteContact', async (id) => {
    return await apiService.deleteRequest(`contact/${id}`);
})

const initialState = {
    contacts: [],
    loading: false,
    error: null,
    status: '',
    isContactAdded: false,
    isContactDeleted: false
}
const contactReducer = createSlice({
    name: 'contact',
    initialState: initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchContact.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.contacts = [];
            }).addCase(fetchContact.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload;
                state.contacts = data.contacts;
            }).addCase(fetchContact.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.contacts = [];
            })
            .addCase(createContact.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isContactAdded = false;
            }).addCase(createContact.fulfilled, (state, action) => {
                const data = action.payload;
                state.loading = false;
                state.status = 'succeeded';
                if (!data.isError) {
                    toast.success(data.message);
                    state.contacts.push(data.contact);
                    state.isContactAdded = true;
                }

            }).addCase(createContact.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.isContactAdded = false;
            })
            .addCase(deleteContact.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isContactDeleted = false;
            }).addCase(deleteContact.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload;
                state.loading = false;
                state.status = 'succeeded';
                if (!data.isError) {
                    toast.success(data.message);
                    state.isContactDeleted = true;
                }
            }).addCase(deleteContact.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.isContactDeleted = false;
            })
    }
})

export default contactReducer.reducer