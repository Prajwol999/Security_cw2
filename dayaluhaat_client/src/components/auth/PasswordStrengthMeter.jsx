import React from 'react';
import { Check, X } from 'lucide-react';

export default function PasswordStrengthMeter({ password }) {
    const requirements = [
        { regex: /.{8,}/, text: "At least 8 characters" },
        { regex: /[A-Z]/, text: "At least one uppercase letter" },
        { regex: /[a-z]/, text: "At least one lowercase letter" },
        { regex: /[0-9]/, text: "At least one number" },
        { regex: /[^A-Za-z0-9]/, text: "At least one special character" }
    ];

    const strength = requirements.reduce((acc, req) => (req.regex.test(password) ? acc + 1 : acc), 0);

    const getStrengthColor = () => {
        if (strength <= 1) return 'bg-red-500';
        if (strength <= 3) return 'bg-yellow-500';
        if (strength === 4) return 'bg-blue-500';
        return 'bg-green-500';
    };

    const getStrengthLabel = () => {
        if (strength <= 1) return 'Weak';
        if (strength <= 3) return 'Moderate';
        if (strength === 4) return 'Strong';
        return 'Very Strong';
    };

    return (
        <div className="mt-4 space-y-3">
            {/* Strength Bar */}
            <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                    <span>Password Strength</span>
                    <span className="font-semibold">{getStrengthLabel()}</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${getStrengthColor()} transition-all duration-300`}
                        style={{ width: `${(strength / 5) * 100}%` }}
                    />
                </div>
            </div>

            {/* Requirements List */}
            <div className="space-y-1">
                {requirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs">
                        {req.regex.test(password) ? (
                            <Check className="w-3 h-3 text-green-500" />
                        ) : (
                            <X className="w-3 h-3 text-red-400" />
                        )}
                        <span className={req.regex.test(password) ? "text-green-600 font-medium" : "text-gray-400"}>
                            {req.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
