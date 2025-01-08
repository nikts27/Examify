// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {
    CalendarIcon,
    CheckIcon,
    FileTextIcon,
    LapTimerIcon,
    QuestionMarkCircledIcon,
    QuestionMarkIcon,
    ReloadIcon,
    TrashIcon,
    PersonIcon as UserIcon,
    ClockIcon,
} from "@radix-ui/react-icons";
import {Dialog, DialogHeader, DialogTitle, DialogTrigger, DialogContent} from "@/components/ui/dialog.jsx";
import SetDurationForm from "@/forms/SetDurationForm.jsx";
import AddMultipleChoiceQuestionForm from "@/forms/AddMultipleChoiceQuestionForm.jsx";
import AddTrueOrFalseQuestionForm from "@/forms/AddTrueOrFalseQuestionForm.jsx";
import AddTypicalQuestionForm from "@/forms/AddTypicalQuestionForm.jsx";
import {Button} from "@mui/material";
import SetDateAndTimeForm from "@/forms/SetDateAndTimeForm.jsx";
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import {useDispatch, useSelector} from 'react-redux';
import { createExam, deleteExam } from '@/State/Exam/Action';

function SetDateDialog({ setSelectedDate }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                    style={{color: 'black'}} 
                    className="h-24 w-24 hover:text-gray-400 cursor-pointer
                        flex flex-col items-center justify-center rounded-md
                        shadow-slate-800 shadow-md"
                >
                    <CalendarIcon />
                    <span className="text-sm mt-2">Set Date</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set Exam Date and Time</DialogTitle>
                </DialogHeader>
                <SetDateAndTimeForm 
                    onSubmit={setSelectedDate}
                    isDialog={true}
                    onClose={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}

SetDateDialog.propTypes = {
    setSelectedDate: PropTypes.func.isRequired
};

function SetDurationDialog({setDuration}){
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="h-24 w-24 hover:text-gray-400 cursor-pointer
                flex flex-col items-center justify-center rounded-md
                shadow-slate-800 shadow-md">
                <LapTimerIcon />
                <span className="text-sm mt-2">Set duration</span>
            </DialogTrigger>
            <DialogContent className="dialog-content">
                <DialogHeader>
                    <DialogTitle>Set the duration examiners</DialogTitle>
                    <DialogTitle>will have to answer questions</DialogTitle>
                </DialogHeader>
                <SetDurationForm 
                    setDuration={setDuration}
                    isDialog={true}
                    onClose={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    )
}

SetDurationDialog.propTypes = {
    setDuration: PropTypes.func.isRequired
};

function MultipleChoiceDialog({ onQuestionAdd }){
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="h-24 w-24 hover:text-gray-400 cursor-pointer
                flex flex-col items-center justify-center rounded-md
                shadow-slate-800 shadow-md">
                <QuestionMarkIcon />
                <span className="text-sm mt-2">Add MCQ</span>
            </DialogTrigger>
            <DialogContent className="dialog-content">
                <DialogHeader>
                    <DialogTitle>Add a multiple choice question.</DialogTitle>
                </DialogHeader>
                <AddMultipleChoiceQuestionForm 
                    onSubmit={(question) => {
                        onQuestionAdd({ ...question, type: 'MCQ' });
                        setOpen(false);
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}

MultipleChoiceDialog.propTypes = {
    onQuestionAdd: PropTypes.func.isRequired
};

function TrueOrFalseDialog({ onQuestionAdd }){
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="h-24 w-24 hover:text-gray-400 cursor-pointer
                flex flex-col items-center justify-center rounded-md
                shadow-slate-800 shadow-md">
                <QuestionMarkIcon />
                <span className="text-sm mt-2">Add TFQ</span>
            </DialogTrigger>
            <DialogContent className="dialog-content">
                <DialogHeader>
                    <DialogTitle>Add a true or false question</DialogTitle>
                </DialogHeader>
                <AddTrueOrFalseQuestionForm 
                    onSubmit={(question) => {
                        onQuestionAdd({ ...question, type: 'truefalse' });
                        setOpen(false);
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}

function TypicalQuestionDialog({ onQuestionAdd }){
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="h-24 w-24 hover:text-gray-400 cursor-pointer
                flex flex-col items-center justify-center rounded-md
                shadow-slate-800 shadow-md">
                <QuestionMarkIcon />
                <span className="text-sm mt-2">Add TQ</span>
            </DialogTrigger>
            <DialogContent className="dialog-content">
                <DialogHeader>
                    <DialogTitle>Add typical question</DialogTitle>
                </DialogHeader>
                <AddTypicalQuestionForm 
                    onSubmit={(question) => {
                        onQuestionAdd({ ...question, type: 'typical' });
                        setOpen(false);
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}

TrueOrFalseDialog.propTypes = {
    onQuestionAdd: PropTypes.func.isRequired
};

TypicalQuestionDialog.propTypes = {
    onQuestionAdd: PropTypes.func.isRequired
};

function BuildExamPage() {
    const location = useLocation();
    const course = location.state?.course;
    const isUpdate = location.state?.isUpdate;
    const existingExam = location.state?.exam;
    
    const [selectedDate, setSelectedDate] = useState(
        isUpdate ? existingExam.startTime : location.state?.selectedDate || null
    );
    const [duration, setDuration] = useState(
        isUpdate ? 
        Math.round((new Date(existingExam.endTime) - new Date(existingExam.startTime)) / (1000 * 60)) 
        : "-"
    );
    const [questions, setQuestions] = useState(
        isUpdate ? existingExam.questions : []
    );
    
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const { exams } = useSelector(state => state.exam);

    useEffect(() => {
        document.title = "Examify - Build a exam";
    }, []);

    const handleQuestionAdd = (question) => {
        setQuestions(prev => [...prev, question]);
    };

    const handleDeleteQuestion = (index) => {
        setQuestions(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmitExam = async () => {
        if (!selectedDate) {
            alert("Please set a date for the exam");
            return;
        }
        if (duration === "-") {
            alert("Please set a duration for the exam");
            return;
        }
        if (questions.length === 0) {
            alert("Please add at least one question");
            return;
        }

        const startDateTime = new Date(selectedDate);
        const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

        const overlappingExam = exams.find(exam => {
            if (isUpdate && exam.examId === existingExam.examId) {
                return false;
            }

            const examStart = new Date(exam.startTime.replace(' ', 'T'));
            const examEnd = new Date(exam.endTime.replace(' ', 'T'));

            return (
                (startDateTime >= examStart && startDateTime <= examEnd) ||
                (endDateTime >= examStart && endDateTime <= examEnd) ||  
                (startDateTime <= examStart && endDateTime >= examEnd) 
            );
        });

        if (overlappingExam) {
            alert(`Cannot schedule exam during another exam (${overlappingExam.title})\nTime: ${overlappingExam.startTime} - ${overlappingExam.endTime}`);
            return;
        }

        const examData = {
            courseId: course?.id || course?._id || existingExam?.courseId,
            courseName: course?.title || existingExam?.title?.replace('Exam for ', ''),
            courseCode: course?.code || existingExam?.courseCode,
            date: selectedDate,
            duration: parseInt(duration),
            questions: questions.map(q => ({
                ...q,
                id: q.id || uuidv4(),
                maxGrade: parseFloat(q.maxGrade),
                negativeGrade: parseFloat(q.negativeGrade || 0)
            })),
            professor: user.username,
            status: 'PENDING'
        };
        
        try {
            if (isUpdate) {
                await Promise.all([
                    dispatch(deleteExam(existingExam.examId)),
                    dispatch(createExam(examData))
                ]);
                alert("Exam updated successfully!");
            } else {
                await Promise.resolve(dispatch(createExam(examData)));
                alert("Exam created successfully!");
            }
            navigate('/professor');
        } catch (error) {
            alert(`Failed to ${isUpdate ? 'update' : 'create'} exam: ${error.message}`);
        }
    };

    const formatDisplayDate = (dateString) => {
        if (!dateString) return "Date not set";
        return dateString.replace('T', ' ');
    };

    return (
        <div className="h-screen overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
            <div className="container mx-auto px-4 py-8 relative pb-24">
                {(course || isUpdate) ? (
                    <div className="space-y-8 max-w-5xl mx-auto">
                        <div className="sticky top-0 z-10 bg-gradient-to-b from-gray-50/95 to-transparent pb-4 backdrop-blur-sm">
                            <Card className="w-full shadow-lg border border-gray-100/50 bg-white/70">
                                <CardHeader className="pb-6">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-100 rounded-lg">
                                                    <FileTextIcon className="w-6 h-6 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-2xl font-bold text-gray-900">
                                                        {isUpdate ? 'Update' : 'Create'} Exam for {course?.title || existingExam?.title?.replace('Exam for ', '')}
                                                    </CardTitle>
                                                    <p className="text-sm text-gray-500">
                                                        Code: {course?.code || existingExam?.courseCode}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <UserIcon className="w-4 h-4" />
                                                    <span>{user?.fullName || user?.username}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <CalendarIcon className="w-4 h-4" />
                                                    <span>{formatDisplayDate(selectedDate)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <ClockIcon className="w-4 h-4" />
                                                    <span>{duration === "-" ? "Duration not set" : `${duration} minutes`}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button 
                                            onClick={() => window.location.reload()}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <ReloadIcon className="w-5 h-5 text-gray-500" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        <SetDateDialog setSelectedDate={setSelectedDate} />
                                        <SetDurationDialog setDuration={setDuration} />
                                        <MultipleChoiceDialog onQuestionAdd={handleQuestionAdd} />
                                        <TrueOrFalseDialog onQuestionAdd={handleQuestionAdd} />
                                        <TypicalQuestionDialog onQuestionAdd={handleQuestionAdd} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6 mb-20">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <QuestionMarkCircledIcon className="w-6 h-6 text-indigo-600" />
                                    Questions ({questions.length})
                                </h2>
                            </div>
                            <div className="space-y-4">
                                {questions.map((question, index) => (
                                    <div key={index} className="transform transition-all duration-200 hover:translate-x-1">
                                        <Card className="border border-gray-100 shadow-md hover:shadow-lg">
                                            <CardContent className="p-6">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
                                                                <QuestionMarkCircledIcon className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-lg font-semibold text-gray-900">
                                                                    Question {index + 1} ({question.type})
                                                                </h3>
                                                                <div className="flex gap-4 text-sm text-gray-500">
                                                                    <span>Correct: +{question.maxGrade} points</span>
                                                                    {question.type !== 'typical' && (
                                                                        <span>Wrong: {question.negativeGrade} points</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            onClick={() => handleDeleteQuestion(index)}
                                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
                                                        </Button>
                                                    </div>

                                                    <div className="pl-11">
                                                        <p className="text-gray-700 font-medium mb-4">
                                                            {question.text || question.question || question.questionText}
                                                        </p>
                                                        
                                                        {/* MCQ Options */}
                                                        {question.type === 'MCQ' && question.options && (
                                                            <div className="space-y-2">
                                                                {question.options.map((option, optIndex) => (
                                                                    <div 
                                                                        key={optIndex}
                                                                        className={`p-3 rounded-lg border ${
                                                                            optIndex === question.correctAnswerIndex 
                                                                                ? 'border-green-500 bg-green-50' 
                                                                                : 'border-gray-200'
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-sm font-medium">
                                                                                {String.fromCharCode(65 + optIndex)}.
                                                                            </span>
                                                                            <span>{option}</span>
                                                                            {optIndex === question.correctAnswerIndex && (
                                                                                <CheckIcon className="h-5 w-5 text-green-500 ml-auto" />
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* True/False Answer */}
                                                        {question.type === 'truefalse' && (
                                                            <div className="p-3 rounded-lg border border-green-500 bg-green-50">
                                                                <span>Correct Answer: {question.correctAnswer ? 'True' : 'False'}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="fixed bottom-8 left-0 right-0 z-10">
                            <div className="max-w-5xl mx-auto px-4">
                                <div className="flex justify-center">
                                    <Button
                                        variant="contained"
                                        onClick={handleSubmitExam}
                                        className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white
                                            px-12 py-3 rounded-lg shadow-xl transform transition-all duration-200
                                            hover:from-indigo-700 hover:to-indigo-600 hover:scale-105 active:scale-95"
                                    >
                                        {isUpdate ? 'Update Exam' : 'Submit Exam'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
                        <div className="text-center space-y-4">
                            <div className="bg-indigo-100 p-3 rounded-full inline-block">
                                <FileTextIcon className="w-6 h-6 text-indigo-600" />
                            </div>
                            <p className="text-gray-600">Please select a course first</p>
                            <Button 
                                variant="contained"
                                onClick={() => navigate('/professor')}
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                Return to courses
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BuildExamPage;