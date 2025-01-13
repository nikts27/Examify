// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Button } from "@/components/ui/button.jsx";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserCourses } from '@/State/Course/Action.js';
import { fetchUserExams, deleteExam } from '@/State/Exam/Action.js';
import { fetchExamSubmissions } from '@/State/Submit/Action.js';


function CoursesTable() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const courseState = useSelector((state) => state.course);
    const { userExams = [] } = useSelector(store => store.exam || {});
    const { user } = useSelector(store => store.auth || {});
    
    const { courses = [], loading = false, error = null } = courseState || {};
    
    useEffect(() => {
        dispatch(fetchUserCourses());
        if (user?.username) {
            dispatch(fetchUserExams(user.username));
        }
    }, [dispatch, user?.username]);

    const hasExistingExam = (courseId) => {
        const hasExam = userExams.some(exam => {
            return exam.courseId === courseId;
        });
        
        return hasExam;
    };

    const handleCourseClick = (course) => {
        const courseId = course.code;
        
        if (hasExistingExam(courseId)) {
            alert('An exam already exists for this course');
            return;
        }
        navigate('/build-exam', { state: { course } });
    };

    if (loading) {
        return <div className="text-center p-4">Loading courses...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">Error: {error}</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">My Courses</h2>
            <Table className="w-full">
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="w-1/3 text-left font-semibold text-gray-600">Course Name</TableHead>
                        <TableHead className="w-1/3 text-left font-semibold text-gray-600">Course Code</TableHead>
                        <TableHead className="w-1/3 text-left font-semibold text-gray-600">Schedule Exam</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.isArray(courses) && courses.map((course) => (
                        <TableRow 
                            key={course._id}
                            className="hover:bg-gray-50 transition-colors"
                        >
                            <TableCell className="text-left font-medium text-gray-900">{course.title}</TableCell>
                            <TableCell className="text-left text-gray-600">{course.code}</TableCell>
                            <TableCell className="text-left">
                                <Button
                                    size="icon"
                                    className={`${
                                        hasExistingExam(course.id || course._id)
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-indigo-500 hover:bg-indigo-600'
                                    } text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors`}
                                    onClick={() => handleCourseClick(course)}
                                    disabled={hasExistingExam(course.id || course._id)}
                                    title={hasExistingExam(course.id || course._id) ? "Exam already exists" : "Create exam"}
                                >
                                    +
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

function ExamsTable() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth || {});
    const { userExams = [], loading = false, error = null } = useSelector(store => store.exam || {});
    const [submissionCounts, setSubmissionCounts] = useState({});

    useEffect(() => {
        document.title = "Examify - Professor Home";
        if (user?.username) {
            dispatch(fetchUserExams(user.username));
        }
    }, [dispatch, user?.username]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            for (const exam of userExams) {
                try {
                    const submissions = await dispatch(fetchExamSubmissions(exam.examId));
                    setSubmissionCounts(prev => ({
                        ...prev,
                        [exam.examId]: submissions.length
                    }));
                } catch (error) {
                    console.error(`Failed to fetch submissions for exam ${exam.examId}:`, error);
                }
            }
        };

        if (userExams.length > 0) {
            fetchSubmissions();
        }
    }, [dispatch, userExams]);

    const formatDateTime = (isoString) => {
        const date = new Date(isoString.replace(' ', 'T'));
        return {
            date: date.toLocaleDateString(),
            time: date.getHours().toString().padStart(2, '0') + ':' + 
                  date.getMinutes().toString().padStart(2, '0')
        };
    };

    const calculateDuration = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const durationInMinutes = (end - start) / (1000 * 60);
        return `${durationInMinutes} minutes`;
    };

    const handleExamClick = (examId, examName, examDate) => {
        navigate('/see-submissions', { 
            state: { 
                examId, 
                examName, 
                examDate 
            }
        });
    };

    const cleanTitle = (title) => {
        return title.replace('Exam for ', '');
    };

    const handleUpdateExam = (exam) => {
        const allQuestions = [
            ...(exam.multipleChoiceQuestions || []).map(q => ({
                ...q,
                type: 'MCQ',
                text: q.text,
                options: q.options,
                maxGrade: q.score || 0,
                negativeGrade: q.negativeScore || 0,
                correctAnswerIndex: q.correctOption
            })),
            ...(exam.trueOrFalseQuestions || []).map(q => ({
                ...q,
                type: 'truefalse',
                text: q.text,
                correctAnswer: q.correctAnswer,
                maxGrade: q.score || 0,
                negativeGrade: q.negativeScore || 0
            })),
            ...(exam.typicalQuestions || []).map(q => ({
                ...q,
                type: 'typical',
                text: q.text,
                correctAnswer: q.correctAnswer,
                maxGrade: q.score || 0,
                negativeGrade: q.negativeScore || 0
            }))
        ];

        const formattedExam = {
            examId: exam.examId,
            title: exam.title,
            courseId: exam.courseId,
            courseCode: exam.courseId,
            startTime: exam.startTime,
            endTime: exam.endTime,
            questions: allQuestions
        };

        navigate('/build-exam', { 
            state: { 
                isUpdate: true,
                exam: formattedExam
            }
        });
    };

    const handleDeleteExam = async (examId) => {
        if (window.confirm('Are you sure you want to delete this exam?')) {
            try {
                await dispatch(deleteExam(examId));
                dispatch(fetchUserExams(user.username));
            } catch (error) {
                console.error('Failed to delete exam:', error);
            }
        }
    };

    const checkExamStatus = (exam) => {
        const now = new Date().getTime();
        const startTime = new Date(exam.startTime.replace(' ', 'T')).getTime();
        const endTime = new Date(exam.endTime.replace(' ', 'T')).getTime();

        return {
            hasStarted: now >= startTime,
            hasEnded: now > endTime
        };
    };

    const isExamEnded = (endTime) => {
        const now = new Date().getTime();
        const examEnd = new Date(endTime.replace(' ', 'T')).getTime();
        return now > examEnd;
    };

    if (loading) return (
        <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
    );

    if (error) return (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            Error: {error}
        </div>
    );

    if (!userExams || userExams.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center py-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Exams Created</h2>
                    <p className="text-gray-600">You haven't created any exams yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Scheduled Exams</h2>
            <Table className="w-full">
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="w-1/9 text-center font-semibold text-gray-600">Course</TableHead>
                        <TableHead className="w-1/9 text-center font-semibold text-gray-600">Date</TableHead>
                        <TableHead className="w-1/9 text-center font-semibold text-gray-600">Time</TableHead>
                        <TableHead className="w-1/9 text-center font-semibold text-gray-600">Duration</TableHead>
                        <TableHead className="w-1/9 text-center font-semibold text-gray-600">Submissions</TableHead>
                        <TableHead className="w-1/9 text-center font-semibold text-gray-600">View</TableHead>
                        <TableHead className="w-1/9 text-center font-semibold text-gray-600">Update</TableHead>
                        <TableHead className="w-1/9 text-center font-semibold text-gray-600">Delete</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {userExams.map((exam) => {
                        const { date, time } = formatDateTime(exam.startTime);
                        const duration = calculateDuration(exam.startTime, exam.endTime);
                        const { hasStarted, hasEnded } = checkExamStatus(exam);
                        
                        return (
                            <TableRow 
                                key={exam.examId}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <TableCell className="text-center font-medium text-gray-900">
                                    {cleanTitle(exam.title)}
                                </TableCell>
                                <TableCell className="text-center text-gray-600">{date}</TableCell>
                                <TableCell className="text-center text-gray-600">{time}</TableCell>
                                <TableCell className="text-center text-gray-600">{duration}</TableCell>
                                <TableCell className="text-center text-gray-600">
                                    {submissionCounts[exam.examId] || 0}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button
                                        size="icon"
                                        className={`${
                                            isExamEnded(exam.endTime)
                                                ? 'bg-indigo-500 hover:bg-indigo-600'
                                                : 'bg-gray-300 cursor-not-allowed'
                                        } text-white rounded-full p-2 transition-colors`}
                                        onClick={() => handleExamClick(exam.examId, exam.title, exam.startTime)}
                                        disabled={!isExamEnded(exam.endTime)}
                                        title={!isExamEnded(exam.endTime) 
                                            ? "Cannot view submissions until exam has ended" 
                                            : "View submissions"
                                        }
                                    >
                                        <EyeOpenIcon className="h-5 w-5"/>
                                    </Button>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button
                                        size="sm"
                                        className={`bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-1 ${
                                            hasStarted ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                        onClick={() => handleUpdateExam(exam)}
                                        disabled={hasStarted}
                                        title={hasStarted ? "Cannot update exam after it has started" : ""}
                                    >
                                        Update
                                    </Button>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button
                                        size="sm"
                                        className={`bg-red-500 hover:bg-red-600 text-white rounded-md px-3 py-1 ${
                                            hasStarted && !hasEnded ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                        onClick={() => handleDeleteExam(exam.examId)}
                                        disabled={hasStarted && !hasEnded}
                                        title={hasStarted && !hasEnded ? "Cannot delete exam while it's in progress" : ""}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

function ProfessorHome() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Professor Dashboard
                </h1>
                <p className="mt-2 text-gray-600">
                    Manage your courses and examinations
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <CoursesTable />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <ExamsTable />
            </div>
        </div>
    );
}

export default ProfessorHome;
