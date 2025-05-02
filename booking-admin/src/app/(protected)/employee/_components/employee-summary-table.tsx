import { Button } from "@/components/ui-elements/button";
import {
  Table,
  TableBody,
  TableCell,
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
    order_discount_total: number;
    debt_shortage: number;
    fines_debits: number;
    salary_advanced: number;
    salary_advanced_status: string;
    users_permissions_user: {
      username: string;
    };
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

  const username = employeeDetails[0]?.users_permissions_user.username


  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        {/* Optional Header or Description */}
        <h2 className="font-bold ">Employee Manager</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead>Name</TableHead>
            <TableHead>Orders Outstanding</TableHead>
            <TableHead>Debt Shortage</TableHead>
            <TableHead>Fines & Debits</TableHead>
            <TableHead>Salary Advanced</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
  {employeeDetails.map((emp) => (
    <TableRow
      className="text-base font-medium text-dark dark:text-white"
      key={emp.documentId}
    >
      <TableCell className="pl-5 sm:pl-6 xl:pl-7.5">
        {emp.users_permissions_user?.username}
      </TableCell>

      <TableCell>{formatPrice(emp.order_discount_total, "NGN")}</TableCell>
      <TableCell>{formatPrice(emp.debt_shortage, "NGN")}</TableCell>
      <TableCell>{formatPrice(emp.fines_debits, "NGN")}</TableCell>

      {/* Merged Salary Advanced + Status */}
      <TableCell>
        <div className="flex flex-col">
          <span>{formatPrice(emp.salary_advanced, "NGN")}</span>
          <span
            className={`mt-1 inline-block w-fit px-2 py-0.5 text-xs font-semibold rounded
              ${
                emp.salary_advanced_status === "approved"
                  ? "bg-green-100 text-green-700"
                  : emp.salary_advanced_status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : emp.salary_advanced_status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
              }
            `}
          >
            {emp.salary_advanced_status}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <Button
         label="View Details"
         variant={"outlinePrimary"}
         size={"small"}
         >
        </Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

      </Table>
    </div>
  );
}
