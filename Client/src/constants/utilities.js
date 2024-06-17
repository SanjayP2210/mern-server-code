let keysToRemove = ["token", "loginUserData"];

export const getJWTToken = () => localStorage.getItem('token');
export let authorizationToken = `Bearer ${getJWTToken()}`;
export const isLoggedIn = getJWTToken();

const setJWTToken = (token) => {
    localStorage.setItem('token', token);
};

export const setUserData = (userData) => {
    localStorage.setItem('loginUserData', JSON.stringify(userData));
}

export const storeTokenInLS = (serverToken) => {
    setJWTToken(serverToken);
    return localStorage.setItem("token", serverToken);
};

const clearLocalStorage = () => {
    for (let key of keysToRemove) {
        localStorage.removeItem(key);
    }
}
export const LogoutUser = () => {
    setJWTToken(null);
    return clearLocalStorage();
};


export const checkPassword = (password) => {
    const strength = {
        1: "weak",
        2: "medium",
        3: "strong",
        4: "strong",
    };

    const getIndicator = (password, strengthValue) => {
        strengthValue.upper = /[A-Z]/.test(password);
        strengthValue.lower = /[a-z]/.test(password);
        strengthValue.numbers = /\d/.test(password);
        strengthValue.length = password.length > 7;

        let strengthIndicator = 0;

        for (let metric in strengthValue) {
            if (strengthValue[metric] === true) {
                strengthIndicator++;
            }
        }

        return strength[strengthIndicator] ?? "";
    };

    const getStrength = (password) => {
        let strengthValue = {
            upper: false,
            numbers: false,
            lower: false,
        };

        return getIndicator(password, strengthValue);
    };

    return getStrength(password);

}