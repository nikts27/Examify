// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Box, Button, TextField, IconButton, Typography } from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

// eslint-disable-next-line react/prop-types
function AddMultipleChoiceQuestionForm({ onSubmit }) {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
    const [maxGrade, setMaxGrade] = useState(0);
    const [negativeGrade, setNegativeGrade] = useState(0);

    const handleSubmit = () => {
        if (!question.trim()) {
            alert("Question is required.");
            return;
        }
        if (options.some(option => !option.trim())) {
            alert("All options must be filled out.");
            return;
        }
        if (correctAnswerIndex === null) {
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

        const mcqQuestion = {
            id: uuidv4(),
            question,
            options,
            correctAnswerIndex,
            maxGrade: parseFloat(maxGrade),
            negativeGrade: parseFloat(negativeGrade)
        };

        if (onSubmit) {
            onSubmit(mcqQuestion);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                padding: 2,
                width: '100%',
                maxWidth: '600px',
                margin: 'auto',
                maxHeight: '80vh',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    background: '#f1f5f9',
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#94a3b8',
                    borderRadius: '4px',
                    '&:hover': {
                        background: '#64748b',
                    },
                },
                '& .MuiTextField-root': {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        backgroundColor: '#f8fafc',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            backgroundColor: '#f1f5f9'
                        },
                        '&.Mui-focused': {
                            backgroundColor: '#ffffff',
                            '& fieldset': {
                                borderColor: '#6366f1',
                                borderWidth: '2px'
                            }
                        }
                    }
                }
            }}
        >
            <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600 }}>
                Create Multiple Choice Question
            </Typography>

            <TextField
                label="Question"
                variant="outlined"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                fullWidth
                multiline
                rows={3}
                placeholder="Enter your question here..."
            />

            <Typography variant="subtitle1" sx={{ color: '#475569', fontWeight: 500, mt: 1 }}>
                Options
            </Typography>

            {options.map((option, index) => (
                <Box 
                    key={index} 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1 
                    }}
                >
                    <TextField
                        label={`Option ${index + 1}`}
                        variant="outlined"
                        value={option}
                        onChange={(e) => {
                            const updatedOptions = [...options];
                            updatedOptions[index] = e.target.value;
                            setOptions(updatedOptions);
                        }}
                        fullWidth
                        placeholder={`Enter option ${index + 1}`}
                    />
                    <Button
                        variant={correctAnswerIndex === index ? "contained" : "outlined"}
                        onClick={() => setCorrectAnswerIndex(index)}
                        sx={{
                            minWidth: '100px',
                            borderRadius: '8px',
                            textTransform: 'none',
                            backgroundColor: correctAnswerIndex === index ? '#6366f1' : 'transparent',
                            borderColor: correctAnswerIndex === index ? '#6366f1' : '#e2e8f0',
                            color: correctAnswerIndex === index ? '#ffffff' : '#64748b',
                            '&:hover': {
                                backgroundColor: correctAnswerIndex === index ? '#4f46e5' : '#f8fafc',
                                borderColor: '#6366f1'
                            }
                        }}
                    >
                        Correct
                    </Button>
                    {options.length > 2 && (
                        <IconButton 
                            onClick={() => setOptions(options.filter((_, i) => i !== index))}
                            sx={{
                                color: '#ef4444',
                                '&:hover': {
                                    backgroundColor: '#fee2e2'
                                }
                            }}
                        >
                            <RemoveCircle />
                        </IconButton>
                    )}
                </Box>
            ))}

            <Button
                startIcon={<AddCircle />}
                variant="outlined"
                onClick={() => setOptions([...options, ""])}
                fullWidth
                sx={{
                    borderRadius: '8px',
                    padding: '10px',
                    textTransform: 'none',
                    borderColor: '#e2e8f0',
                    color: '#64748b',
                    '&:hover': {
                        borderColor: '#6366f1',
                        backgroundColor: '#f8fafc'
                    }
                }}
            >
                Add Option
            </Button>

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
                    marginTop: 2,
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

AddMultipleChoiceQuestionForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
};

export default AddMultipleChoiceQuestionForm;
