import React, { useState } from 'react';

interface Employee {
  id: number;
  name: string;
  position: string;
}

export default function EmployeeList({
  employees,
  setEmployees,
}: {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', position: '' });

  const handleAddEmployee = () => {
    setEmployees([
      ...employees,
      { id: Date.now(), ...newEmployee }
    ]);
    setShowForm(false);
    setNewEmployee({ name: '', position: '' });
  };

  return (
    <div>
      <h2>Employees</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.position}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setShowForm(true)}>Add Employee</button>
      {showForm && (
        <div>
          <h3>New Employee</h3>
          <input
            placeholder="Name"
            value={newEmployee.name}
            onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })}
          />
          <input
            placeholder="Position"
            value={newEmployee.position}
            onChange={e => setNewEmployee({ ...newEmployee, position: e.target.value })}
          />
          <button onClick={handleAddEmployee}>Save</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}