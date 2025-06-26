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
  onAttendanceUpdate?: (newAttendance: AttendanceLog[]) => void;
}

const EmployeeAttendanceModal: React.FC<EmployeeAttendanceModalProps> = ({
  onClose,
  employeeName,
  attendance: initialAttendance,
  imageUrl,
  employeeId,
  onAttendanceUpdate,
}) => {
  const [attendance, setAttendance] = useState(initialAttendance);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper: Check if already checked in today
  const hasCheckedInToday = attendance.some((log) => {
    if (!log.check_in_time) return false;
    const checkInDate = new Date(log.check_in_time);
    const now = new Date();
    return (
      checkInDate.getFullYear() === now.getFullYear() &&
      checkInDate.getMonth() === now.getMonth() &&
      checkInDate.getDate() === now.getDate()
    );
  });

  // Helper: Get today's check-in(s)
  const today = new Date();
  const todayCheckIns = attendance.filter((log) => {
    if (!log.check_in_time) return false;
    const checkInDate = new Date(log.check_in_time);
    return (
      checkInDate.getFullYear() === today.getFullYear() &&
      checkInDate.getMonth() === today.getMonth() &&
      checkInDate.getDate() === today.getDate()
    );
  });

  // Helper: Count check-ins for the current month
  const monthlyCheckInCount = attendance.filter((log) => {
    if (!log.check_in_time) return false;
    const checkInDate = new Date(log.check_in_time);
    return (
      checkInDate.getFullYear() === today.getFullYear() &&
      checkInDate.getMonth() === today.getMonth()
    );
  }).length;

  const handleCheckIn = async () => {
    if (hasCheckedInToday) {
      setError("Already checked in today.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const checkInData = {
        employee_summary: employeeId, // assuming relation field is 'employee'
        check_in_time: now.toISOString(),
      };
      const newLog = await checkInEndpoints.createCheckIn(checkInData);
      const updatedAttendance = [newLog, ...attendance];
      setAttendance(updatedAttendance);
      if (onAttendanceUpdate) onAttendanceUpdate(updatedAttendance);
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
        onClose={() => { setIsOpen(false); onClose(); }}
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
            {/* Monthly summary */}
            <div className="mb-2 text-lg text-gray-500">
              Check-ins this month:{" "}
              <span className="font-bold">{monthlyCheckInCount}</span>
            </div>
            {/* Only today's check-ins */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayCheckIns.length > 0 ? (
                  todayCheckIns.map((log, idx) => (
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
                      No check-in for today.
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
              disabled={loading || hasCheckedInToday}
            >
              {loading ? "Checking In..." : hasCheckedInToday ? "Checked In" : "Check In"}
            </button>
          </div>
        }
      />
    </div>
  );
};

export default EmployeeAttendanceModal;
