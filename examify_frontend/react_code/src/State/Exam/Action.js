import {FETCH_ALL_EXAMS_REQUEST, FETCH_ALL_EXAMS_SUCCESS, FETCH_ALL_EXAMS_FAILURE,
    FETCH_USER_EXAMS_REQUEST, FETCH_USER_EXAMS_SUCCESS, FETCH_USER_EXAMS_FAILURE,
    CREATE_EXAM_REQUEST, CREATE_EXAM_SUCCESS, CREATE_EXAM_FAILURE,
    DELETE_EXAM_REQUEST,
    DELETE_EXAM_SUCCESS,
    DELETE_EXAM_FAILURE,
    REGISTER_FOR_EXAM_REQUEST,
    REGISTER_FOR_EXAM_SUCCESS,
    REGISTER_FOR_EXAM_FAILURE,
    UNREGISTER_FOR_EXAM_REQUEST,
    UNREGISTER_FOR_EXAM_SUCCESS,
    UNREGISTER_FOR_EXAM_FAILURE,
    FETCH_EXAM_REQUEST,
    FETCH_EXAM_SUCCESS,
    FETCH_EXAM_FAILURE
} from "@/State/Exam/ActionType.js";
import api from "@/config/api.js";

export const fetchExams = () => async (dispatch) => {
    dispatch({ type: FETCH_ALL_EXAMS_REQUEST });

    try {
        const response = await api.get("/exams", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        });
        dispatch({ type: FETCH_ALL_EXAMS_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: FETCH_ALL_EXAMS_FAILURE, payload: error.message });
    }
};

export const fetchUserExams = () => async (dispatch) => {
    dispatch({ type: FETCH_USER_EXAMS_REQUEST });

    try {
        const response = await api.get(`/users/exams`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        });

        dispatch({ type: FETCH_USER_EXAMS_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: FETCH_USER_EXAMS_FAILURE, payload: error.message });
    }
};

export const fetchExamById = (examId) => async (dispatch) => {
    dispatch({ type: FETCH_EXAM_REQUEST });

    try {
        const response = await api.get(`/exams/${examId}`);
        
        dispatch({ 
            type: FETCH_EXAM_SUCCESS, 
            payload: response.data 
        });
        
        return response.data;
    } catch (error) {
        dispatch({ 
            type: FETCH_EXAM_FAILURE, 
            payload: error.message 
        });
        throw error;
    }
};

export const createExam = (examData) => async (dispatch) => {
    dispatch({ type: CREATE_EXAM_REQUEST });

    try {
        if (!examData.courseId || !examData.courseName || !examData.date) {
            throw new Error("Missing required fields");
        }

        const examsResponse = await api.get("/exams", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        });
        const existingExams = examsResponse.data;

        const newExamStart = new Date(examData.date);
        const newExamEnd = new Date(examData.date);
        newExamEnd.setMinutes(newExamEnd.getMinutes() + examData.duration);

        const hasOverlap = existingExams.some(exam => {
            if (exam.examId === examData.examId) {
                return false;
            }

            const existingStart = new Date(exam.startTime);
            const existingEnd = new Date(exam.endTime);

            return (
                (newExamStart >= existingStart && newExamStart < existingEnd) ||
                (newExamEnd > existingStart && newExamEnd <= existingEnd) ||
                (newExamStart <= existingStart && newExamEnd >= existingEnd)
            );
        });

        if (hasOverlap) {
            throw new Error("There is already an exam scheduled during this time period");
        }

        const multipleChoiceQuestions = examData.questions
            .filter(q => q.type === 'MCQ')
            .map(q => {
                return {
                    questionId: q.id,
                    text: q.question || q.text,
                    options: q.options,
                    correctOption: parseInt(q.correctAnswerIndex),
                    score: parseFloat(q.maxGrade),
                    negativeScore: parseFloat(q.negativeGrade || 0)
                };
            });

        const trueOrFalseQuestions = examData.questions
            .filter(q => q.type === 'truefalse')
            .map(q => {
                return {
                    questionId: q.id,
                    text: q.question || q.text,
                    correctOption: q.correctAnswer === 'true',
                    score: parseFloat(q.maxGrade),
                    negativeScore: parseFloat(q.negativeGrade || 0)
                };
            });

        const typicalQuestions = examData.questions
            .filter(q => q.type === 'typical')
            .map(q => {
                return {
                    questionId: q.id,
                    text: q.question || q.text,
                    score: parseFloat(q.maxGrade)
                };
            });

        const formattedExamData = {
            id: examData.courseId,
            title: `Exam for ${examData.courseName}`,
            examId: `EXAM-${Date.now()}`,
            courseId: examData.courseCode,
            multipleChoiceQuestions,
            trueOrFalseQuestions,
            typicalQuestions,
            students: [],
            startTime: examData.date,
            endTime: (() => {
                const [datePart, timePart] = examData.date.split(' ');
                const [year, month, day] = datePart.split('-');
                const [hours, minutes] = timePart.split(':');
                const startDate = new Date(year, month - 1, day, hours, minutes);
                startDate.setMinutes(startDate.getMinutes() + examData.duration);
                return startDate.getFullYear() + '-' + 
                       String(startDate.getMonth() + 1).padStart(2, '0') + '-' + 
                       String(startDate.getDate()).padStart(2, '0') + ' ' + 
                       String(startDate.getHours()).padStart(2, '0') + ':' + 
                       String(startDate.getMinutes()).padStart(2, '0');
            })(),
            createdAt: new Date().toISOString()
        };

        const response = await api.post('/exams', formattedExamData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
                'Content-Type': 'application/json'
            }
        });

        dispatch({
            type: CREATE_EXAM_SUCCESS,
            payload: response.data
        });

        return response.data;
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            data: error.response?.data
        });
        
        dispatch({
            type: CREATE_EXAM_FAILURE,
            payload: error.message
        });
        throw error;
    }
};

export const deleteExam = (examId) => async (dispatch) => {
    dispatch({ type: DELETE_EXAM_REQUEST });

    try {
        await api.delete(`/exams/${examId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        });
        dispatch({ type: DELETE_EXAM_SUCCESS, payload: examId });
    } catch (error) {
        dispatch({ type: DELETE_EXAM_FAILURE, payload: error.message });
        throw error;
    }
};

export const registerForExam = (examId) => async (dispatch) => {
    dispatch({ type: REGISTER_FOR_EXAM_REQUEST });

    try {
        const response = await api.post(`/exams/take/${examId}`, null, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        });
        
        dispatch({ 
            type: REGISTER_FOR_EXAM_SUCCESS, 
            payload: response.data 
        });
        
        return response.data;
    } catch (error) {
        dispatch({ 
            type: REGISTER_FOR_EXAM_FAILURE, 
            payload: error.message 
        });
        throw error;
    }
};

export const unregisterForExam = (examId) => async (dispatch) => {
    dispatch({ type: UNREGISTER_FOR_EXAM_REQUEST });

    try {
        const response = await api.post(`/exams/remove/${examId}`, null, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        });
        
        dispatch({ 
            type: UNREGISTER_FOR_EXAM_SUCCESS, 
            payload: response.data 
        });
        
        return response.data;
    } catch (error) {
        dispatch({ 
            type: UNREGISTER_FOR_EXAM_FAILURE, 
            payload: error.message 
        });
        throw error;
    }
};