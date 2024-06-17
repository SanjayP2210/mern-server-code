import { toast } from "react-toastify";
import { LogoutUser, getJWTToken } from "../constants/utilities";

export let BASE_URL = import.meta.env.VITE_APP_API_URL;
console.log('import.meta.env', import.meta.env)
const middleware = async (response) => {
    if (response.ok && [200, 201].includes(response.status)) {
        return await response.json();
    }
    const data = await response?.json();
    if (
        ["token expired. please login again", "unauthorized user token not provided",
            "Access denied. User is not an admin."].includes(data.message)
    ) {
        toast.error(data.message);
        localStorage.clear();
        LogoutUser();
    }
    toast.error(data.message || 'Something went wrong');
    return { isError: true, response };
}

// Helper function to make API calls
export const apiRequest = async (endpoint, method = 'GET', data = null) => {
    const token = getJWTToken();
    let config = {
        method: method,
        headers: {},
        credentials: 'include' // Include cookies in the request
    };
    if (data) {
        if (data instanceof FormData) {
            // If data is FormData, let the browser set the appropriate headers
            // config.headers['Content-Type'] = 'multipart/form-data';
            config.body = data;
        } else {
            // If data is an object, set Content-Type to application/json
            config.headers['Content-Type'] = 'application/json';
            config.body = JSON.stringify(data);
        }
    }

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/${endpoint}`, config);
    // Access the cookie
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('myCookie='))
        ?.split('=')[1];
    console.log('cookieValue', cookieValue);
    // setCookie(cookieValue);
    // const responseData = await response.json();
    return middleware(response);
};

// Exported API methods
const apiService = {
    getRequest: (endpoint) => apiRequest(endpoint, 'GET', null),
    postRequest: (endpoint, payload) => apiRequest(endpoint, 'POST', payload),
    putRequest: (endpoint, payload) => apiRequest(endpoint, 'PUT', payload),
    patchRequest: (endpoint, payload) => apiRequest(endpoint, 'PATCH', payload),
    deleteRequest: (endpoint) => apiRequest(endpoint, 'DELETE', null),
};

export default apiService;
