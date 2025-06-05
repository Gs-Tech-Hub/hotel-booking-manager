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
import { strapiService } from "@/utils/dataEndpoint/index";
import AddMembershipModal from "./AddMembershipModal";
import RenewMembershipModal from "./RenewMembershipModal";
import AttendanceModal from "./AttendanceModal";
import { processOrder } from "@/utils/processOrders/finalizeOrder";
import { useAuth } from "@/components/Auth/context/auth-context";

interface GymMembershipTableProps {
  dataType: 'gym' | 'sports';
  title?: string;
  membershipPlans?: any[]; // Add this prop for plans
}

export default function GymMembershipTable({ dataType = 'gym', title = 'Memberships', membershipPlans = [] }: GymMembershipTableProps) {
  const { user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewMember, setRenewMember] = useState<any | null>(null);
  const [attendanceMember, setAttendanceMember] = useState<any | null>(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);

  const fetchMembers = async () => {
    setLoading(true);
    let data: any[] = [];
    let plans: any[] = [];
    if (dataType === 'gym') {
      const gymData = await strapiService.sportsAndFitnessEndpoints.getSportsAndFitnessList({
        "filters[name][$eq]":"Fitness",
        "populate": "*",
        "[gym_memberships][populate]": "*",
        "[membership_plans][populate]": "*",
        "[check_ins][populate]": "*"
      });
      gymData.forEach((gym: any) => {
        (gym.gym_memberships || []).forEach((membership: any) => {
          data.push({
            ...membership,
            gymName: gym.name,
            gymId: gym.id,
            membership_plans: membership.membership_plans,
            check_ins: membership.check_ins,
            customer: membership.customer,
            membership_plan: (gym.membership_plans || []).find((plan: any) => plan.id === membership.membership_plan) || membership.membership_plan,
          });
        });
        if (gym.membership_plans) {
          plans = gym.membership_plans;
        }
      });
    } else if (dataType === 'sports') {
      const sportsData = await strapiService.sportsAndFitnessEndpoints.getSportsAndFitnessList({
        "filters[name][$eq]":"Sports",
        "populate": "*",
        "[sport_membership][populate]": "*",
        "[membership_plans][populate]": "*",
        "[check_ins][populate]": "*"
      });
      sportsData.forEach((sport: any) => {
        (sport.sports_memberships || []).forEach((membership: any) => {
          data.push({
            ...membership,
            sportName: sport.name,
            sportId: sport.id,
            membership_plans: membership.membership_plans,
            check_ins: membership.check_ins,
            customer: membership.customer,
            membership_plan: (sport.membership_plans || []).find((plan: any) => plan.id === membership.membership_plan) || membership.membership_plan,
          });
        });
        if (sport.membership_plans) {
          plans = sport.membership_plans;
        }
      });
    }
    setMembers(data);
    setAvailablePlans(plans);
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, [dataType]);

  const handleAddMember = async (values: any) => {
    // Find the gym or sport id (use the first for now)
    const data = await strapiService.sportsAndFitnessEndpoints.getSportsAndFitnessList({
      populate: "*",
      "filters[name][$eq]": dataType === 'gym' ? "Fitness" : "Sports"
    });
    const entityId = data[0]?.id;
    // Find the correct membership plan by id or name
    let membershipPlanId = values.membershipType;
    let planPrice = 0;
    let foundPlan: any = undefined;
    let paymentType = null;
    if (typeof membershipPlanId !== 'number') {
      const allPlans = (data[0]?.membership_plans || []);
      foundPlan = allPlans.find((plan: any) => plan.name === values.membershipType || plan.id === values.membershipType);
      membershipPlanId = foundPlan ? foundPlan.id : values.membershipType;
      planPrice = values.planPrice;
      paymentType = values.paymentMethod;
    } else {
      const allPlans = (data[0]?.membership_plans || []);
      foundPlan = allPlans.find((plan: any) => plan.id === membershipPlanId);
      planPrice = values.planPrice;
      paymentType = values.paymentMethod;
    }
    const customer = await strapiService.customerEndpoints.createCustomer({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone
    });
    if (!customer?.id) throw new Error("Customer creation failed: missing id");
    let membership;
    if (dataType === 'gym') {
      membership = await strapiService.gymMembershipsEndpoints.createGymMembership({
        customer: customer.id,
        joined_date: values.startDate,
        expiry_date: values.endDate,
        membership_plans: membershipPlanId,
        gym_and_sports: { connect: (entityId).toString() }
      });
    } else {
      membership = await strapiService.sportMembershipsEndpoints.createSportMembership({
        customer: customer.id,
        joined_date: values.startDate,
        expiry_date: values.endDate,
        membership_plans: membershipPlanId,
        gym_and_sports: { connect: (entityId).toString() }
      });
    }
    const waiterId = user && user.id ? user.id : '';
    await processOrder({
      order: {
        id: membership.id.toString(),
        totalAmount: planPrice,
        waiterId,
        items: [{
          id: membership.id,
          name: ` New Membership - ${values.firstName} ${values.lastName}`,
          price: planPrice,
          quantity: 1,
          department: dataType === 'gym' ? "gym_memberships" : "sports_memberships",
          documentId: membership.id.toString(),
          count: 1,
          amount_paid: planPrice,
          amount_owed: 0,
          game_status: "completed"
        }],
        status: "completed"
      },
      paymentMethod: values.paymentMethod,
      waiterId,
      customerId: customer.id,
    });
    fetchMembers();
  };

  const handleRenewMember = async (values: any) => {
    // Update gym membership instead of create
    if (!renewMember?.id) return;
    const data = await strapiService.sportsAndFitnessEndpoints.getSportsAndFitnessList({
      populate: "*",
      "filters[name][$eq]": dataType === 'gym' ? "Fitness" : "Sports"
    });
    const entityId = data[0]?.id;
    // Find the correct membership plan by id or name
    let membershipPlanId = values.membershipType;
    let planPrice = 0;
    let foundPlan: any = undefined;
    let paymentType = null;
    if (typeof membershipPlanId !== 'number') {
      const allPlans = (data[0]?.membership_plans || []);
      foundPlan = allPlans.find((plan: any) => plan.name === values.membershipType || plan.id === values.membershipType);
      membershipPlanId = foundPlan ? foundPlan.id : values.membershipType;
      planPrice = values.planPrice;
    } else {
      const allPlans = (data[0]?.membership_plans || []);
      foundPlan = allPlans.find((plan: any) => plan.id === membershipPlanId);
      planPrice = values.planPrice;
      paymentType = values.paymentMethod;
    }
    let renewedMembership;
    if (dataType === 'gym') {
      renewedMembership = await strapiService.gymMembershipsEndpoints.updateGymMembership(
        renewMember.documentId,
        {
          joined_date: values.startDate,
          expiry_date: values.endDate,
          membership_plans: { connect: { id: membershipPlanId } },
          gym_and_sports: { connect: (entityId).toString() },
        }
      );
    } else {
      renewedMembership = await strapiService.sportMembershipsEndpoints.updateSportMembership(
        renewMember.documentId,
        {
          joined_date: values.startDate,
          expiry_date: values.endDate,
          membership_plans: { connect: { id: membershipPlanId } },
          gym_and_sports: { connect: (entityId).toString() },
        }
      );
    }
    const customer = renewMember.customer || {};
    const waiterId = user && user.id ? user.id : '';
    await processOrder({
      order: {
        id: renewedMembership.id.toString(),
        totalAmount: planPrice,
        waiterId,
        items: [{
          id: renewedMembership.id,
          name: `Renew Membership - ${values.firstName} ${values.lastName}`,
          price: planPrice,
          quantity: 1,
          department: dataType === 'gym' ? "gym_memberships" : "sports_memberships",
          documentId: renewMember.documentId,
          count: 1,
          amount_paid: planPrice,
          amount_owed: 0,
          game_status: "completed"
        }],
        status: "completed"
      },
      waiterId,
      customerId: customer.id,
      paymentMethod: values.paymentMethod,
    });
    fetchMembers();
  };

  if (loading) return <Spinner />;

  return (
    <div className="rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          {title}
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
              <TableCell>{member.customer?.firstName || member.customer?.name} {member.customer?.lastName || ''}</TableCell>
              <TableCell>{member.customer?.email}</TableCell>
              <TableCell>{member.customer?.phone}</TableCell>
              {/* Membership Plan Name: fallback to member.membership_plans[0]?.name, or 'N/A' if not present */}
              <TableCell>{member.membership_plans?.[0]?.name || 'N/A'}</TableCell>
              <TableCell>{member.joined_date}</TableCell>
              <TableCell>{member.joined_date}</TableCell>
              <TableCell>
                <span
                  className={
                    new Date(member.expiry_date) < new Date()
                      ? 'text-red-600 font-bold'
                      : ''
                  }
                >
                  {member.expiry_date}
                  {new Date(member.expiry_date) < new Date() && ' (Expired)'}
                </span>
              </TableCell>
              <TableCell>
                {member.check_ins?.length || 0} check-ins
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
        membershipPlans={availablePlans}
      />
      {renewMember && (
        <RenewMembershipModal
          isOpen={showRenewModal}
          onClose={() => setShowRenewModal(false)}
          onRenew={handleRenewMember}
          initialValues={renewMember}
          membershipPlans={availablePlans}
        />
      )}
      {attendanceMember && (
        <AttendanceModal
          isOpen={showAttendanceModal}
          onClose={() => {
            setShowAttendanceModal(false);
            setAttendanceMember(null);
          }}
          memberId={attendanceMember.id}
          memberName={attendanceMember.customer?.firstName + ' ' + attendanceMember.customer?.lastName}
          attendance={attendanceMember.check_ins}
          imageUrl={attendanceMember.profile_photo?.formats?.medium?.url || '/default-avatar.png'}
          planExpiry={attendanceMember.expiry_date}
        />
      )}
    </div>
  );
}
