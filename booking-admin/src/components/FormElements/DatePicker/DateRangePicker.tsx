import { useState, useEffect } from "react";
import { generatePastWeekDateRanges } from "@/lib/dateRange";

interface DateRangePickerProps {
  onChange: (start: string, end: string) => void;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ onChange, className }) => {
  const pastWeekDateRanges = generatePastWeekDateRanges();
  const [selected, setSelected] = useState(pastWeekDateRanges[0].value);

  useEffect(() => {
    onChange(selected, selected);
    // Only run when selected changes
  }, [selected, onChange]);

  return (
    <div className={`flex gap-2 items-center ${className || ''}`}>
      <select
        className="form-datepicker w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-3 py-2 font-normal outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
        value={selected}
        onChange={e => setSelected(e.target.value)}
      >
        {pastWeekDateRanges.map((range) => (
          <option key={range.value} value={range.value}>
            {range.label}
          </option>
        ))}
      </select>
    </div>
  );
};
