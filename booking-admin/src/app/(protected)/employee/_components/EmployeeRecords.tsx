/* eslint-disable */
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Card } from "@/components/ui-elements/card";
import { Input } from "@/components/ui-elements/input";
import { Select } from "@/components/ui-elements/select";
import { Button } from "@/components/ui-elements/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { strapiService } from '@/utils/dataEndpoint/index';
import EmployeeRecordsSummary from "./EmployeeRecordsSummary";

interface User {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;

}

interface users_permissions_user {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface DescriptionNode {
  type: string;
  children: { type: string; text: string }[];
}

interface EmployeeRecord {
  id: number;
  documentId: string;
  fines: number | null;
  debts: number | null;
  shortage: number | null;
  salary_advance: number | null;
  description: DescriptionNode[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  date: string;
  users_permissions_user: users_permissions_user;

}

interface Employee {
  id: number;
  name: string;
  position: string;
  documentId?: string;
  users_permissions_user?: users_permissions_user;
}

const initialNewRecord = (employees: Employee[]): Omit<EmployeeRecord, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'> => ({
  documentId: '',
  fines: null,
  debts: null,
  shortage: null,
  salary_advance: null,
  description: [{ type: 'paragraph', children: [{ type: 'text', text: '' }] }],
  date: '',
  users_permissions_user: {
    id: employees[0]?.users_permissions_user?.id || 1,
    documentId: employees[0]?.users_permissions_user?.documentId || '',
    username: employees[0]?.users_permissions_user?.username || '',
    email: '',
    provider: '',
    confirmed: true,
    blocked: false,
    createdAt: '',
    updatedAt: '',
    publishedAt: '',
  },
});

export default function EmployeeRecords({ employees }: { employees: Employee[] }) {
  const [records, setRecords] = useState<EmployeeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [newRecord, setNewRecord] = useState<Omit<EmployeeRecord, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'>>(
    initialNewRecord(employees)
  );
  const [sortDesc, setSortDesc] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'));

  useEffect(() => {
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await strapiService.employeeEndpoints.getEmployeeRecords('employee-records', { "populate": '*' });
      const mappedRecords: EmployeeRecord[] = response.map((item: any) => ({
        id: item.id,
        documentId: item.documentId,
        fines: item.fines,
        debts: item.debts,
        shortage: item.shortage,
        salary_advance: item.salary_advance,
        description: item.description,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        publishedAt: item.publishedAt,
        date: item.date,
        users_permissions_user: item.users_permissions_user,
      }));
      setRecords(mappedRecords);
    } catch (e) {
      // handle error
    } finally {
      setLoading(false);
    }
  };
  fetchRecords();
}, []);

  // Sort records by date
  const sortedRecords = [...records].sort((a: EmployeeRecord, b: EmployeeRecord) => {
    const aDate = new Date(a.date).getTime();
    const bDate = new Date(b.date).getTime();
    return sortDesc ? bDate - aDate : aDate - bDate;
  });
  const lastFiveRecords = sortedRecords.slice(0, 5);

  // Get all months present in records for dropdown
  const months = Array.from(
    new Set(records.map((r: EmployeeRecord) => dayjs(r.date).format('YYYY-MM')))
  ).sort((a, b) => b.localeCompare(a));

