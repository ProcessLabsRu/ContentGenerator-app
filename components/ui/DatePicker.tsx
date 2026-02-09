"use client";

import * as React from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "./dropdown-menu";

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    value?: string;
    onDateChange: (date: string) => void;
    placeholder?: string;
    error?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
    label,
    value,
    onDateChange,
    placeholder,
    error,
    className = "",
    id,
    ...props
}) => {
    const { intlLocale, t } = useI18n();
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    const parseDate = (dateStr?: string) => {
        if (!dateStr) return null;
        const core = dateStr.slice(0, 10);
        if (/^\d{4}-\d{2}-\d{2}$/.test(core)) {
            const [year, month, day] = core.split("-").map(Number);
            // Create local date
            return new Date(year, month - 1, day);
        }
        return new Date(dateStr);
    };

    const selectedDate = React.useMemo(() => parseDate(value), [value]);

    React.useEffect(() => {
        if (selectedDate && !isNaN(selectedDate.getTime())) {
            setCurrentMonth(selectedDate);
        }
    }, [selectedDate]); // Update only when selectedDate changes

    const daysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const startOfMonthDay = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
    };

    const handleNextMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
    };

    const handleDateClick = (day: number) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        // Format as YYYY-MM-DD
        const dateStr = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onDateChange(dateStr);
    };

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const days = daysInMonth(year, month);
        const startDay = startOfMonthDay(year, month);
        const weeks = [];
        let day = 1;

        // First week padding
        const firstWeek = [];
        for (let i = 0; i < startDay; i++) {
            firstWeek.push(null);
        }
        while (day <= days && firstWeek.length < 7) {
            firstWeek.push(day);
            day++;
        }
        weeks.push(firstWeek);

        // Remaining weeks
        while (day <= days) {
            const week = [];
            for (let i = 0; i < 7; i++) {
                if (day > days) {
                    week.push(null);
                } else {
                    week.push(day);
                    day++;
                }
            }
            weeks.push(week);
        }

        const monthName = new Intl.DateTimeFormat(intlLocale, { month: 'long', year: 'numeric' }).format(currentMonth);
        const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']; // Short Portuguese days

        return (
            <div className="p-3 w-64" onMouseDown={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={handlePrevMonth}
                        className="p-1 hover:bg-gray-100 rounded-full"
                        type="button"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-sm capitalize">{monthName}</span>
                    <button
                        onClick={handleNextMonth}
                        className="p-1 hover:bg-gray-100 rounded-full"
                        type="button"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                    {weekDays.map((d, i) => (
                        <div key={i} className="text-xs font-medium text-gray-500">{d}</div>
                    ))}
                </div>
                <div className="space-y-1">
                    {weeks.map((week, i) => (
                        <div key={i} className="grid grid-cols-7 gap-1">
                            {week.map((d, j) => {
                                if (!d) return <div key={j} />;
                                const isSelected = selectedDate &&
                                    selectedDate.getDate() === d &&
                                    selectedDate.getMonth() === month &&
                                    selectedDate.getFullYear() === year;

                                const isToday = new Date().getDate() === d &&
                                    new Date().getMonth() === month &&
                                    new Date().getFullYear() === year;

                                return (
                                    <button
                                        key={j}
                                        onClick={() => handleDateClick(d)}
                                        className={`
                                        h-8 w-8 rounded-full text-sm flex items-center justify-center
                                        transition-colors
                                        ${isSelected ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}
                                        ${!isSelected && isToday ? 'text-indigo-600 font-bold' : ''}
                                    `}
                                        type="button"
                                    >
                                        {d}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const displayDate = selectedDate
        ? new Intl.DateTimeFormat(intlLocale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(selectedDate)
        : "";

    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                    {label}
                </label>
            )}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className={`
                w-full px-4 py-2.5 text-left border rounded-lg flex items-center justify-between
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
                ${error ? "border-red-500" : "border-gray-300"}
                ${!displayDate ? "text-gray-400" : "text-gray-900"}
                bg-white
                ${className}
            `}
                    >
                        <span>{displayDate || placeholder || "Selecione uma data"}</span>
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="p-0">
                    {renderCalendar()}
                </DropdownMenuContent>
            </DropdownMenu>
            {error && (
                <p className="mt-1.5 text-sm text-red-600" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
};
