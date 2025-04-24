import React from "react";

export function SelectItem({
  value,
  children,
}: {
  value: string | number;
  children: React.ReactNode;
}) {
  return <option value={value}>{children}</option>;
}
