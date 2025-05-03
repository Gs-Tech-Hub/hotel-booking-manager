'use client'
import { strapiService } from "@/utils/dataEndPoint"
import { EmployeeSummaryTable } from "./_components/emp-tables/employee-summary-table"
import { Suspense, useEffect, useState } from "react"
import EmployeeOrdersTable from "./_components/emp-tables/employee-order-table"
import { Button } from "@/components/ui-elements/button"

export default function EmployeeSummaryPage() {
    const [employeeDetails, setEmployeeDetails] = useState([]) 
    const [employeeOrdersData, setEmployeeOrdersData] = useState([]);
    const [showSummary, setShowSummary] = useState(false)

    useEffect(() => {
        const fetchEmployees = async () => {
            const employeeSummaryData = await strapiService.getEmployeeSummary({
             "populate": "*"
            });
            console.log('employeeData:', employeeSummaryData);
            setEmployeeDetails(employeeSummaryData);

            const employeeOrdersData = await strapiService.getEmployeeOrders({
             "populate": "*",
            });
            console.log('employee Orders:', employeeOrdersData);
            setEmployeeOrdersData(employeeOrdersData);
        }
        fetchEmployees()
    }, [])

    return (
        <div>
            <div className="mb-4">
                <Button 
                    label={showSummary ? "Show Employee Orders" : "Show Employee Summary"} 
                    variant="primary" 
                    onClick={() => setShowSummary(!showSummary)} 
                />

            
            </div>
            <Suspense>
                {showSummary ? (
                <EmployeeOrdersTable data={employeeOrdersData} />
                ) : (
               <EmployeeSummaryTable employeeDetails={employeeDetails} />
                )}
            </Suspense>
        </div>
    )
}