import {
    GET_USER_FAILURE,
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS, LOGOUT
} from "@/State/Auth/ActionTypes.js";
import axiosInstance from "@/State/Auth/Interceptor.js";

export const login = (userData, navigate) => async(dispatch) => {

    dispatch({type: LOGIN_REQUEST});

    const baseUrl = "http://localhost:5456";

    try {
        const response = await axiosInstance.post(`${baseUrl}/auth/signin`, userData);
        const user = response.data;
        console.log(user);

        dispatch({type: LOGIN_SUCCESS, payload: user.jwtAccess});
        localStorage.setItem("jwt", user.jwtAccess);
        localStorage.setItem("refreshToken", user.jwtRefresh);

        navigate("/home");
    } catch (error) {
        dispatch({type: LOGIN_FAILURE, payload: error.message});
        throw error;
    }

}

export const refreshToken = () => async (dispatch) => {
    const baseUrl = "http://localhost:5456";
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
        console.log("No refresh token found!");
        return;
    }

    try {
        const response = await axiosInstance.post(`${baseUrl}/auth/refresh-token`, { refreshToken });
        const { jwtAccess, jwtRefresh } = response.data;

        localStorage.setItem("jwt", jwtAccess);
        localStorage.setItem("refreshToken", jwtRefresh);

        dispatch({ type: LOGIN_SUCCESS, payload: jwtAccess });

    } catch (error) {
        console.log("Error refreshing token:", error);
        dispatch({ type: LOGOUT });
        localStorage.clear();
    }
};

export const getUser = (jwt) => async (dispatch) => {

    dispatch({ type: GET_USER_REQUEST });

    try {
        const response = await axiosInstance.get("/api/users/profile", {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        const user = response.data;

        dispatch({ type: GET_USER_SUCCESS, payload: user });
    } catch (error) {
        dispatch({ type: GET_USER_FAILURE, payload: error.message });
        console.log(error);
    }
};

export const logout = () => (dispatch) => {
    localStorage.clear();
    dispatch({type: LOGOUT});
}