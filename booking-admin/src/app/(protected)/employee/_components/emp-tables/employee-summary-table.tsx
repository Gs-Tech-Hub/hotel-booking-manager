import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/utils/priceHandler";
import EmployeeAttendanceModal from "../emp-attendance-modal";

// Employment Data Table
export function EmployeeEmploymentTable({
  employeeDetails,
  onAttendanceUpdate,
}: {
  employeeDetails: {
    id: number;
    documentId: string;
    employmentDate: Date;
    position: string;
    salary: string;
    users_permissions_user: {
      username: string;
      documentId: string;
      id?: number;
    };
    check_ins?: any[];
  }[];
  onAttendanceUpdate?: (employeeId: number, newAttendance: any[]) => void;
}) {
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card mb-6">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="font-bold">Employee Employment Data</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead>Name</TableHead>
            <TableHead>Employment Date</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employeeDetails.map((emp) => {
            // Map attendance from check_ins array
            const attendance = (emp.check_ins || []).map((log: any) => ({
              id: log.id,
              check_in_time: log.check_in_time,
              check_out_time: log.check_out_time,
              createdAt: log.createdAt,
              updatedAt: log.updatedAt,
              publishedAt: log.publishedAt,
            }));
            // Get latest check-in (if any)
            const latestCheckIn = attendance.length > 0 ? attendance[0] : null;
            return (
              <TableRow
                className="text-base font-medium text-dark dark:text-white"
                key={emp.id}
              >
                <TableCell className="pl-5 sm:pl-6 xl:pl-7.5">
                  {emp.users_permissions_user?.username}
                </TableCell>
                <TableCell>
                  {emp.employmentDate ? new Date(emp.employmentDate).toLocaleDateString() : null}
                </TableCell>
                <TableCell>{emp.position}</TableCell>
                <TableCell>{formatPrice(Number(emp.salary), "NGN")}</TableCell>
                <TableCell>
                  {/* Show latest check-in status */}
                  {latestCheckIn ? (
                    <span className="text-xs text-green-600">Resumed At: {new Date(latestCheckIn.check_in_time).toLocaleTimeString()}</span>
                  ) : (
                    <span className="text-xs text-gray-400">No check-in</span>
                  )}
                  <EmployeeAttendanceModal
                    onClose={() => {}}
                    employeeId={emp.id}
                    employeeName={emp.users_permissions_user?.username || ""}
                    attendance={attendance}
                    onAttendanceUpdate={(newAttendance) => onAttendanceUpdate && onAttendanceUpdate(emp.id, newAttendance)}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

// Financial Data Table
export function EmployeeFinancialTable({
  employeeDetails,
}: {
  employeeDetails: {
    id: number;
    documentId: string;
    order_discount_total: number;
    debt_shortage: number;
    fines_debits: number;
    salary_advanced: number;
    salary_advanced_status: "approved" | "pending" | "rejected" | undefined;
    users_permissions_user: {
      username: string;
      documentId: string;
      id?: number;
    };
  }[];
}) {
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="font-bold">Employee Financial Data</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead>Name</TableHead>
            <TableHead>Orders Outstanding</TableHead>
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
              key={emp.id}
            >
              <TableCell>
                {emp.users_permissions_user?.username}
              </TableCell>
              <TableCell>{formatPrice(emp.order_discount_total, "NGN")}</TableCell>
              <TableCell>{formatPrice(emp.debt_shortage, "NGN")}</TableCell>
              <TableCell>{formatPrice(emp.fines_debits, "NGN")}</TableCell>
              <TableCell>{formatPrice(emp.salary_advanced, "NGN")}</TableCell>
              <TableCell>
                <span
                  className={`inline-block w-fit px-2 py-0.5 text-xs font-semibold rounded
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
