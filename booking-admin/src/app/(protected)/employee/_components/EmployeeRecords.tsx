import React, { useState } from 'react';
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

interface Employee {
  id: number;
  name: string;
  position: string;
}

interface Record {
  id: number;
  employeeId: number;
  type: 'fine' | 'due' | 'other';
  amount: number;
  description: string;
  date: string;
}

const initialRecords: Record[] = [
  { id: 1, employeeId: 1, type: 'fine', amount: 50, description: 'Late', date: '2024-06-01' },
];

export default function EmployeeRecords({ employees }: { employees: Employee[] }) {
  const [records, setRecords] = useState<Record[]>(initialRecords);
  const [newRecord, setNewRecord] = useState<Omit<Record, 'id'>>({
    employeeId: employees[0]?.id || 1,
    type: 'fine',
    amount: 0,
    description: '',
    date: '',
  });

  const handleAddRecord = () => {
    setRecords([
      ...records,
      { id: Date.now(), ...newRecord }
    ]);
    setNewRecord({
      employeeId: employees[0]?.id || 1,
      type: 'fine',
      amount: 0,
      description: '',
      date: '',
    });
  };

  const summary = employees.map(emp => {
    const empRecords = records.filter(r => r.employeeId === emp.id);
    const totalFines = empRecords.filter(r => r.type === 'fine').reduce((sum, r) => sum + r.amount, 0);
    const totalDues = empRecords.filter(r => r.type === 'due').reduce((sum, r) => sum + r.amount, 0);
    return { ...emp, totalFines, totalDues };
  });

  return (
    <div className="space-y-8">
      <Card
        title="Employee Records"
        content={
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map(rec => (
                <TableRow key={rec.id}>
                  <TableCell>{employees.find(e => e.id === rec.employeeId)?.name}</TableCell>
                  <TableCell>{rec.type}</TableCell>
                  <TableCell>{rec.amount}</TableCell>
                  <TableCell>{rec.description}</TableCell>
                  <TableCell>{rec.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        }
        footer={null}
      />

      <Card
        title="Add Record"
        content={
          <form
            className="flex flex-col md:flex-row gap-2 items-center"
            onSubmit={e => {
              e.preventDefault();
              handleAddRecord();
            }}
          >
            <Select
              value={newRecord.employeeId}
              onChange={val => setNewRecord({ ...newRecord, employeeId: Number(val) })}
              items={employees.map(emp => ({ value: emp.id, label: emp.name }))}
              className="w-40"
            />
            <Select
              value={newRecord.type}
              onChange={val => setNewRecord({ ...newRecord, type: val as any })}
              items={[
                { value: "fine", label: "Fine" },
                { value: "due", label: "Due" },
                { value: "other", label: "Other" },
              ]}
              className="w-32"
            />
            <Input
              type="number"
              placeholder="Amount"
              value={newRecord.amount}
              onChange={e => setNewRecord({ ...newRecord, amount: Number(e.target.value) })}
              className="w-28"
              required
            />
            <Input
              placeholder="Description"
              value={newRecord.description}
              onChange={e => setNewRecord({ ...newRecord, description: e.target.value })}
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

      <Card
        title="Summary"
        content={
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Total Fines</TableHead>
                <TableHead>Total Dues</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.map(s => (
                <TableRow key={s.id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.totalFines}</TableCell>
                  <TableCell>{s.totalDues}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        }
      />

      <Card
        title="Analytics"
        content={
          <div>
            {/* Insert chart components here */}
          </div>
        }
      />
    </div>
  );
}