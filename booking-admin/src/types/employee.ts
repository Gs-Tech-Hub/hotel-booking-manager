interface EmployeeDetails {
  documentId?: string;
  employmentDate: string | Date;
  salary: number | string;
  order_discount_total?: number;
  debt_shortage?: number;
  fines_debits?: number;
  salary_advanced?: number;
  salary_advanced_status?: 'pending' | 'approved' | 'rejected';
  users_permissions_user?: {
    documentId: string;
    id?: number;
    username?: string;
  };
  id?: string | number;
}

export type { EmployeeDetails };