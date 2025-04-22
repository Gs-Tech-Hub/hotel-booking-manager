import React from "react";

export function Card({
  title,
  content,
  footer,
}: {
  title: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg shadow-md bg-white dark:bg-gray-dark p-5">
      <h3 className="text-lg font-bold mb-3 text-dark dark:text-white">{title}</h3>
      <div className="mb-3 text-sm text-gray-700 dark:text-gray-300">{content}</div>
      {footer && <div className="mt-3">{footer}</div>}
    </div>
  );
}
