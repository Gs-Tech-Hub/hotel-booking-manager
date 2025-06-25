'use client'
import React, { useState } from "react";
import { Button } from "@/components/ui-elements/button";

interface Employee {
  id: number;
  name: string;
  position: string;
}

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: "John Doe", position: "Receptionist" },
    { id: 2, name: "Jane Smith", position: "Chef" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: "", position: "" });

  const handleAddEmployee = () => {
    setEmployees([
      ...employees,
      { id: Date.now(), ...newEmployee }
    ]);
    setShowForm(false);
    setNewEmployee({ name: "", position: "" });
  };

  return (
    <div className="mb-8">
      <h2 className="font-bold mb-2">Employee List</h2>
      <table className="w-full mb-2 border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Position</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td className="border px-2 py-1">{emp.name}</td>
              <td className="border px-2 py-1">{emp.position}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button label="Add Employee" variant="primary" onClick={() => setShowForm(true)} />
      {showForm && (
        <div className="mt-2 p-2 border rounded bg-gray-50">
          <input
            className="border p-1 mr-2"
            placeholder="Name"
            value={newEmployee.name}
            onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })}
          />
          <input
            className="border p-1 mr-2"
            placeholder="Position"
            value={newEmployee.position}
            onChange={e => setNewEmployee({ ...newEmployee, position: e.target.value })}
          />
          <Button label="Save" variant="primary" size="small" onClick={handleAddEmployee} />
          <Button label="Cancel" variant="outlinePrimary" size="small" onClick={() => setShowForm(false)} />
        </div>
      )}
    </div>
  );
}
