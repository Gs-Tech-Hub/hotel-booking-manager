'use client'
import { strapiService } from "@/utils/dataEndPoint"
import { EmployeeSummaryTable } from "./_components/employee-table"
import { Suspense, useEffect, useState } from "react"

export default function EmployeeSummaryPage() {
    const [employeeDetails, setEmployeeDetails] = useState([])

    useEffect(() => {
        const fetchEmployees = async () => {
            const data = await strapiService.getEmployeeSummary({
             "populate": "*"
            });
            console.log('employeeData:', data);
            setEmployeeDetails(data)
        }
        fetchEmployees()
    }, [])

    return (
        <Suspense >
        <EmployeeSummaryTable 
        employeeDetails={employeeDetails} />
        </Suspense>
    )
}