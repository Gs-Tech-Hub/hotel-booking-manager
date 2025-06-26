/* eslint-disable */
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import EmployeeRecordsSummary from "./EmployeeRecordsSummary";
import { employeeEndpoints } from "@/utils/dataEndpoint/employeeEndpoints";

export default function EmployeeSummary({ employeeDetails }: { employeeDetails: any[] }) {
  const [records, setRecords] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await employeeEndpoints.getEmployeeRecords(
          "employee-records",
          { populate: "*" }
        );
        setRecords(response);
      } catch (e) {
        console.error("Error fetching employee records:", e);
      }
    };
    fetchRecords();
  }, []);

  // Get all months present in records for dropdown
  const months = Array.from(
    new Set(records.map((r: any) => dayjs(r.date).format("YYYY-MM")))
  ).sort((a, b) => b.localeCompare(a));

  // Grouped summary logic
  const groupedSummary = employeeDetails.map((emp: any) => {
    const empRecords = records.filter((r: any) =>
      r.users_permissions_user?.documentId === emp.users_permissions_user?.documentId
    );
    const totals = empRecords.reduce(
      (acc: any, rec: any) => {
        acc.fines += rec.fines ?? 0;
        acc.debts += rec.debts ?? 0;
        acc.shortage += rec.shortage ?? 0;
        acc.salary_advance += rec.salary_advance ?? 0;
        return acc;
      },
      { fines: 0, debts: 0, shortage: 0, salary_advance: 0 }
    );
    return {
      ...emp,
      totalFines: totals.fines,
      totalDebts: totals.debts,
      totalShortage: totals.shortage,
      totalSalaryAdvance: totals.salary_advance,
    };
  });

  return (
    <div>
      <EmployeeRecordsSummary
        employees={employeeDetails}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        months={months}
        groupedSummary={groupedSummary}
      />
    </div>
  );
}
