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
import { strapiService } from "@/utils/dataEndpoint/index";

interface AttendanceLog {
  id: number;
  check_in_time: string;
  check_out_time?: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: number;
  memberName: string;
  attendance: AttendanceLog[];
  imageUrl: string;
  planExpiry: string; // ISO date string
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
  memberId,
  memberName,
  attendance: initialAttendance,
  imageUrl,
  planExpiry,
}) => {
  const [attendance, setAttendance] = useState(initialAttendance);
  console.log("attendance logs:", attendance);

  const handleCheckIn = () => {
    const now = new Date();
    const expiry = new Date(planExpiry);
    if (now > expiry) {
      alert("Cannot check in: Membership plan has expired.");
      return;
    }
    // Prevent multiple check-ins for the same day if there is an active check-in (no check_out_time)
    const today = now.toLocaleDateString();
    const hasActiveCheckInToday = attendance.some(
      (log) =>
        !log.check_out_time &&
        new Date(log.check_in_time).toLocaleDateString() === today
    );
    if (hasActiveCheckInToday) {
      alert("You already have an active check-in for today. Please check out before checking in again.");
      return;
    }
    // Prepare payload for API: only gym_membership and check_in_time
    const data = {
      check_in_time: now.toISOString(),
      gym_membership: memberId
    };
    strapiService.checkInEndpoints.createCheckIn(data);
    // Optionally update local state for immediate UI feedback
    const newLog: AttendanceLog = {
      id: Date.now(), // temp id
      check_in_time: data.check_in_time,
      check_out_time: null,
      createdAt: data.check_in_time,
      updatedAt: data.check_in_time,
      publishedAt: data.check_in_time,
    };
    setAttendance([newLog, ...attendance]);
  };

  const getActiveCheckIns = (logs: AttendanceLog[]) => {
    return logs.filter((log) => !log.check_out_time);
  };

  // Example usage inside the component:
  const activeCheckIns = getActiveCheckIns(attendance);
  // You can use activeCheckIns as needed, e.g., display a badge or message

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Attendance Log for ${memberName}`}
      content={
        <div>
          <div className="flex flex-col items-center mb-4">
            <Image
              src={imageUrl}
              alt={memberName + " photo"}
              width={120}
              height={120}
              className="border mb-2"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((log, idx) => (
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
              ))}
            </TableBody>
          </Table>
        </div>
      }
      footer={
        <div className="flex justify-between items-center">
          <button
            className="mt-3 text-xs text-red-500 underline"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
            onClick={handleCheckIn}
          >
            Check In
          </button>
        </div>
      }
    />
  );
};

export default AttendanceModal;
