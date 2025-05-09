import {SUBMIT_ANSWERS_REQUEST, SUBMIT_ANSWERS_SUCCESS, SUBMIT_ANSWERS_FAILURE,
    FETCH_STUDENT_SUBMISSIONS_REQUEST, FETCH_STUDENT_SUBMISSIONS_SUCCESS, FETCH_STUDENT_SUBMISSIONS_FAILURE,
    FETCH_EXAM_SUBMISSIONS_REQUEST,
    FETCH_EXAM_SUBMISSIONS_SUCCESS,
    FETCH_EXAM_SUBMISSIONS_FAILURE,
    GRADE_SUBMISSION_REQUEST,
    GRADE_SUBMISSION_SUCCESS,
    GRADE_SUBMISSION_FAILURE
} from "@/State/Submit/ActionTypes.js";
import api from "@/config/api.js";

export const submitExam = (examId, answers) => async (dispatch) => {
    dispatch({ type: SUBMIT_ANSWERS_REQUEST });

    try {
        const response = await api.post('/submit', {
            examId,
            answers: answers.map(({ questionId, selectedOption }) => ({
                questionId,
                selectedOption: selectedOption
            }))
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
                'Content-Type': 'application/json'
            }
        });

        dispatch({
            type: SUBMIT_ANSWERS_SUCCESS,
            payload: response.data
        });

        return response.data;
    } catch (error) {
        dispatch({
            type: SUBMIT_ANSWERS_FAILURE,
            payload: error.message
        });
        throw error;
    }
};

export const fetchUserSubmissions = () => async (dispatch) => {
    dispatch({ type: FETCH_STUDENT_SUBMISSIONS_REQUEST });

    try {
        const response = await api.get('/submit/student', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        });

        dispatch({
            type: FETCH_STUDENT_SUBMISSIONS_SUCCESS,
            payload: response.data
        });

        return response.data;
    } catch (error) {
        dispatch({
            type: FETCH_STUDENT_SUBMISSIONS_FAILURE,
            payload: error.message
        });
        throw error;
    }
};

export const fetchExamSubmissions = (examId) => async (dispatch) => {
    dispatch({ type: FETCH_EXAM_SUBMISSIONS_REQUEST });

    try {
        const response = await api.get(`/submit/exam/${examId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        });

        dispatch({
            type: FETCH_EXAM_SUBMISSIONS_SUCCESS,
            payload: response.data
        });

        return response.data;
    } catch (error) {
        dispatch({
            type: FETCH_EXAM_SUBMISSIONS_FAILURE,
            payload: error.message
        });
        throw error;
    }
};

export const gradeSubmission = (submissionId, typicalQuestionScores) => async (dispatch) => {
    dispatch({ type: GRADE_SUBMISSION_REQUEST });

    try {
        const response = await api.post(
            `/submit/submissions/${submissionId}/grade`,
            typicalQuestionScores,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        dispatch({
            type: GRADE_SUBMISSION_SUCCESS,
            payload: response.data
        });

        return response.data;
    } catch (error) {
        dispatch({
            type: GRADE_SUBMISSION_FAILURE,
            payload: error.message
        });
        throw error;
    }
};