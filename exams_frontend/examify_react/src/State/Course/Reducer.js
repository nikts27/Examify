import { FETCH_USER_COURSES_FAILURE, FETCH_USER_COURSES_REQUEST, FETCH_USER_COURSES_SUCCESS } from "./ActionTypes";

const initialState = {
    courses: [],
    loading: false,
    error: null
};

const courseReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USER_COURSES_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        
        case FETCH_USER_COURSES_SUCCESS:
            return {
                ...state,
                loading: false,
                courses: action.payload,
                error: null
            };
        
        case FETCH_USER_COURSES_FAILURE:
            return {
                ...state,
                loading: false,
                courses: [],
                error: action.payload
            };
        
        default:
            return state;
    }
};

export default courseReducer;