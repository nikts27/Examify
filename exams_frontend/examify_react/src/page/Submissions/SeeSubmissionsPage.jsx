import React, { useEffect } from 'react';
import { FileTextIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Card } from "@/components/ui/card.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchExamSubmissions } from '@/State/Submit/Action';
import { Button } from '@/components/ui/button';

function SeeSubmissionsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { examId, examName, examDate } = location.state || {};
    const { examSubmissions = [], loading } = useSelector(state => state.submit);

    useEffect(() => {
        document.title = "Examify - See Submissions";
        if (examId) {
            dispatch(fetchExamSubmissions(examId));
        }
    }, [dispatch, examId]);

    const handleRefresh = () => {
        dispatch(fetchExamSubmissions(examId));
    };

    const handleGradeSubmission = (submission) => {
        navigate('/grade-exam', { 
            state: { 
                examId,
                submissionId: submission.id,
                studentId: submission.studentId,
                answers: submission.answers
            }
        });
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            );
        }

        if (examSubmissions.length === 0) {
            return (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <FileTextIcon className="mx-auto h-12 w-12 text-gray-400"/>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No submissions yet</h3>
                    <p className="mt-2 text-gray-500">Submissions will appear here once students complete the exam.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {examSubmissions.map((submission) => (
                    <Card 
                        key={submission.id}
                        className={`overflow-hidden transition-all duration-200 hover:shadow-md
                            ${submission.grade !== null ? 'bg-blue-50/30' : 'bg-white'}`}
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className={`h-12 w-12 ${
                                        submission.grade !== null ? 'bg-blue-100' : 'bg-gray-100'
                                    }`}>
                                        <AvatarFallback className={
                                            submission.grade !== null ? 'text-blue-600' : 'text-gray-600'
                                        }>
                                            <FileTextIcon className="h-6 w-6"/>
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            Student ID: {submission.studentId}
                                        </h3>
                                        <p className={`text-sm mt-1 ${
                                            submission.grade > 0 ? 'text-blue-600' : 'text-gray-500'
                                        }`}>
                                            Grade: {submission.grade}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => handleGradeSubmission(submission)}
                                    variant={submission.grade > 0 ? "outline" : "default"}
                                    className={`${
                                        submission.grade > 0 
                                            ? 'hover:bg-blue-100/50' 
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                                >
                                    {submission.grade > 0 ? 'Review Grade' : 'Grade Submission'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Exam Submissions
                            </h1>
                            <p className="text-gray-500 mt-1">
                                {examName || "Unknown Exam"} - {examDate || "Unknown Date"}
                            </p>
                        </div>
                        <Button 
                            variant="outline"
                            onClick={handleRefresh}
                            className="flex items-center gap-2 hover:bg-gray-50"
                        >
                            <UpdateIcon className="h-4 w-4"/>
                            Refresh
                        </Button>
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                        <div>Total Submissions: {examSubmissions.length}</div>
                        <div>|</div>
                        <div>
                            Graded: {examSubmissions.filter(s => s.grade !== null).length}
                        </div>
                        <div>|</div>
                        <div>
                            Pending: {examSubmissions.filter(s => s.grade === null).length}
                        </div>
                    </div>
                </div>

                {renderContent()}

                {/* Footer */}
                <div className="mt-8 text-center">
                    <Button
                        onClick={() => navigate('/professor')}
                        variant="outline"
                        className="hover:bg-gray-50"
                    >
                        Return to Home
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SeeSubmissionsPage;