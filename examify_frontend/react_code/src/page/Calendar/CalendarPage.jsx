// eslint-disable-next-line no-unused-vars
import React, {useEffect} from 'react';
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchExams, registerForExam, fetchUserExams} from "@/State/Exam/Action.js";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

function CalendarPage() {
    const dispatch = useDispatch();
    const { user } = useSelector((store) => store.auth);
    const { exams = [], userExams = [], loading, error } = useSelector((store) => store.exam);

    useEffect(() => {
        document.title = "Examify - Calendar";
        dispatch(fetchExams());
        if (user?.role === "ROLE_STUDENT") {
            dispatch(fetchUserExams());
        }
    }, [dispatch, user]);

    const formatDateTime = (isoString) => {
        const [datePart, timePart] = isoString.split(' ');
        const [year, month, day] = datePart.split('-');
        const [hours, minutes] = timePart.split(':');
        
        const date = new Date(year, month - 1, day, hours, minutes);
        
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

    const cleanTitle = (title) => {
        return title.replace('Exam for ', '');
    };

    const handleEnrollment = async (examId) => {
        try {
            await dispatch(registerForExam(examId));
        } catch (error) {
            console.error('Failed to enroll in exam:', error);
        }
    };

    const isEnrolled = (courseId) => {
        return userExams.some(exam => exam.courseId === courseId);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
        </div>
    );

    if (error) return (
        <div className="text-red-500 p-4 text-center">
            <p>Error: {error}</p>
        </div>
    );

    const activeAndSortedExams = Array.isArray(exams) 
        ? [...exams]
            .filter(exam => new Date(exam.endTime) > new Date())
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
        : [];

    if (activeAndSortedExams.length === 0) {
        return (
            <div className="container mx-auto p-6">
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="text-center py-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Active Exams</h2>
                            <p className="text-gray-600">There are currently no scheduled exams available.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <Card className="mb-6">
                <CardContent className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Scheduled Exams</h1>
                    <Table>
                        {user?.role === "ROLE_STUDENT" && (
                            <TableCaption className="text-sm text-gray-500 italic">
                                You can enroll in an exam until 2 hours before it starts!
                            </TableCaption>
                        )}
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="w-1/6 text-center font-semibold">Course</TableHead>
                                <TableHead className="w-1/6 text-center font-semibold">Course Code</TableHead>
                                <TableHead className="w-1/6 text-center font-semibold">Date</TableHead>
                                <TableHead className="w-1/6 text-center font-semibold">Time</TableHead>
                                <TableHead className="w-1/6 text-center font-semibold">Duration</TableHead>
                                {user?.role === "ROLE_STUDENT" && (
                                    <TableHead className="w-1/6 text-center font-semibold">Actions</TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activeAndSortedExams.map((exam) => {
                                const { date } = formatDateTime(exam.startTime);
                                const duration = calculateDuration(exam.startTime, exam.endTime);
                                
                                return (
                                    <TableRow 
                                        key={exam.examId}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <TableCell className="font-medium text-center">
                                            {cleanTitle(exam.title)}
                                        </TableCell>
                                        <TableCell className="text-center">{exam.courseId}</TableCell>
                                        <TableCell className="text-center">{date}</TableCell>
                                        <TableCell className="text-center">{exam.startTime}</TableCell>
                                        <TableCell className="text-center">{duration}</TableCell>
                                        {user?.role === "STUDENT" && (
                                            <TableCell className="text-center">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    className="hover:bg-primary hover:text-white"
                                                    onClick={() => handleEnrollment(exam.examId)}
                                                    disabled={isEnrolled(exam.courseId)}
                                                >
                                                    {isEnrolled(exam.courseId) ? 'Enrolled' : 'Enroll'}
                                                </Button>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

export default CalendarPage;