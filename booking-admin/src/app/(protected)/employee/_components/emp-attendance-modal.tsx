import React, { useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui-elements/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui-elements/button";
import { checkInEndpoints } from "@/utils/dataEndpoint/checkIn";

interface AttendanceLog {
  id: number;
  check_in_time: string;
  check_out_time?: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface EmployeeAttendanceModalProps {
  onClose: () => void;
  employeeId: number;
  employeeName: string;
  attendance: AttendanceLog[];
  imageUrl?: string;
}

const EmployeeAttendanceModal: React.FC<EmployeeAttendanceModalProps> = ({
  onClose,
  employeeName,
  attendance: initialAttendance,
  imageUrl,
  employeeId,
}) => {
  const [attendance, setAttendance] = useState(initialAttendance);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const checkInData = {
        employee_summary: employeeId, // assuming relation field is 'employee'
        check_in_time: now.toISOString(),
      };
      const newLog = await checkInEndpoints.createCheckIn(checkInData);
      setAttendance([newLog, ...attendance]);
    } catch (err: any) {
      setError(err.message || "Check-in failed");
    } finally {
      setLoading(false);
    }
  };

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
        onClose={onClose}
        title={`Attendance History for ${employeeName}`}
        content={
          <div>
            {imageUrl && (
              <div className="flex flex-col items-center mb-4">
                <Image
                  src={imageUrl}
                  alt={employeeName + " photo"}
                  width={120}
                  height={120}
                  className="border mb-2"
                />
              </div>
            )}
            {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance && attendance.length > 0 ? (
                  attendance.map((log, idx) => (
                    <TableRow key={log.id || idx}>
                      <TableCell>
                        {log.check_in_time
                          ? new Date(log.check_in_time).toLocaleDateString()
                          : ""}
                      </TableCell>
                      <TableCell>
                        {log.check_in_time
                          ? new Date(log.check_in_time).toLocaleTimeString()
                          : ""}
                      </TableCell>
                      <TableCell>
                        {log.check_out_time
                          ? new Date(log.check_out_time).toLocaleTimeString()
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-400">
                      No attendance records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        }
        footer={
          <div className="flex justify-between items-center">
            <button
              className="mt-3 text-xs text-red-500 underline"
              onClick={setIsOpen.bind(null, false)}
              disabled={loading}
            >
              Close
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
              onClick={handleCheckIn}
              disabled={loading}
            >
              {loading ? "Checking In..." : "Check In"}
            </button>
          </div>
        }
      />
    </div>
  );
};

export default EmployeeAttendanceModal;
