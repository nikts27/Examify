import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@mui/material";
import { motion } from "framer-motion";
import { FaUser } from 'react-icons/fa';
import './Auth.css'

function ForgotPasswordForm() {
    useEffect(() => {
        document.title = "Examify - Forgot Password";
    }, []);

    const form = useForm({
        defaultValues: {
            username: ""
        }
    });

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-2xl font-bold text-center pb-6 text-blue-500">Reset Password</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <FormControl>
                                        <Input
                                            className="input-field pl-10"
                                            placeholder="Enter your username"
                                            aria-label="Username"
                                            {...field}
                                        />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                    <Button 
                        type="submit" 
                        variant="contained"
                        className="w-full py-3 mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                    >
                        Reset Password
                    </Button>
                </form>
            </Form>
        </motion.div>
    );
}

export default ForgotPasswordForm;