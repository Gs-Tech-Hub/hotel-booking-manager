import React from "react";

export function Tag({
  label,
  outline = false,
}: {
  label: string;
  outline?: boolean;
}) {
  const base = "px-2 py-0.5 text-xs font-semibold rounded-md";
  const solid = "bg-blue-600 text-white";
  const outlined = "border border-blue-600 text-blue-600";

  return <span className={`${base} ${outline ? outlined : solid}`}>{label}</span>;
}
