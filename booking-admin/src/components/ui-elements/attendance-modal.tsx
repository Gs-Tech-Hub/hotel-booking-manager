import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Modal } from "@/components/ui-elements/modal";

interface AttendanceLog {
  date: string;
  time: string;
}

interface Member {
  full_name: string;
  attendance: AttendanceLog[];
}

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
}

export function AttendanceModal({ isOpen, onClose, member }: AttendanceModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={member ? `Attendance Log for ${member.full_name}` : "Attendance Log"}
      content={
        member ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {member.attendance.map((log, idx) => (
                <TableRow key={idx}>
                  <TableCell>{log.date}</TableCell>
                  <TableCell>{log.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div>No attendance data available.</div>
        )
      }
      footer={
        <button className="text-xs text-red-500 underline" onClick={onClose}>
          Close
        </button>
      }
    />
  );
}
