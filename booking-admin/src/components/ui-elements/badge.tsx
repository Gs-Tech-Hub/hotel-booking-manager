import React from "react";

export function Badge({
  label,
  color = "primary",
}: {
  label: string;
  color?: "primary" | "green" | "dark" | "red" | "yellow";
}) {
  const base = "px-3 py-1 text-sm font-medium rounded-full";
  const variants = {
    primary: "bg-primary text-white",
    green: "bg-green text-white",
    dark: "bg-gray-800 text-white",
    red: "bg-red-600 text-white",
    yellow: "bg-yellow-500 text-black",
  };

  return <span className={`${base} ${variants[color]}`}>{label}</span>;
}
