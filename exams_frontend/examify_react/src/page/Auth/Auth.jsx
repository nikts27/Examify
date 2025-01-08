// eslint-disable-next-line no-unused-vars
import React, {useEffect} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import SignInForm from "@/page/Auth/SignInForm.jsx";
import ForgotPasswordForm from "@/page/Auth/ForgotPasswordForm.jsx";
import {Button, Card, CardContent} from "@mui/material";
import './Auth.css'
import { motion } from "framer-motion";

function Auth() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === "/auth" || location.pathname === "/") {
            navigate("/signin", { replace: true });
        }
    }, [location.pathname, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 relative flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-center mb-8"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                                Welcome to Examify
                            </h1>
                        </motion.div>

                        {location.pathname === "/signin" ? (
                            <motion.section
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-6"
                            >
                                <SignInForm />
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    className="mt-4 py-3 text-gray-700 border-gray-400 hover:bg-gray-50"
                                    onClick={() => navigate("/forgot-password")}
                                >
                                    Forgot Password?
                                </Button>
                            </motion.section>
                        ) : (
                            <motion.section
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-6"
                            >
                                <ForgotPasswordForm />
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    className="mt-4 py-3 text-gray-700 border-gray-400 hover:bg-gray-50"
                                    onClick={() => navigate("/signin")}
                                >
                                    Back to Sign In
                                </Button>
                            </motion.section>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}

export default Auth;