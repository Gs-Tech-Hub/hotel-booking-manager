import React, { createContext } from "react";

type SelectContextType = {
  value: string;
  onChange: (value: string) => void;
};

const SelectContext = createContext<SelectContextType | null>(null);

export function Select({
  value,
  onChange,
  children,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <SelectContext.Provider value={{ value, onChange }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
      >
        {children}
      </select>
    </SelectContext.Provider>
  );
}
