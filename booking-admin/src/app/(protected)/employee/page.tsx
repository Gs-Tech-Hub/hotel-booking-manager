/* eslint-disable */
'use client'
import { EmployeeEmploymentTable } from "./_components/emp-tables/employee-summary-table"
import { Suspense, useEffect, useState } from "react"
import EmployeeOrdersTable from "./_components/emp-tables/employee-order-table"
import { Button } from "@/components/ui-elements/button"
import { Modal } from "@/components/ui-elements/modal"
import EmployeeRecords from "./_components/EmployeeRecords"
import EmployeeSummary from "./_components/EmployeeSummary"
import { userEndpoints } from "@/utils/dataEndpoint/userEndPoint";
import { employeeEndpoints } from "@/utils/dataEndpoint/employeeEndpoints";

export default function EmployeeSummaryPage() {
    const [employeeDetails, setEmployeeDetails] = useState<any[]>([]) 
    const [employeeOrdersData, setEmployeeOrdersData] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [form, setForm] = useState({
        username: "",
        employmentDate: "",
        position: "",
        salary: "",
    });
    const [view, setView] = useState<'summary' | 'employee' | 'orders' | 'details'>('summary');
        const { createUser } = userEndpoints();

    useEffect(() => {
        fetchEmployees();
    }, [])

    const fetchEmployees = async () => {
        const employeeSummaryData = await employeeEndpoints.getEmployeeSummary({
            "populate": "*"
        });
        setEmployeeDetails(employeeSummaryData);

        const employeeOrdersData = await employeeEndpoints.getEmployeeOrders({
            "populate": "*",
        });
        setEmployeeOrdersData(employeeOrdersData);
    };

    const handleCreateEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            // 1. Create the user first
            const sanitizedUsername = form.username.replace(/\s+/g, '').toLowerCase();
          
            const user = await createUser(
                 sanitizedUsername,
                 sanitizedUsername + "@demostaff.com",
                 'admin123',
            );
            console.log("User created:", user);
            const userID = user.user.id;
            // 2. Use the user id to create the employee summary
          const newEmployee = await employeeEndpoints.createEmployeeSummary({
                // Properly connect the user permission to the created user
                employmentDate: form.employmentDate,
                salary: form.salary,
                position: form.position,
                order_discount_total: 0,
                debt_shortage: 0,
                fines_debits: 0,
                salary_advanced: 0,
                salary_advanced_status: "pending",
            });
            await employeeEndpoints.updateEmployeeSummary(newEmployee.documentId, {
            users_permissions_user: { connect: { id: userID } },
            });

            setShowCreateModal(false);
            setForm({ username: "", employmentDate: "", position: "", salary: "" });
            await fetchEmployees();
        } catch (error) {
            console.error("Error creating employee:", error);
            alert("Failed to create employee. Please try again.");
        } finally {
            setIsCreating(false);
        }
    };

    // Handler to update attendance in employeeDetails after check-in
    const handleAttendanceUpdate = (employeeId: number, newAttendance: any[]) => {
        setEmployeeDetails((prev) =>
            prev.map((emp) =>
                emp.id === employeeId ? { ...emp, check_ins: newAttendance } : emp
            )
        );
    };

    return (
        <div>
            <div className="mb-4 flex gap-2">
                <Button label="Employee " onClick={() => setView('employee')} variant={view === 'employee' ? "primary" : "outlinePrimary"} />
                <Button label="Summary" onClick={() => setView('summary')} variant={view === 'summary' ? "primary" : "outlinePrimary"} />
                <Button label="Employee Details" onClick={() => setView('details')} variant={view === 'details' ? "primary" : "outlinePrimary"} />
                <Button label="Employee Orders" onClick={() => setView('orders')} variant={view === 'orders' ? "primary" : "outlinePrimary"} />
                <Button
                    label="Add Employee"
                    variant="primary"
                    onClick={() => setShowCreateModal(true)}
                />
            </div>
            <Suspense>
                {view === 'employee' && <EmployeeEmploymentTable employeeDetails={employeeDetails} onAttendanceUpdate={handleAttendanceUpdate} />}
                {view === 'summary' && <EmployeeSummary employeeDetails={employeeDetails} />}
                {view === 'orders' && <EmployeeOrdersTable data={employeeOrdersData} />}
                {view === 'details' && <EmployeeRecords employees={employeeDetails} />}
            </Suspense>
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create Employee"
                content={
                    <form onSubmit={handleCreateEmployee} className="space-y-4">
                        <div>
                            <label className="block mb-1 font-medium">Name</label>
                            <input
                                type="text"
                                className="w-full border rounded p-2"
                                value={form.username}
                                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Employment Date</label>
                            <input
                                type="date"
                                className="w-full border rounded p-2"
                                value={form.employmentDate}
                                onChange={e => setForm(f => ({ ...f, employmentDate: e.target.value }))}
                                required
                            />
                        </div>
                         <div>
                            <label className="block mb-1 font-medium">Position</label>
                            <input
                                type="text"
                                className="w-full border rounded p-2"
                                value={form.position}
                                onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Salary</label>
                            <input
                                type="number"
                                className="w-full border rounded p-2"
                                value={form.salary}
                                onChange={e => setForm(f => ({ ...f, salary: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                                <Button label="Cancel" onClick={() => setShowCreateModal(false)} />
                            <Button label={isCreating ? "Creating..." : "Create"} disabled={isCreating} />
                        </div>
                    </form>
                }
            />
        </div>
    )
}