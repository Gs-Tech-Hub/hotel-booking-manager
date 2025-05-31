"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/Spinner";
import { getGymMembers } from "@/components/Tables/gym-members";
import AddMembershipModal from "./AddMembershipModal";
import RenewMembershipModal from "./RenewMembershipModal";
import AttendanceModal from "./AttendanceModal";

export default function GymMembershipTable() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewMember, setRenewMember] = useState<any | null>(null);
  const [attendanceMember, setAttendanceMember] = useState<any | null>(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  const fetchMembers = () => {
    setLoading(true);
    getGymMembers().then((data) => {
      setMembers(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async (values: any) => {
    // TODO: Call API to add member
    // await addGymMember(values);
    fetchMembers();
  };

  const handleRenewMember = async (values: any) => {
    // TODO: Call API to renew member
    // await renewGymMember(renewMember.id, values);
    fetchMembers();
  };

  if (loading) return <Spinner />;

  return (
    <div className="rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Gym Memberships
        </h2>
        <button
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          onClick={() => setShowAddModal(true)}
        >
          + Create New Membership
        </button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Registration Date</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>End</TableHead>
            <TableHead>Attendance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow
              key={member.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => {
                setRenewMember(member);
                setShowRenewModal(true);
              }}
            >
              <TableCell>{member.full_name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.phone}</TableCell>
              <TableCell>{member.membership_plan}</TableCell>
              <TableCell>{member.registration_date}</TableCell>
              <TableCell>{member.start_date}</TableCell>
              <TableCell>{member.end_date}</TableCell>
              <TableCell>
                {member.attendance.length} check-ins
                <button
                  className="ml-2 text-xs text-primary underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAttendanceMember(member);
                    setShowAttendanceModal(true);
                  }}
                >
                  View
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AddMembershipModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddMember}
      />
      {renewMember && (
        <RenewMembershipModal
          isOpen={showRenewModal}
          onClose={() => setShowRenewModal(false)}
          onRenew={handleRenewMember}
          initialValues={renewMember}
        />
      )}
      {attendanceMember && (
        <AttendanceModal
          isOpen={showAttendanceModal}
          onClose={() => {
            setShowAttendanceModal(false);
            setAttendanceMember(null);
          }}
          memberName={attendanceMember.full_name}
          attendance={attendanceMember.attendance}
          imageUrl={attendanceMember.image_url || '/default-avatar.png'}
          planExpiry={attendanceMember.end_date}
        />
      )}
    </div>
  );
}
