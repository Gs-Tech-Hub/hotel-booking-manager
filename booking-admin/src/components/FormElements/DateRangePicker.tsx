import { useState, useEffect } from "react";

interface DateRangePickerProps {
  onChange: (start: string, end: string) => void;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ onChange, className }) => {
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);

  const format = (date: Date) => date.toISOString().split("T")[0];

  const [start, setStart] = useState(format(sevenDaysAgo));
  const [end, setEnd] = useState(format(today));

  useEffect(() => {
    onChange(start, end);
  }, [start, end, onChange]);

  return (
    <div className={`flex gap-2 items-center ${className || ''}`}>
      <input
        type="date"
        className="form-datepicker w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-3 py-2 font-normal outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
        min={format(sevenDaysAgo)}
        max={format(today)}
        value={start}
        onChange={e => setStart(e.target.value)}
      />
      <span className="mx-1">to</span>
      <input
        type="date"
        className="form-datepicker w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-3 py-2 font-normal outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
        min={start}
        max={format(today)}
        value={end}
        onChange={e => setEnd(e.target.value)}
      />
    </div>
  );
};
