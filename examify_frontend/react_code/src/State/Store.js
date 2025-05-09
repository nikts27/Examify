import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Auth/Reducer';
import courseReducer from './Course/Reducer';
import examReducer from './Exam/Reducer';
import submitReducer from './Submit/Reducer';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        course: courseReducer,
        exam: examReducer,
        submit: submitReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
});

export default store;