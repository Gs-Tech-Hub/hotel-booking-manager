import React from 'react';
import dayjs from 'dayjs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select } from "@/components/ui-elements/select";

interface users_permissions_user {
  id: number;
  documentId: string;
  username: string;
}

interface Employee {
  id: number;
  name: string;
  position: string;
  documentId?: string;
  users_permissions_user?: users_permissions_user;
  totalFines?: number;
  totalDebts?: number;
  totalShortage?: number;
  totalSalaryAdvance?: number;
}

interface EmployeeRecordsSummaryProps {
  employees: Employee[];
  selectedMonth: string;
  setSelectedMonth: (val: string) => void;
  months: string[];
  groupedSummary: Employee[];
}

const EmployeeRecordsSummary: React.FC<EmployeeRecordsSummaryProps> = ({
  employees,
  selectedMonth,
  setSelectedMonth,
  months,
  groupedSummary,
}) => {
  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <span>Month:</span>
        <Select
          value={selectedMonth}
          onChange={val => setSelectedMonth(String(val))}
          items={months.map(m => ({ value: m, label: dayjs(m + '-01').format('MMMM YYYY') }))}
          className="w-40"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead>Employee</TableHead>
            <TableHead>Fines</TableHead>
            <TableHead>Debts</TableHead>
            <TableHead>Shortage</TableHead>
            <TableHead>Salary Advance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupedSummary.map((s: any) => (
            <TableRow 
              className="text-base font-medium text-dark dark:text-white"
              key={s.id}
            >
              <TableCell>{s.users_permissions_user?.username || s.name}</TableCell>
              <TableCell>{Math.round(s.totalFines || 0)}</TableCell>
              <TableCell>{Math.round(s.totalDebts || 0)}</TableCell>
              <TableCell>{Math.round(s.totalShortage || 0)}</TableCell>
              <TableCell>{Math.round(s.totalSalaryAdvance || 0)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default EmployeeRecordsSummary;
