"use client";
/* eslint-disable */
import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/Spinner";
import { strapiService } from "@/utils/dataEndpoint";
import AddMembershipModal from "./AddMembershipModal";
import RenewMembershipModal from "./RenewMembershipModal";
import AttendanceModal from "./AttendanceModal";
import { processOrder } from "@/utils/processOrders/finalizeOrder";
import { useAuth } from "@/components/Auth/context/auth-context";
import { toast } from "react-toastify";

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
  // Use membershipPlans prop if provided, otherwise fallback to availablePlans
  const plansToUse = membershipPlans && membershipPlans.length > 0 ? membershipPlans : availablePlans;
  const [currentPlans, setCurrentPlans] = useState<any[]>(plansToUse);
    const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);


  const fetchMembers = async () => {
    setLoading(true);
    let data: any[] = [];
    let plans: any[] = [];
    if (dataType === 'gym') {
      const gymData = await strapiService.sportsAndFitnessEndpoints.getSportsAndFitnessList({
        "filters[name][$eq]":"Fitness",
        "populate[gym_memberships][populate]": "*",
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
            customer: membership.customer
          });
        });
        if (gym.membership_plans) {
          plans = gym.membership_plans;
        }
      });
    } else if (dataType === 'sports') {
      const sportsData = await strapiService.sportsAndFitnessEndpoints.getSportsAndFitnessList({
        "filters[name][$eq]":"Sports",
        "populate[sport_memberships][populate]": "*",
        "[membership_plans][populate]": "*",
        "[check_ins][populate]": "*"
      });
      sportsData.forEach((sport: any) => {
        (sport.sport_memberships || []).forEach((membership: any) => {
          data.push({
            ...membership,
            sportName: sport.name,
            sportId: sport.id,
            membership_plans: membership.membership_plans,
            check_ins: membership.check_ins,
            customer: membership.customer
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
  console.log("Members:", members);

  const handleAddMember = async (values: any) => {
    // Find the gym or sport id (use the first for now)
    const data = await strapiService.sportsAndFitnessEndpoints.getSportsAndFitnessList({
      "filters[name][$eq]": dataType === 'gym' ? "Fitness" : "Sports",
      "populate": "*",
      "[membership_plans][populate] ": "*",
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
      planPrice = foundPlan ? foundPlan.price : values.planPrice;
      paymentType = values.paymentMethod;
    } else {
      const allPlans = (data[0]?.membership_plans || []);
      foundPlan = allPlans.find((plan: any) => plan.id === membershipPlanId);
      planPrice = foundPlan ? foundPlan.price : values.planPrice;
      paymentType = values.paymentMethod;
    }
    // check for existing customer, if exist use id, else create
    const emailOrPhone = (values.email || values.phone).toString();
    let customer = await strapiService.customerEndpoints.findCustomerByPhoneOrEmail(emailOrPhone);
    let customerJustCreated = false;
    if (!customer) {
      customer = await strapiService.customerEndpoints.createCustomer({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone
      });
      customerJustCreated = true;
    }
    if (!customer?.id) throw new Error("Customer creation failed: missing id");
    // Prevent multiple membership registration (check both gym and sport memberships)
    let gymMemberships = await strapiService.gymMembershipsEndpoints.getGymMemberships({
      "filters[customer][id][$eq]": customer.id
    });
    let sportMemberships = await strapiService.sportMembershipsEndpoints.getSportMemberships({
      "filters[customer][id][$eq]": customer.id
    });
    if ((gymMemberships && gymMemberships.length > 0) || (sportMemberships && sportMemberships.length > 0)) {
      toast.error('Customer already has an active membership.');
      return;
    }
    if (customerJustCreated) {
      toast.success('Customer created successfully!');
    }
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
          name: dataType === 'gym' ? "Gym-Registration" : "Sport-Registration",
          price: planPrice,
          quantity: 1,
          department: dataType === 'gym' ? "gym_memberships" : "sport_memberships",
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
    "filters[name][$eq]": dataType === 'gym' ? "Fitness" : "Sports",
      "populate": "*",
      "[membership_plans][populate] ": "*",
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
      planPrice = foundPlan ? foundPlan.price : values.planPrice;
    } else {
      const allPlans = (data[0]?.membership_plans || []);
      foundPlan = allPlans.find((plan: any) => plan.id === membershipPlanId);
      planPrice = foundPlan ? foundPlan.price : values.planPrice;
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
          name: dataType === 'gym' ? "Gym-Renewal" : "Sport-Renewal",
          price: planPrice,
          quantity: 1,
          department: dataType === 'gym' ? "gym_memberships" : "sport_memberships",
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
   const filteredItems = useMemo(() => {
      if (!members) return [];
      let filtered = members.filter((item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customer?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customer?.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (sortConfig) {
        filtered = [...filtered].sort((a, b) => {
          let aValue = a;
          let bValue = b;
          // Support nested fields for customer
          if (sortConfig.key.startsWith('customer.')) {
            const field = sortConfig.key.split('.')[1];
            aValue = a.customer?.[field] || '';
            bValue = b.customer?.[field] || '';
          } else if (sortConfig.key === 'plan') {
            aValue = a.membership_plans?.[0]?.name || '';
            bValue = b.membership_plans?.[0]?.name || '';
          } else {
            aValue = a[sortConfig.key] || '';
            bValue = b[sortConfig.key] || '';
          }
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }
          if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        });
      }
      return filtered;
    }, [members, searchTerm, sortConfig]);

    const handleSort = (key: string) => {
      setSortConfig((prev) => {
        if (prev && prev.key === key) {
          return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
        }
        return { key, direction: 'asc' };
      });
    };

  if (loading) return <Spinner />;

  return (
    <div className="rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 w-48"
        />
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          {title}
        </h2>
        <button
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          onClick={async () => {
            let plans = plansToUse;
            const data = await strapiService.sportsAndFitnessEndpoints.getSportsAndFitnessList({
              "filters[name][$eq]": dataType === 'gym' ? "Fitness" : "Sports",
              "populate": "*",
              "[membership_plans][populate]": "*",
            });
            plans = data[0]?.membership_plans || [];
            setCurrentPlans(plans);
            setShowAddModal(true);
          }}
        >
          + Create New Membership
        </button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort('customer.firstName')}>
              Name {sortConfig?.key === 'customer.firstName' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('customer.email')}>
              Email {sortConfig?.key === 'customer.email' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('customer.phone')}>
              Phone {sortConfig?.key === 'customer.phone' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('plan')}>
              Plan {sortConfig?.key === 'plan' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('joined_date')}>
              Registration Date {sortConfig?.key === 'joined_date' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('joined_date')}>
              Start {sortConfig?.key === 'joined_date' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('expiry_date')}>
              End {sortConfig?.key === 'expiry_date' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </TableHead>
            <TableHead>Attendance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.map((member) => (
            <TableRow
              key={member.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={async () => {
                let plans = plansToUse;
                const data = await strapiService.sportsAndFitnessEndpoints.getSportsAndFitnessList({
                  "filters[name][$eq]": dataType === 'gym' ? "Fitness" : "Sports",
                  "populate": "*",
                  "[membership_plans][populate]": "*",
                });
                plans = data[0]?.membership_plans || [];
                setCurrentPlans(plans);
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
        membershipPlans={currentPlans}
      />
      {renewMember && (
        <RenewMembershipModal
          isOpen={showRenewModal}
          onClose={() => setShowRenewModal(false)}
          onRenew={handleRenewMember}
          initialValues={renewMember}
          membershipPlans={currentPlans}
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
          dataType={dataType} // Pass dataType here
        />
      )}
    </div>
  );
}
