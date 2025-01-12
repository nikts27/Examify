import './App.css';
import Navbar from './page/Navbar/Navbar.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import StudentHome from "./page/Home/StudentHome.jsx";
import ProfessorHome from "./page/Home/ProfessorHome.jsx";
import CalendarPage from "./page/Calendar/CalendarPage.jsx";
import BuildExamPage from "@/page/Exam/BuildExamPage.jsx";
import SetDateAndTimeForm from "@/forms/SetDateAndTimeForm.jsx";
import SeeSubmissionsPage from "@/page/Submissions/SeeSubmissionsPage.jsx";
import GradeExamPage from "@/page/Exam/GradeExamPage.jsx";
import Auth from "@/page/Auth/Auth.jsx";
import AnswerQuestionsPage from "@/page/Exam/AnswerQuestionsPage.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {getUser, logout} from "@/State/Auth/Action.js";

function App() {
    const {auth} = useSelector(store=>store);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUser(auth.jwt || localStorage.getItem("jwt")));

        const handleBeforeUnload = () => {
            dispatch(logout());
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [auth.jwt, dispatch]);

    return (
        <>
            {auth.user ? (
                <div className="pt-16">
                    <Navbar/>
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" replace />} />
                        <Route
                            path="/home"
                            element={(auth.user.role === "STUDENT")
                                ? <Navigate to="/student"/> : <Navigate to="/professor"/>}
                        />
                        <Route path="/professor" element={<ProfessorHome/>} />
                        <Route path="/student" element={<StudentHome/>} />
                        <Route path="/calendar" element={<CalendarPage user={auth.user}/>} />
                        <Route path="/build-exam" element={<BuildExamPage profName={auth.user.name}/>} />
                        <Route path="/set-date-time" element={<SetDateAndTimeForm/>} />
                        <Route path="/see-submissions" element={<SeeSubmissionsPage/>} />
                        <Route path="/grade-exam" element={<GradeExamPage/>} />
                        <Route path="/start-exam" element={<AnswerQuestionsPage/>} />
                    </Routes>
                </div>
            ) : <Auth/>}
        </>
    );
}

export default App;

