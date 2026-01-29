"use client";
import React, { useRef } from 'react';
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLogin } from "../../hooks/useLoginUserTan";
import { Droplet, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import { GoogleLogin } from '@react-oauth/google';

const LoginForm = () => {
    const { mutate: attemptLogin, isPending, data: loginResponse } = useLogin();
    const [showPassword, setShowPassword] = useState(false);
    const recaptchaRef = useRef(null);

    // 2FA State
    const [step, setStep] = useState('login'); // 'login' | 'otp'
    const [otp, setOtp] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [verifyingOtp, setVerifyingOtp] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Watch for 2FA requirement
    React.useEffect(() => {
        if (loginResponse?.require2FA) {
            setStep('otp');
            setLoginEmail(loginResponse.email);
            // toast is already shown by hook
        }
    }, [loginResponse]);

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!otp || otp.length !== 6) {
            toast.error("Please enter a valid 6-digit code");
            return;
        }

        setVerifyingOtp(true);
        try {
            // Updated API URL to match your backend port
            const res = await axios.post('http://localhost:5050/api/auth/verify-2fa', {
                email: loginEmail,
                otp
            });

            toast.success("Verification successful!");
            toast.success("Verification successful!");
            login(res.data.user, res.data.token);
            if (res.data.user.role === 'admin') {
                navigate("/admin");
            } else {
                navigate("/user/dashboard");
            }

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Verification failed");
        } finally {
            setVerifyingOtp(false);
        }
    };


    const formik = useFormik({
        initialValues: { email: "", password: "", rememberMe: false },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Email is required"),
            password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
        }),
        onSubmit: (values) => {
            const recaptchaToken = recaptchaRef.current.getValue();
            if (!recaptchaToken) {
                toast.error("Please complete the reCAPTCHA verification.");
                return;
            }

            attemptLogin({
                email: values.email,
                password: values.password,
                "g-recaptcha-response": recaptchaToken
            });

            recaptchaRef.current.reset();
        },
    });

    return (
        <div className="w-full max-w-md mx-auto">
            {step === 'otp' ? (
                // OTP VERIFICATION FORM
                <div>
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <Lock className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Two-Factor Authentication</h2>
                        <p className="text-gray-500 mt-2">Enter the 6-digit code sent to <span className="font-semibold text-gray-700">{loginEmail}</span></p>
                    </div>

                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
                            <input
                                type="text"
                                maxLength="6"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                className="w-full text-center text-3xl tracking-widest py-3 border-2 border-gray-300 rounded-xl focus:border-blood-500 focus:ring-blood-500"
                                placeholder="000000"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={verifyingOtp}
                            className="w-full py-3 bg-blood-600 hover:bg-blood-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50"
                        >
                            {verifyingOtp ? "Verifying..." : "Verify & Login"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep('login')}
                            className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm font-medium"
                        >
                            Back to Login
                        </button>
                    </form>
                </div>
            ) : (
                // NORMAL LOGIN FORM
                <>
                    <div className="text-center mb-8 relative">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blood-500 via-blood-600 to-blood-700 rounded-2xl shadow-xl mb-4">
                            <Droplet className="w-8 h-8 text-white fill-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-navy-500">Welcome Back</h1>
                        <p className="text-gray-500">Continue your journey of saving lives</p>
                    </div>

                    {/* Google Login Button */}
                    <div className="flex justify-center mb-6">
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                try {
                                    const res = await axios.post('http://localhost:5050/api/auth/google-login', {
                                        token: credentialResponse.credential
                                    });
                                    toast.success("Google Login Successful!");
                                    toast.success("Google Login Successful!");
                                    login(res.data.user, res.data.token);
                                    if (res.data.user.role === 'admin') {
                                        navigate("/admin");
                                    } else {
                                        navigate("/user/dashboard");
                                    }
                                } catch (error) {
                                    console.error("Google Login Failed", error);
                                    toast.error(error.response?.data?.message || "Google Login failed");
                                }
                            }}
                            onError={() => {
                                toast.error("Google Login Failed");
                            }}
                            useOneTap
                        />
                    </div>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or sign in with email</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        {/* Email and Password fields remain the same */}
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-4 w-4 text-gray-400" /></div>
                                <input
                                    type="email"
                                    name="email"
                                    {...formik.getFieldProps('email')}
                                    placeholder="Enter your email"
                                    className="w-full pl-10 pr-3 py-3 border-2 rounded-xl"
                                />
                            </div>
                            {formik.touched.email && formik.errors.email && <div className="text-red-600 text-xs mt-1">{formik.errors.email}</div>}
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-semibold">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-4 w-4 text-gray-400" /></div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    {...formik.getFieldProps('password')}
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-10 py-3 border-2 rounded-xl"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {formik.touched.password && formik.errors.password && <div className="text-red-600 text-xs mt-1">{formik.errors.password}</div>}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" name="rememberMe" {...formik.getFieldProps('rememberMe')} />
                                <span>Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm font-medium text-blood-600 hover:text-blood-700">Forgot password?</Link>
                        </div>

                        {/* ## Add the ReCAPTCHA component here ## */}
                        <div className="flex justify-center">
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full mt-6 py-3 bg-blood-600 hover:bg-blood-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? "Signing you in..." : "Sign In"}
                        </button>
                    </form>
                </>
            )}
            {/* Display General Error Message (e.g., Rate Limit Warning) */}
            {formik.errors.general && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl relative text-sm text-center">
                    <span className="block sm:inline">{formik.errors.general}</span>
                </div>
            )}

            <div className="text-center mt-6 pt-4 border-t">
                <p>New to our community? <Link to="/signup" className="font-semibold text-blood-600 hover:text-blood-700">Join us today</Link></p>
            </div>
        </div>
    );
};

export default LoginForm;
