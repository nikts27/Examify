// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState, useCallback} from "react";
import {
    Button,
    Card,
    CardContent,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography,
    Box,
} from "@mui/material";
import {useNavigate, useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchExamById} from "../../State/Exam/Action";
import {submitExam} from "../../State/Submit/Action";

function AnswerQuestionsPage() {
    const location = useLocation();
    const { examId } = location.state || {};
    const dispatch = useDispatch();
    const { currentExam, loading, error } = useSelector(state => state.exam);
    const [studentAnswers, setStudentAnswers] = useState({});
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(null);
    const [isExamOver, setIsExamOver] = useState(false);

    const getAllQuestions = (exam) => {
        if (!exam) return [];
        
        const mcq = (exam.multipleChoiceQuestions || []).map(q => ({ ...q, type: 'MCQ' }));
        const tfq = (exam.trueOrFalseQuestions || []).map(q => ({ ...q, type: 'TFQ' }));
        const typical = (exam.typicalQuestions || []).map(q => ({ ...q, type: 'TEXT' }));
        
        return [...mcq, ...tfq, ...typical];
    };

    useEffect(() => {
        if (!examId) {
            navigate('/student');
            return;
        }

        dispatch(fetchExamById(examId));
    }, [examId, dispatch, navigate]);

    useEffect(() => {
        if (currentExam) {
            const questions = getAllQuestions(currentExam);
            setStudentAnswers(
                questions.reduce((acc, q) => {
                    acc[q.questionId] = "";
                    return acc;
                }, {})
            );
        }
    }, [currentExam]);

    const calculateTimeLeft = useCallback(() => {
        if (!currentExam) return null;

        const now = new Date().getTime();
        const endTime = new Date(currentExam.endTime).getTime();
        const startTime = new Date(currentExam.startTime).getTime();

        if (now < startTime) {
            return { hours: 0, minutes: 0, seconds: 0, message: "Exam hasn't started yet" };
        }

        if (now > endTime) {
            setIsExamOver(true);
            return { hours: 0, minutes: 0, seconds: 0, message: "Exam Over" };
        }

        const difference = endTime - now;
        
        return {
            hours: Math.floor(difference / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000),
            message: "Time remaining"
        };
    }, [currentExam]);

    useEffect(() => {
        if (!currentExam) return;

        const timer = setInterval(() => {
            const timeRemaining = calculateTimeLeft();
            setTimeLeft(timeRemaining);

            if (timeRemaining.message === "Exam Over") {
                clearInterval(timer);
                setIsExamOver(true);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [currentExam, calculateTimeLeft]);

    const handleChange = (index, value) => {
        setStudentAnswers((prevAnswers) => ({
            ...prevAnswers,
            [index]: value,
        }));
    };

    const handleSubmit = useCallback(() => {
        if (window.confirm("Are you sure you want to submit your answers? Empty answers will be counted as wrong.")) {
            try {
                const allQuestions = getAllQuestions(currentExam);
                
                const answers = allQuestions.map(question => ({
                    questionId: question.questionId,
                    selectedOption: studentAnswers[question.questionId]
                }));

                dispatch(submitExam(currentExam.examId, answers))
                    .then(() => {
                        alert("Your exam has been submitted successfully!");
                        navigate('/student', { replace: true });
                    })
                    .catch(error => {
                        alert("Failed to submit exam. Please try again.");
                        console.error('Submit exam error:', error);
                    });
            } catch (error) {
                alert("Failed to submit exam. Please try again.");
                console.error('Submit exam error:', error);
            }
        }
    }, [currentExam, studentAnswers, dispatch, navigate]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            handleSubmit();
            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [handleSubmit]);

    if (loading) return <div>Loading exam...</div>;
    if (error) return <div>Error loading exam: {error}</div>;
    if (!currentExam) return null;

    const questions = getAllQuestions(currentExam);

    if (isExamOver) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4, p: 3 }}>
                <Typography variant="h5" color="error" gutterBottom>
                    Exam time is over! You didn't submit your answers in time.
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate('/student', { replace: true })}
                    sx={{ mt: 2 }}
                >
                    Return to Home
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            {/* Fixed Timer */}
            {timeLeft && (
                <Box sx={{ 
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    bgcolor: 'primary.main',
                    color: 'white',
                    p: 2,
                    textAlign: 'center',
                    boxShadow: 3
                }}>
                    <Typography variant="h6">
                        {timeLeft.message}
                        {`: ${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`}
                    </Typography>
                </Box>
            )}

            <Box sx={{ 
                padding: 3,
                paddingTop: '80px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <Typography variant="h4" gutterBottom>
                    {currentExam?.title}
                </Typography>

                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: 2
                }}>
                    {questions.map((question) => (
                        <Card key={question.questionId} sx={{
                            padding: 2,
                            backgroundColor: "#f9f9f9",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                        }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {question.text}
                                </Typography>
                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                    Score: {question.score} {question.negativeScore < 0 && `(Wrong: ${question.negativeScore})`}
                                </Typography>

                                {question.type === "MCQ" && (
                                    <RadioGroup
                                        value={studentAnswers[question.questionId] || ""}
                                        onChange={(e) => handleChange(question.questionId, e.target.value)}
                                    >
                                        {question.options.map((option, i) => (
                                            <FormControlLabel
                                                key={i}
                                                value={option}
                                                control={<Radio />}
                                                label={option}
                                            />
                                        ))}
                                    </RadioGroup>
                                )}

                                {question.type === "TFQ" && (
                                    <RadioGroup
                                        value={studentAnswers[question.questionId] || ""}
                                        onChange={(e) => handleChange(question.questionId, e.target.value)}
                                    >
                                        <FormControlLabel value="true" control={<Radio />} label="True" />
                                        <FormControlLabel value="false" control={<Radio />} label="False" />
                                    </RadioGroup>
                                )}

                                {question.type === "TEXT" && (
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        placeholder="Write your answer here..."
                                        value={studentAnswers[question.questionId] || ""}
                                        onChange={(e) => handleChange(question.questionId, e.target.value)}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                <Box sx={{ 
                    position: 'sticky',
                    bottom: 20,
                    textAlign: 'center',
                    mt: 3
                }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        size="large"
                    >
                        Submit Answers
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default AnswerQuestionsPage;