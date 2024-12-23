import React from "react";
import { useField } from "formik";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateInputProps {
  label: string;
  name: string;
  id?: string;
  className?: string;
  onChange?: (date: Date | undefined) => void;
}

const DateInput = ({ label, onChange, ...props }: DateInputProps) => {
  const [field, meta, helpers] = useField(props);
  
  const handleSelect = (date: Date | undefined) => {
    // Call the onChange prop if provided
    if (onChange) {
      onChange(date);
    } else {
      // Default behavior - store date as ISO string
      helpers.setValue(date ? format(date, 'yyyy-MM-dd') : '');
    }
    helpers.setTouched(true);
  };

  // Convert string date back to Date object for the calendar
  const selectedDate = field.value ? new Date(field.value) : new Date("2024-10-31");

  return (
    <div className="w-full">
      <label 
        htmlFor={props.id || props.name}
        className="block text-sm font-medium mb-1"
      >
        {label}
      </label>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full h-[50px] justify-start text-left font-normal border-2",
              !field.value && "text-muted-foreground",
              meta.touched && meta.error && "border-red-500",
              props.className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {field.value ? (
              format(new Date(field.value), "PPP")
            ) : (
              <span>Select date...</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default DateInput;