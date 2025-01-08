// eslint-disable-next-line no-unused-vars
import React, {useState} from "react";
import {Button, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import {v4 as uuidv4} from "uuid";

function AddTypicalQuestionForm({ onSubmit }) {
    const [question, setQuestion] = useState("");
    const [maxGrade, setMaxGrade] = useState(0);

    const handleSubmit = () => {
        if (!question.trim()) {
            alert("Question is required.");
            return;
        }
        if (maxGrade <= 0) {
            alert("Maximum grade must be greater than 0.");
            return;
        }

        const typicalQuestion = {
            id: uuidv4(),
            question: question,
            type: 'typical',
            maxGrade: parseFloat(maxGrade)
        };

        if (onSubmit) {
            onSubmit(typicalQuestion);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: 2 }}>
            <TextField
                label="Question"
                multiline
                rows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                fullWidth
                placeholder="Enter your question here..."
            />
            
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

AddTypicalQuestionForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
};

export default AddTypicalQuestionForm;