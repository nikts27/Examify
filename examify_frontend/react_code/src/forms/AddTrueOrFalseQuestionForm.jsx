// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line react/prop-types
function AddTrueOrFalseQuestionForm({ onSubmit }) {
    const [question, setQuestion] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [maxGrade, setMaxGrade] = useState(0);
    const [negativeGrade, setNegativeGrade] = useState(0);

    const handleSubmit = () => {
        if (!question.trim()) {
            alert("Question is required.");
            return;
        }
        if (correctAnswer === null) {
            alert("Please select the correct answer.");
            return;
        }
        if (maxGrade <= 0) {
            alert("Maximum grade must be greater than 0.");
            return;
        }
        if (negativeGrade > 0) {
            alert("Negative grade must be less than or equal to 0.");
            return;
        }

        const trueFalseQuestion = {
            id: uuidv4(),
            question,
            correctAnswer,
            maxGrade: parseFloat(maxGrade),
            negativeGrade: parseFloat(negativeGrade),
            type: 'truefalse'
        };

        if (onSubmit) {
            onSubmit(trueFalseQuestion);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: 2 }}>
            <TextField
                label="Question"
                variant="outlined"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                fullWidth
                multiline
                rows={3}
                placeholder="Enter your true/false question here..."
            />

            <Typography variant="h6">Correct Answer</Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                    variant={correctAnswer === true ? "contained" : "outlined"}
                    color={correctAnswer === true ? "primary" : "default"}
                    onClick={() => setCorrectAnswer(true)}
                    fullWidth
                >
                    True
                </Button>
                <Button
                    variant={correctAnswer === false ? "contained" : "outlined"}
                    color={correctAnswer === false ? "primary" : "default"}
                    onClick={() => setCorrectAnswer(false)}
                    fullWidth
                >
                    False
                </Button>
            </Box>

            <div className="grid grid-cols-2 gap-4">
                <TextField
                    label="Maximum Grade"
                    type="number"
                    value={maxGrade}
                    onChange={(e) => setMaxGrade(e.target.value)}
                    min={0}
                    step={0.5}
                    fullWidth
                    sx={{
                        '& input': {
                            padding: '10px'
                        }
                    }}
                />
                
                <TextField
                    label="Negative Grade"
                    type="number"
                    value={negativeGrade}
                    onChange={(e) => setNegativeGrade(e.target.value)}
                    max={0}
                    step={0.5}
                    fullWidth
                    sx={{
                        '& input': {
                            padding: '10px'
                        }
                    }}
                />
            </div>

            <Button
                variant="contained"
                onClick={handleSubmit}
                fullWidth
                sx={{
                    backgroundColor: '#6366f1',
                    padding: '12px',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '1rem',
                    boxShadow: '0 2px 4px rgba(99, 102, 241, 0.2)',
                    '&:hover': {
                        backgroundColor: '#4f46e5',
                        boxShadow: '0 4px 6px rgba(99, 102, 241, 0.25)'
                    }
                }}
            >
                Add Question
            </Button>
        </Box>
    );
}

AddTrueOrFalseQuestionForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
};

export default AddTrueOrFalseQuestionForm;
