import React from "react";
import LoginForm from "../components/auth/LoginForm";
import AuthLayout from "../components/AuthLayout";

// This component is now a simple, clean "dumb" component.
// All logic has been moved into the useLogin hook and LoginForm.
export const LoginPage = () => {
    return (
        <AuthLayout hideRightPanel={true}>
            <div className="w-full max-w-md">
                {/* LoginForm is now self-contained and doesn't need any props for logic */}
                <LoginForm />
            </div>
        </AuthLayout>
    );
};