const groupedSummary = employees.map(emp => {
  const empRecords = records.filter((r: EmployeeRecord) => {
    return (
      r.users_permissions_user?.documentId === emp.users_permissions_user?.documentId
    )
  });
  const totals = empRecords.reduce(
    (acc, rec) => {
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
    
  const handleAddRecord = async () => {
    console.log('New Records:', newRecord);
    try {
      const created = await strapiService.employeeEndpoints.createEmployeeRecords({
        users_permissions_user: newRecord.users_permissions_user.id,
        fines: newRecord.fines || null,
        debts: newRecord.debts || null,
        shortage: newRecord.shortage || null,
        salary_advance: newRecord.salary_advance || null,
        description: newRecord.description,
        date: newRecord.date,
      });
      setRecords([created, ...records]);
      setNewRecord(initialNewRecord(employees));
    } catch (e) {
      console.error('Error adding record:', e);
      `Error: ${e}`
    }
  };

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card mb-6">
      {/* Add Record Form at the top */}
      <Card
        title="Add Record"
        content={
          <form
            className="flex flex-col md:flex-row gap-2 items-center border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5"
            onSubmit={e => {
              e.preventDefault();
              handleAddRecord();
            }}
          >
            <Select
              value={newRecord.users_permissions_user.id}
              onChange={val => {
                const selectedEmp = employees.find(emp => emp.users_permissions_user?.id === Number(val));
                setNewRecord({
                  ...newRecord,
                  users_permissions_user: {
                    ...newRecord.users_permissions_user,
                    id: selectedEmp?.users_permissions_user?.id || 1,
                  },
                });
              }}
              items={employees.map(emp => ({
                value: emp.users_permissions_user?.id ?? '',
                label: emp.users_permissions_user?.username || emp.name
              }))}
              className="w-40"
            />
            <Input
              type="number"
              placeholder="Fines"
              value={newRecord.fines ?? ''}
              onChange={e => setNewRecord({ ...newRecord, fines: Number(e.target.value) })}
              className="w-28"
            />
            <Input
              type="number"
              placeholder="Debts"
              value={newRecord.debts ?? ''}
              onChange={e => setNewRecord({ ...newRecord, debts: Number(e.target.value) })}
              className="w-28"
            />
            <Input
              type="number"
              placeholder="Shortage"
              value={newRecord.shortage ?? ''}
              onChange={e => setNewRecord({ ...newRecord, shortage: Number(e.target.value) })}
              className="w-28"
            />
            <Input
              type="number"
              placeholder="Salary Advance"
              value={newRecord.salary_advance ?? ''}
              onChange={e => setNewRecord({ ...newRecord, salary_advance: Number(e.target.value) })}
              className="w-28"
            />
            <Input
              placeholder="Description"
              value={newRecord.description[0]?.children[0]?.text || ''}
              onChange={e => setNewRecord({
                ...newRecord,
                description: [{ type: 'paragraph', children: [{ type: 'text', text: e.target.value }] }],
              })}
              className="w-40"
              required
            />
            <Input
              type="date"
              value={newRecord.date}
              onChange={e => setNewRecord({ ...newRecord, date: e.target.value })}
              className="w-36"
              required
            />
            <Button size="small" label="Add" />
          </form>
        }
      />

      {/* Details Table (last 5 records) */}
      <Card
        title="Employee Records"
        content={
          <>
            <div className="flex justify-between items-center mb-2">
              <span>Showing last 5 records</span>
              <Button size="small" label={sortDesc ? 'Sort: Newest' : 'Sort: Oldest'} onClick={() => setSortDesc(v => !v)} />
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
                  <TableHead>Date</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Fines</TableHead>
                  <TableHead>Debts</TableHead>
                  <TableHead>Shortage</TableHead>
                  <TableHead>Salary Advance</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <tr><td colSpan={7}>Loading...</td></tr>
                ) : lastFiveRecords.length === 0 ? (
                  <tr><td colSpan={7}>No records found.</td></tr>
                ) : (
                  lastFiveRecords.map((rec: EmployeeRecord) => (
                    <TableRow
                      className="text-base font-medium text-dark dark:text-white"
                     key={rec.id}>
                      <TableCell>{dayjs(rec.date).format('YYYY-MM-DD')}</TableCell>
                      <TableCell>{rec.users_permissions_user?.username}</TableCell>
                      <TableCell>{rec.fines ?? '-'}</TableCell>
                      <TableCell>{rec.debts ?? '-'}</TableCell>
                      <TableCell>{rec.shortage ?? '-'}</TableCell>
                      <TableCell>{rec.salary_advance ?? '-'}</TableCell>
                      <TableCell>{rec.description?.[0]?.children?.[0]?.text ?? '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </>
        }
        footer={null}
      />
    </div>
  );
}
