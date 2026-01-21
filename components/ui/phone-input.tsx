"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

const countries = [
    { value: "+252", label: "Somalia", flag: "🇸🇴" },
    { value: "+253", label: "Djibouti", flag: "🇩🇯" },
    { value: "+254", label: "Kenya", flag: "🇰🇪" },
    { value: "+251", label: "Ethiopia", flag: "🇪🇹" },
];

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onPhoneChange?: (value: string) => void;
    defaultValue?: string;
}

export function PhoneInput({ className, onPhoneChange, defaultValue, ...props }: PhoneInputProps) {
    // Parse default value if present to split country code and number
    // Assuming format like "+252 6155555" or "+2526155555"
    const initialCountry = defaultValue?.startsWith("+") ? defaultValue.substring(0, 4) : "+252";
    // Remove country code and spaces from initial number
    const initialNumber = defaultValue ? defaultValue.replace(initialCountry, "").trim() : "";

    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(initialCountry);
    const [phoneNumber, setPhoneNumber] = React.useState(initialNumber);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-digits
        setPhoneNumber(rawValue);
        // Standardize: No spaces for backend consistency: +25261...
        if (onPhoneChange) {
            onPhoneChange(`${value}${rawValue}`);
        }
    };

    const handleCountrySelect = (currentValue: string) => {
        setValue(currentValue);
        setOpen(false);
        if (onPhoneChange) {
            onPhoneChange(`${currentValue}${phoneNumber}`);
        }
    };

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[110px] justify-between h-10 px-3 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700"
                    >
                        <span className="flex items-center gap-2">
                            <span className="text-lg">{countries.find((framework) => framework.value === value)?.flag}</span>
                            <span className="font-medium text-xs">{countries.find((framework) => framework.value === value)?.value}</span>
                        </span>
                        <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-2 bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
                    <div className="space-y-1">
                        {countries.map((country) => (
                            <button
                                key={country.value}
                                onClick={() => handleCountrySelect(country.value)}
                                className={cn(
                                    "flex items-center w-full px-2 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                                    value === country.value ? "bg-slate-100 dark:bg-slate-800" : ""
                                )}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4 text-primary",
                                        value === country.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                <span className="mr-2 text-lg">{country.flag}</span>
                                <span className="flex-1 text-left">{country.label}</span>
                                <span className="text-xs text-gray-500">{country.value}</span>
                            </button>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
            <Input
                {...props}
                type="tel"
                placeholder="61 555 5555"
                className="flex-1 h-10 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 font-medium placeholder:text-gray-300 dark:text-white"
                value={phoneNumber}
                onChange={handlePhoneChange}
                name="phoneNumberOnly" // Helper to avoid submitting raw
            />
            {/* Hidden input to submit the full value naturally if needed, though we handle form submission manually mostly */}
            <input type="hidden" name={props.name} value={`${value}${phoneNumber}`} />
        </div>
    );
}
