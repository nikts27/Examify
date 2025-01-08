// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import {
    Box,
    Typography,
    Button,
    TextField
} from "@mui/material";
import {Card, CardContent} from "@/components/ui/card.jsx";
import {useNavigate, useLocation} from "react-router-dom";
import {useDispatch} from "react-redux";
import {gradeSubmission} from "@/State/Submit/Action.js";
import {fetchExamById} from "@/State/Exam/Action.js";

function GradeExamPage() {
    const [manualGrades, setManualGrades] = useState({});
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { examId, submissionId, studentId, answers } = location.state || {};

    useEffect(() => {
        document.title = "Examify - Grade Exam";
        if (!examId || !submissionId) {
            navigate('/professor');
            return;
        }

        const loadExam = async () => {
            try {
                setLoading(true);
                const examData = await dispatch(fetchExamById(examId));
                setExam(examData);
            } catch (error) {
                alert("Failed to fetch exam: " + error.message);
                navigate('/professor');
            } finally {
                setLoading(false);
            }
        };

        loadExam();
    }, [examId, submissionId, navigate, dispatch]);

    if (loading || !exam) {
        return <div className="flex justify-center pt-10">Loading exam details...</div>;
    }

    const handleGradeChange = (questionId, grade) => {
        const question = findQuestionDetails(questionId);
        const numericGrade = Number(grade);

        if (numericGrade < 0) {
            alert("Grade cannot be negative!");
            return;
        }
        
        if (numericGrade > question.score) {
            alert(`Maximum grade for this question is ${question.score}!`);
            return;
        }

        setManualGrades({
            ...manualGrades,
            [questionId]: numericGrade,
        });
    };

    const handleSubmitGrades = async () => {
        const typicalQuestions = answers.filter(q => q.type === "TQ");
        const missingGrades = typicalQuestions.some(q => !manualGrades[q.id]);

        if (missingGrades) {
            alert("Please grade all typical questions before submitting!");
            return;
        }

        try {
            await dispatch(gradeSubmission(submissionId, manualGrades));
            alert("Grades submitted successfully!");
            navigate('/see-submissions', { 
                state: { examId }
            });
        } catch (error) {
            alert("Failed to submit grades: " + error.message);
        }
    };

    const getAllQuestions = (exam) => {
        if (!exam) return [];
        
        const mcq = (exam.multipleChoiceQuestions || []).map(q => ({ ...q, type: 'MCQ' }));
        const tfq = (exam.trueOrFalseQuestions || []).map(q => ({ ...q, type: 'TFQ' }));
        const typical = (exam.typicalQuestions || []).map(q => ({ ...q, type: 'TEXT' }));
        
        const allQuestions = [...mcq, ...tfq, ...typical];
        return allQuestions;
    };

    const findQuestionDetails = (answerId) => {
        const allQuestions = getAllQuestions(exam);
        const question = allQuestions.find(q => q.questionId === answerId);
        return question;
    };

    const getCorrectAnswer = (question) => {
        if (question.type === "MCQ") {
            return question.options[question.correctOption];
        }
        return question.correctOption?.toString() || "N/A";
    };

    return (
        <Box sx={{ 
            padding: 3,
            maxWidth: '800px',
            margin: '0 auto',
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            position: 'relative',
            paddingBottom: '80px'
        }}>
            <Typography variant="subtitle1" sx={{ 
                color: '#666',
                mb: 3,
                textAlign: 'center'
            }}>
                Student ID: {studentId}
            </Typography>

            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2,
                maxHeight: 'calc(100vh - 200px)',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                    width: '8px'
                },
                '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '4px'
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#c1c1c1',
                    borderRadius: '4px',
                    '&:hover': {
                        background: '#a1a1a1'
                    }
                }
            }}>
                {answers?.map((answer, index) => (
                    <Card 
                        key={answer.questionId} 
                        sx={{
                            backgroundColor: 'white',
                            boxShadow: 'none',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px'
                        }}
                    >
                        <CardContent sx={{
                            flex: 1,
                            overflowY: 'auto',
                            '&::-webkit-scrollbar': {
                                width: '8px'
                            },
                            '&::-webkit-scrollbar-track': {
                                background: '#f1f1f1',
                                borderRadius: '4px'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: '#c1c1c1',
                                borderRadius: '4px',
                                '&:hover': {
                                    background: '#a1a1a1'
                                }
                            }
                        }}>
                            <Typography variant="h6" sx={{ 
                                display: 'flex',
                                gap: 2,
                                alignItems: 'center',
                                color: '#1976d2',
                                mb: 2,
                                position: 'sticky',
                                top: 0,
                                bgcolor: 'white',
                                zIndex: 1,
                                py: 1
                            }}>
                                <span>{index + 1}</span>
                                {findQuestionDetails(answer.questionId)?.text}
                            </Typography>

                            <Box sx={{ 
                                bgcolor: '#f5f5f5',
                                p: 2,
                                borderRadius: '4px',
                                mb: 2,
                                maxHeight: '150px',
                                overflowY: 'auto'
                            }}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Student's Answer:
                                </Typography>
                                <Typography sx={{ mt: 1 }}>
                                    {answer.selectedOption || "Not answered"}
                                </Typography>
                            </Box>

                            {findQuestionDetails(answer.questionId)?.type === "TEXT" ? (
                                <TextField
                                    type="number"
                                    value={manualGrades[answer.questionId] ?? ""}
                                    onChange={(e) => handleGradeChange(answer.questionId, e.target.value)}
                                    size="small"
                                    label="Grade"
                                    input={{ min: 0, max: findQuestionDetails(answer.questionId)?.score, step: "any" }}
                                    helperText={`Maximum grade: ${findQuestionDetails(answer.questionId)?.score}`}
                                    required
                                    sx={{ width: 150 }}
                                />
                            ) : (
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Typography>
                                        Correct Answer: {getCorrectAnswer(findQuestionDetails(answer.questionId))}
                                    </Typography>
                                    <Typography sx={{
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: '4px',
                                        bgcolor: answer.selectedOption === getCorrectAnswer(findQuestionDetails(answer.questionId)) 
                                            ? '#e8f5e9' 
                                            : '#ffebee',
                                        color: answer.selectedOption === getCorrectAnswer(findQuestionDetails(answer.questionId))
                                            ? '#2e7d32'
                                            : '#c62828'
                                    }}>
                                        Grade: {
                                            answer.selectedOption === getCorrectAnswer(findQuestionDetails(answer.questionId))
                                                ? `+${findQuestionDetails(answer.questionId)?.score}`
                                                : findQuestionDetails(answer.questionId)?.negativeScore
                                        }
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Box>

            <Box sx={{ 
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: 'white',
                borderTop: '1px solid #e0e0e0',
                p: 2,
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                zIndex: 99
            }}>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/see-submissions', { state: { examId }})}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitGrades}
                >
                    Submit Grades
                </Button>
            </Box>
        </Box>
    );
}

export default GradeExamPage;