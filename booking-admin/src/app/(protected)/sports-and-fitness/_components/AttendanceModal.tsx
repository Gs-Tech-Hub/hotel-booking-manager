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

interface AttendanceLog {
  date: string;
  time: string;
}

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  attendance: AttendanceLog[];
  imageUrl: string;
  planExpiry: string; // ISO date string
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
  memberName,
  attendance: initialAttendance,
  imageUrl,
  planExpiry,
}) => {
  const [attendance, setAttendance] = useState(initialAttendance);

  const handleCheckIn = () => {
    const now = new Date();
    const expiry = new Date(planExpiry);
    if (now > expiry) {
      alert("Cannot check in: Membership plan has expired.");
      return;
    }
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    setAttendance([{ date, time }, ...attendance]);
  };

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
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((log, idx) => (
                <TableRow key={idx}>
                  <TableCell>{log.date}</TableCell>
                  <TableCell>{log.time}</TableCell>
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
