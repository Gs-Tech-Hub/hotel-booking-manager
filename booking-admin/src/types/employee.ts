interface EmployeeDetails {
  documentId?: string;
  employmentDate: Date;
  salary: number;
  order_discount_total?: number;
  debt_shortage?: number;
  fines_debits?: number;
  salary_advanced?: number;
  salary_advanced_status?: 'pending' | 'approved' | 'rejected';
  users_permissions_user?: {
    documentId: string;
    id?: number
  };
  id?: string;
}

export type { EmployeeDetails };