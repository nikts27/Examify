import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@mui/material";
import { motion } from "framer-motion";
import { FaUser, FaLock } from 'react-icons/fa';
import './Auth.css';
import { useDispatch } from "react-redux";
import { login } from "@/State/Auth/Action.js";
import { useNavigate } from "react-router-dom";

function SignInForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    
    useEffect(() => {
        document.title = "Examify - Sign In";
    }, []);

    const form = useForm({
        defaultValues: {
            username: "",
            password: ""
        }
    });

    const onSubmit = async (data) => {
        try {
            setError("");
            await dispatch(login(data, navigate));
        } catch (err) {
            setError(err.response?.data?.message || "Invalid username or password");
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-2xl font-bold text-center pb-6 text-indigo-400">Sign In</h1>
            
            {error && (
                <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        className="input-field"
                                        placeholder="Username"
                                        aria-label="Username"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type="password"
                                        className="input-field"
                                        placeholder="Password"
                                        aria-label="Password"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button 
                        type="submit" 
                        variant="contained"
                        className="w-full py-3 mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white transition-all duration-300"
                    >
                        Sign In
                    </Button>
                </form>
            </Form>
        </motion.div>
    );
}

export default SignInForm;