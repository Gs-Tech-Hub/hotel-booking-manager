import { useState, useEffect } from "react";

interface DateRangePickerProps {
  onChange: (start: string, end: string) => void;
  className?: string;
}

const generatePastWeekDateRanges = () => {
  const now = new Date();
  const ranges = [];
  for (let i = 0; i < 7; i++) {
    const pastDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    ranges.push({
      label:
        i === 0
          ? `Today (${pastDate.toLocaleDateString()})`
          : i === 1
          ? `Yesterday (${pastDate.toLocaleDateString()})`
          : `${i} days ago (${pastDate.toLocaleDateString()})`,
      value: pastDate.toISOString().split("T")[0],
    });
  }
  return ranges;
};

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
