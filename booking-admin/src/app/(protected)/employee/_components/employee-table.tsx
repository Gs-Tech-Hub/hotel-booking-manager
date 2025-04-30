import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/utils/priceHandler";

export function EmployeeSummaryTable({
  employeeDetails,
}: {
  employeeDetails: {
    id: number;
    documentId: string;
    name: string;
    order_discount_total: number;
    debt_shortage: number;
    fines_debits: number;
    salary_advanced: number;
    salary_advanced_status: string;
  }[];
}) {
  // Calculate totals
  const totals = employeeDetails.reduce(
    (acc, emp) => {
      acc.order_discount_total += emp.order_discount_total;
      acc.debt_shortage += emp.debt_shortage;
      acc.fines_debits += emp.fines_debits;
      acc.salary_advanced += emp.salary_advanced;
      return acc;
    },
    {
      order_discount_total: 0,
      debt_shortage: 0,
      fines_debits: 0,
      salary_advanced: 0,
    }
  );

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        {/* Optional Header or Description */}
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead>Name</TableHead>
            <TableHead>Discount Given</TableHead>
            <TableHead>Debt Shortage</TableHead>
            <TableHead>Fines & Debits</TableHead>
            <TableHead>Salary Advanced</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {employeeDetails.map((emp) => (
            <TableRow
              className="text-base font-medium text-dark dark:text-white"
              key={emp.documentId}
            >
              <TableCell className="pl-5 sm:pl-6 xl:pl-7.5">{emp.name}</TableCell>
              <TableCell>{formatPrice(emp.order_discount_total, "NGN")}</TableCell>
              <TableCell>{formatPrice(emp.debt_shortage, "NGN")}</TableCell>
              <TableCell>{formatPrice(emp.fines_debits, "NGN")}</TableCell>
              <TableCell>{formatPrice(emp.salary_advanced, "NGN")}</TableCell>
              <TableCell>{emp.salary_advanced_status}</TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow className="text-base font-medium text-dark dark:text-white">
            <TableCell className="text-right font-semibold">Total</TableCell>
            <TableCell>{formatPrice(totals.order_discount_total, "NGN")}</TableCell>
            <TableCell>{formatPrice(totals.debt_shortage, "NGN")}</TableCell>
            <TableCell>{formatPrice(totals.fines_debits, "NGN")}</TableCell>
            <TableCell>{formatPrice(totals.salary_advanced, "NGN")}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
