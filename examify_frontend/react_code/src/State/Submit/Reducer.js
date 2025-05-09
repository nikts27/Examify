import {
    SUBMIT_ANSWERS_REQUEST,
    SUBMIT_ANSWERS_SUCCESS,
    SUBMIT_ANSWERS_FAILURE,
    FETCH_STUDENT_SUBMISSIONS_REQUEST,
    FETCH_STUDENT_SUBMISSIONS_SUCCESS,
    FETCH_STUDENT_SUBMISSIONS_FAILURE,
    FETCH_EXAM_SUBMISSIONS_REQUEST,
    FETCH_EXAM_SUBMISSIONS_SUCCESS,
    FETCH_EXAM_SUBMISSIONS_FAILURE,
    GRADE_SUBMISSION_REQUEST,
    GRADE_SUBMISSION_SUCCESS,
    GRADE_SUBMISSION_FAILURE
} from "@/State/Submit/ActionTypes.js";

const initialState = {
    submission: null,
    submissions: [],
    examSubmissions: [],
    loading: false,
    error: null
};

const submitReducer = (state = initialState, action) => {
    switch (action.type) {
        case SUBMIT_ANSWERS_REQUEST:
        case FETCH_STUDENT_SUBMISSIONS_REQUEST:
        case FETCH_EXAM_SUBMISSIONS_REQUEST:
        case GRADE_SUBMISSION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        case SUBMIT_ANSWERS_SUCCESS:
            return {
                ...state,
                loading: false,
                submission: action.payload,
                submissions: [...state.submissions, action.payload],
                error: null
            };

        case FETCH_STUDENT_SUBMISSIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                submissions: action.payload,
                error: null
            };

        case FETCH_EXAM_SUBMISSIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                examSubmissions: action.payload,
                error: null
            };

        case GRADE_SUBMISSION_SUCCESS:
            return {
                ...state,
                loading: false,
                examSubmissions: state.examSubmissions.map(sub =>
                    sub.id === action.payload.id ? action.payload : sub
                ),
                error: null
            };

        case SUBMIT_ANSWERS_FAILURE:
        case FETCH_STUDENT_SUBMISSIONS_FAILURE:
        case FETCH_EXAM_SUBMISSIONS_FAILURE:
        case GRADE_SUBMISSION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }
};

export default submitReducer;
