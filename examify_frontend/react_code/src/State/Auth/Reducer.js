import {
    GET_USER_FAILURE,
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS, LOGOUT
} from "@/State/Auth/ActionTypes.js";

const initialState = {
    user: null,
    loading: false,
    error: null,
    jwt: null,
    refreshToken: null
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
        case GET_USER_REQUEST:
            return{...state, loading: true, error: null};
        case LOGIN_SUCCESS:
            return{...state, loading: false, error: null, jwt: action.payload.jwtAccess, refreshToken: action.payload.jwtRefresh};
        case GET_USER_SUCCESS:
            return{...state, user: action.payload, loading: false, error: null};
        case LOGIN_FAILURE:
        case GET_USER_FAILURE:
            return{...state, loading: false, error: action.payload};
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
}

export default authReducer;