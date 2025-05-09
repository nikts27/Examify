import {
    FETCH_ALL_EXAMS_FAILURE, 
    FETCH_ALL_EXAMS_REQUEST, 
    FETCH_ALL_EXAMS_SUCCESS,
    FETCH_USER_EXAMS_REQUEST,
    FETCH_USER_EXAMS_SUCCESS,
    FETCH_USER_EXAMS_FAILURE,
    DELETE_EXAM_REQUEST,
    DELETE_EXAM_SUCCESS,
    DELETE_EXAM_FAILURE,
    CREATE_EXAM_REQUEST,
    CREATE_EXAM_SUCCESS,
    CREATE_EXAM_FAILURE,
    REGISTER_FOR_EXAM_REQUEST,
    REGISTER_FOR_EXAM_SUCCESS,
    REGISTER_FOR_EXAM_FAILURE,
    UNREGISTER_FOR_EXAM_REQUEST,
    UNREGISTER_FOR_EXAM_SUCCESS,
    UNREGISTER_FOR_EXAM_FAILURE,
    FETCH_EXAM_REQUEST,
    FETCH_EXAM_SUCCESS,
    FETCH_EXAM_FAILURE
} from "./ActionType";

const initialState = {
    exams: [],
    userExams: [],
    currentExam: null,
    loading: false,
    error: null
};

const examReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ALL_EXAMS_REQUEST:
        case FETCH_USER_EXAMS_REQUEST:
        case DELETE_EXAM_REQUEST:
        case CREATE_EXAM_REQUEST:
        case REGISTER_FOR_EXAM_REQUEST:
        case UNREGISTER_FOR_EXAM_REQUEST:
        case FETCH_EXAM_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        case FETCH_ALL_EXAMS_SUCCESS:
            return {
                ...state,
                loading: false,
                exams: action.payload,
                error: null
            };

        case FETCH_USER_EXAMS_SUCCESS:
            return {
                ...state,
                loading: false,
                userExams: action.payload,
                error: null
            };

        case FETCH_ALL_EXAMS_FAILURE:
        case FETCH_USER_EXAMS_FAILURE:
        case DELETE_EXAM_FAILURE:
        case CREATE_EXAM_FAILURE:
        case REGISTER_FOR_EXAM_FAILURE:
        case UNREGISTER_FOR_EXAM_FAILURE:
        case FETCH_EXAM_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case DELETE_EXAM_SUCCESS:
            return {
                ...state,
                loading: false,
                userExams: state.userExams.filter(exam => exam.examId !== action.payload),
                error: null
            };

        case CREATE_EXAM_SUCCESS:
            return {
                ...state,
                loading: false,
                userExams: [...state.userExams, action.payload],
                error: null
            };

        case REGISTER_FOR_EXAM_SUCCESS:
            return {
                ...state,
                loading: false,
                exams: state.exams.map(exam => 
                    exam.examId === action.payload.examId 
                        ? { ...exam, students: [...exam.students, action.payload.studentId] }
                        : exam
                ),
                userExams: [...state.userExams, action.payload],
                error: null
            };
        
        case UNREGISTER_FOR_EXAM_SUCCESS:
            return {
                ...state,
                loading: false,
                exams: state.exams.map(exam => 
                    exam.examId === action.payload.examId 
                        ? { 
                            ...exam, 
                            students: exam.students.filter(
                                studentId => studentId !== action.payload.studentId
                            )
                        }
                        : exam
                ),
                userExams: Array.isArray(state.selectedExams)
                    ? state.userExams.filter(exam => exam.examId !== action.payload.examId)
                    : [],
                error: null
            };

        case FETCH_EXAM_SUCCESS:
            return {
                ...state,
                loading: false,
                currentExam: action.payload,
                error: null
            };

        default:
            return state;
    }
};

export default examReducer;
