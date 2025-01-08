// eslint-disable-next-line no-unused-vars
import React, {useState} from "react";
import {Button, TextField} from "@mui/material";
import PropTypes from 'prop-types';

// eslint-disable-next-line react/prop-types
function SetDurationForm({ setDuration, isDialog, onClose }) {
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const duration = parseInt(inputValue);
        if (Number.isInteger(duration) && duration > 0) {
            setDuration(duration);
            if (isDialog && onClose) {
                onClose();
            }
        } else {
            alert("Duration must be a positive number of minutes!");
        }
    };

    return (
        <div className="flex flex-col space-y-6">
            <div className="space-y-4">
                <TextField
                    label="Duration (minutes)"
                    variant="outlined"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    type="number"
                    slotProps={{ input: { min: 1 } }}
                    endAdornment={<span className="text-gray-500">min</span>}
                    fullWidth
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '0.5rem',
                            '&:hover fieldset': {
                                borderColor: '#818cf8',
                            },
                        },
                    }}
                />
                <p className="text-sm text-gray-500">
                    Please enter a positive number of minutes
                </p>
            </div>
            
            <Button
                variant="contained"
                onClick={handleSubmit}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                sx={{
                    textTransform: 'none',
                    fontWeight: '500'
                }}
            >
                Set Duration
            </Button>
        </div>
    );
}

SetDurationForm.propTypes = {
    setDuration: PropTypes.func.isRequired,
    isDialog: PropTypes.bool,
    onClose: PropTypes.func
};

export default SetDurationForm;