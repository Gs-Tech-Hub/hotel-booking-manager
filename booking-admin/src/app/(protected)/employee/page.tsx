/* eslint-disable */
'use client'
import { strapiService } from "@/utils/dataEndPoint"
import { EmployeeEmploymentTable } from "./_components/emp-tables/employee-summary-table"
import { Suspense, useEffect, useState } from "react"
import EmployeeOrdersTable from "./_components/emp-tables/employee-order-table"
import { Button } from "@/components/ui-elements/button"
import { Modal } from "@/components/ui-elements/modal"
import EmployeeRecords from "./_components/EmployeeRecords"
import EmployeeSummary from "./_components/EmployeeSummary"

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

    useEffect(() => {
        fetchEmployees();
    }, [])

    const fetchEmployees = async () => {
        const employeeSummaryData = await strapiService.getEmployeeSummary({
            "populate": "*"
        });
        setEmployeeDetails(employeeSummaryData);

        const employeeOrdersData = await strapiService.getEmployeeOrders({
            "populate": "*",
        });
        setEmployeeOrdersData(employeeOrdersData);
    };

    const handleCreateEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            // You may need to adjust the payload to match your backend
            await strapiService.createEmployeeSummary({
                users_permissions_user: { documentId: "", username: form.username },
                employmentDate: form.employmentDate,
                position: form.position,
                salary: form.salary,
            });
            setShowCreateModal(false);
            setForm({ username: "", employmentDate: "", position: "", salary: "" });
            await fetchEmployees();
        } catch (error) {
            console.error("Error creating employee:", error);
            // Optionally, you can show an error message to the user
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
                                type="number"
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
                                <button type="submit" disabled={isCreating}>
                                <Button label="Cancel" onClick={() => setShowCreateModal(false)} />
                                <Button label={isCreating ? "Creating..." : "Create"} disabled={isCreating} />
                            </button>
                        </div>
                    </form>
                }
            />
        </div>
    )
}