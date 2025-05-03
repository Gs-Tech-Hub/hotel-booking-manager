import React, { createContext } from "react";

type SelectContextType = {
  value: string | number;
  onChange: (value: string | number) => void;
};

interface SelectOption {
  label: string;
  value: string;
}
const SelectContext = createContext<SelectContextType | null>(null);

type SelectProps = {
  value: string | number;
  onChange: (value: string | number) => void;
  items?: { value: string | number; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  children?: React.ReactNode;
  options?: SelectOption[];

};

export function Select({
  value,
  onChange,
  items = [],
  placeholder = "Select an option",
  disabled = false,
  error,
  className = "",
  children,
}: SelectProps) {
  return (
    <div className={`relative ${className}`}>
      <SelectContext.Provider value={{ value, onChange }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
            disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
          } ${error ? "border-red-500" : "border-gray-300"}`}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {items.length > 0 ? (
            items.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No options available
            </option>
          )}
          {children}

        </select>
      </SelectContext.Provider>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
