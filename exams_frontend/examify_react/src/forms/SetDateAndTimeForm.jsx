// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";
import PropTypes from 'prop-types';


function SetDateAndTimeForm({ onSubmit, isDialog = false, onClose }) {
    const navigate = useNavigate();
    const [dateValue, setDateValue] = useState(dayjs());

    const handleSubmit = () => {
        if (dateValue) {
            const formattedDate = dateValue.format("YYYY-MM-DD HH:mm");
            if (isDialog) {
                onSubmit(formattedDate);
                onClose?.();
            } else {
                navigate("/build-exam", { state: { selectedDate: formattedDate } });
            }
        }
    };

    return (
        <div className="flex flex-col items-center space-y-6 p-4">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <h3 className="text-lg font-semibold text-gray-700">
                    Select Date and Time
                </h3>
                <div className="w-full max-w-md">
                    <DateTimePicker
                        value={dateValue}
                        onChange={setDateValue}
                        renderInput={(params) => (
                            <TextField 
                                {...params} 
                                className="w-full"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '0.5rem',
                                        '&:hover fieldset': {
                                            borderColor: '#818cf8',
                                        },
                                    },
                                }}
                            />
                        )}
                    />
                </div>
                <Button
                    onClick={handleSubmit}
                    className="w-full max-w-md bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    Confirm
                </Button>
            </LocalizationProvider>
        </div>
    );
}

SetDateAndTimeForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isDialog: PropTypes.bool,
    onClose: PropTypes.func
};

export default SetDateAndTimeForm;