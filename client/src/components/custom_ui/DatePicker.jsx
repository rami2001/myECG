import { useState } from "react";
import { format, getYear } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CustomCalendar from "@/components/custom_ui/CustomCalendar";

function DatePicker({ placeholder, defaultValue, fromYear, toYear, onChange }) {
  const [date, setDate] = useState(defaultValue);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className=" w-auto p-0">
        <CustomCalendar
          onSelect={(date) => {
            setDate(date);
            onChange?.(date);
          }}
          mode="single"
          captionLayout="dropdown-buttons"
          selected={date}
          fromYear={fromYear}
          toYear={toYear}
        />
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;
