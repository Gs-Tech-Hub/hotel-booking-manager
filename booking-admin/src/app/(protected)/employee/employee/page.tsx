'use client'
import React, { useState } from 'react';
import EmployeeList from '../_components/EmployeeList';
import EmployeeRecords from '../_components/EmployeeRecords';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([
    { id: 1, name: 'John Doe', position: 'Receptionist' },
    { id: 2, name: 'Jane Smith', position: 'Chef' },
  ]);

  return (
    <div>
      <h1>Employee Management</h1>
      <EmployeeList employees={employees} setEmployees={setEmployees} />
    </div>
  );
}
