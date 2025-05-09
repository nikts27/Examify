import api from "@/config/api.js";
import { FETCH_USER_COURSES_FAILURE, FETCH_USER_COURSES_REQUEST, FETCH_USER_COURSES_SUCCESS } from "./ActionTypes.js";

export const fetchUserCourses = () => async (dispatch) => {
    dispatch({ type: FETCH_USER_COURSES_REQUEST });

    try {
        const response = await api.get("/users/courses", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        });
        
        dispatch({ 
            type: FETCH_USER_COURSES_SUCCESS, 
            payload: response.data  
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        dispatch({ 
            type: FETCH_USER_COURSES_FAILURE, 
            payload: error.message 
        });
    }
};