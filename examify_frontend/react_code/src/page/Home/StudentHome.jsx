// eslint-disable-next-line no-unused-vars
import React, {useEffect} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Button} from "@/components/ui/button.jsx";
import {useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import {fetchUserCourses} from '@/State/Course/Action';
import {fetchUserExams, unregisterForExam} from '@/State/Exam/Action';
import {fetchUserSubmissions} from '@/State/Submit/Action';

function CoursesTable() {
    const { courses = [] } = useSelector(store => store.course || {});
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth || {});

    useEffect(() => {
        if (user?.username) {
            dispatch(fetchUserCourses(user.username));
        }
    }, [dispatch, user?.username]);

    if (!courses || courses.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-center text-gray-500">No courses available.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Courses</h2>
            <div className="overflow-hidden rounded-lg border border-gray-200">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/2 text-left">Course</TableHead>
                            <TableHead className="w-1/2 text-left">Code</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courses.map((course, index) => (
                            <TableRow key={index}>
                                <TableCell className="w-1/2 text-left font-medium">{course.title}</TableCell>
                                <TableCell className="w-1/2 text-left">{course.code}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

function ExamsTable() {
    const { userExams = [] } = useSelector(store => store.exam || {});
    const { user } = useSelector(store => store.auth || {});
    const { submissions } = useSelector(state => state.submit);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        document.title = "Examify - Student Home";
        if (user?.username) {
            dispatch(fetchUserExams(user.username));
            dispatch(fetchUserSubmissions());
        }
    }, [dispatch, user?.username]);

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
        };
    };

    const calculateDuration = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const durationInMinutes = (end - start) / (1000 * 60);
        return `${durationInMinutes} minutes`;
    };

    const checkExamStatus = (exam) => {
        const now = new Date().getTime();
        const startTime = new Date(exam.startTime.replace(' ', 'T')).getTime();
        const endTime = new Date(exam.endTime.replace(' ', 'T')).getTime();
        const hasSubmitted = submissions.some(sub => sub.examId === exam.examId);

        return {
            canStart: now >= startTime && now <= endTime && !hasSubmitted,
            isExpired: now > endTime,
            hasSubmitted
        };
    };

    const handleStartExam = (exam) => {
        const { canStart } = checkExamStatus(exam);
        
        if (!canStart) {
            return;
        }

        navigate('/start-exam', { 
            state: { examId: exam.examId },
            replace: true
        });
    };

    const handleUnregister = (examId) => {
        dispatch(unregisterForExam(examId))
            .catch(error => console.error('Failed to unregister from exam:', error));
    };

    const getGrade = (exam) => {
        const submission = submissions.find(sub => sub.examId === exam.examId);
        if (!submission) return '-';
        return submission.grade ?? '-';
    };

    if (!userExams || userExams.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-center text-gray-500">No upcoming exams.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Upcoming Exams</h2>
            <div className="overflow-hidden rounded-lg border border-gray-200">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="w-[100px] font-semibold">Course</TableHead>
                            <TableHead className="font-semibold">Date</TableHead>
                            <TableHead className="font-semibold">Time</TableHead>
                            <TableHead className="font-semibold">Duration</TableHead>
                            <TableHead className="font-semibold">Grade</TableHead>
                            <TableHead className="text-right font-semibold">Take Exam</TableHead>
                            <TableHead className="text-right font-semibold">Unregister</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userExams.map((exam, index) => {
                            const { date, time } = formatDateTime(exam.startTime);
                            const duration = calculateDuration(exam.startTime, exam.endTime);
                            const { canStart, isExpired, hasSubmitted } = checkExamStatus(exam);
                            const grade = getGrade(exam);
                            
                            return (
                                <TableRow 
                                    key={index}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <TableCell className="font-medium">{exam.title.replace('Exam for ', '')}</TableCell>
                                    <TableCell>{date}</TableCell>
                                    <TableCell>{time}</TableCell>
                                    <TableCell>{duration}</TableCell>
                                    <TableCell>{grade}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            className="bg-indigo-500 hover:bg-indigo-600 text-white"
                                            disabled={!canStart}
                                            onClick={() => handleStartExam(exam)}
                                            title={!canStart ? getStartButtonTooltip(exam, hasSubmitted) : ""}
                                        >
                                            Start
                                        </Button>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-red-500 text-red-500 hover:bg-red-50"
                                            onClick={() => handleUnregister(exam.examId)}
                                            disabled={isExpired || hasSubmitted}
                                            title={getUnregisterButtonTooltip(isExpired, hasSubmitted)}
                                        >
                                            Unregister
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

// Helper function για το tooltip του Start button
const getStartButtonTooltip = (exam, hasSubmitted) => {
    const now = new Date().getTime();
    const startTime = new Date(exam.startTime.replace(' ', 'T') + '.000Z').getTime();
    const endTime = new Date(exam.endTime.replace(' ', 'T') + '.000Z').getTime();

    if (hasSubmitted) return "You have already submitted this exam";
    if (now < startTime) return "Exam hasn't started yet";
    if (now > endTime) return "Exam has ended";
    return "";
};

const getUnregisterButtonTooltip = (isExpired, hasSubmitted) => {
    if (isExpired) return "Cannot unregister after exam end time";
    if (hasSubmitted) return "Cannot unregister after submission";
    return "";
};

function StudentHome() {

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="space-y-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your Dashboard</h1>
                    <p className="text-gray-600">Manage your courses and upcoming exams</p>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-1">
                    <div className="bg-white rounded-lg shadow-md">
                        <CoursesTable />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-1">
                    <div className="bg-white rounded-lg shadow-md">
                        <ExamsTable />
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center text-sm text-gray-500">
                <p>Need help? Contact your professor, academic advisor or support@examify.com</p>
            </div>
        </div>
    );
}

export default StudentHome;