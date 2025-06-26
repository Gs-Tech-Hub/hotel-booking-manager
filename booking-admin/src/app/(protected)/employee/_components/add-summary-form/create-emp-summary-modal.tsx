import React, { useState } from "react";
import { Modal} from "@/components/ui-elements/modal"; 
import { Button } from "@/components/ui-elements/button";
import AddEmployeeSummaryForm from "./add-emp-summary-form";
import { EmployeeDetails } from "@/types/employee";

export default function CreateEmployeeSummaryModal(employeeDetails: EmployeeDetails) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button   
        onClick={() => setIsOpen(true)}
        label="Attendance"
        variant="outlinePrimary"
        size="small"
      />

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add/Update Employee Data"
        content={<AddEmployeeSummaryForm 
          initialData={{ 
            ...employeeDetails, 
            documentId: employeeDetails.documentId || '', 
            id: employeeDetails.id,
            employmentDate: employeeDetails.employmentDate || '',
            salary: employeeDetails.salary || 0
          }}
          onSubmit={() => {
            setIsOpen(false);
          }}
        />}
      />
    </div>
  ); 
}
