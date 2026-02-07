"use client";

import * as React from "react";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <label className="flex items-center cursor-pointer group">
                <div className="relative">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        ref={ref}
                        {...props}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 transition-colors"></div>
                </div>
                {label && (
                    <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                        {label}
                    </span>
                )}
            </label>
        );
    }
);

Switch.displayName = "Switch";
