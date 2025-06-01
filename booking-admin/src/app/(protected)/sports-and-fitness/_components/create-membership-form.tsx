import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui-elements/input';
import { Button } from '@/components/ui-elements/button';
import { Select } from '@/components/ui-elements/select';
import { strapiService } from '@/utils/dataEndpoint/index';

export interface MembershipFormValues {
  name: string;
  email: string;
  phone: string;
  membershipType: string;
  startDate: string;
  endDate: string;
  paymentInfo: string;
}

interface MembershipFormProps {
  initialValues?: Partial<MembershipFormValues>;
  onSubmit: (values: MembershipFormValues) => void;
  submitLabel?: string;
}

export const MembershipForm: React.FC<MembershipFormProps> = ({ initialValues = {}, onSubmit, submitLabel = 'Submit' }) => {
  const [form, setForm] = useState<MembershipFormValues>({
    name: initialValues.name || '',
    email: initialValues.email || '',
    phone: initialValues.phone || '',
    membershipType: initialValues.membershipType || '',
    startDate: initialValues.startDate || '',
    endDate: initialValues.endDate || '',
    paymentInfo: initialValues.paymentInfo || '',
  });

  const [membershipTypes, setMembershipTypes] = useState<{ value: string; label: string }[]>([]);
  const [membershipPlans, setMembershipPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);

  useEffect(() => {
    async function fetchMembershipTypes() {
      const plans = await strapiService.membershipPlansEndpoints.getMembershipPlans();
      if (Array.isArray(plans)) {
        setMembershipPlans(plans);
        setMembershipTypes(
          plans.map((plan: any) => ({ value: plan.name, label: plan.name }))
        );
      }
    }
    fetchMembershipTypes();
  }, []);

  useEffect(() => {
    if (form.membershipType && membershipPlans.length > 0) {
      const plan = membershipPlans.find((p) => p.name === form.membershipType);
      setSelectedPlan(plan || null);
    } else {
      setSelectedPlan(null);
    }
  }, [form.membershipType, membershipPlans]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // For date pickers, you may want to use a custom handler or a controlled component
  const handleDateChange = (name: 'startDate' | 'endDate', value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="firstName"
        placeholder="First Name"
        value={form.name}
        onChange={handleChange}
        required
      />

       <Input
        name="lastName"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <Input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <Input
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        required
      />
      <Select
        value={form.membershipType}
        onChange={(val) => setForm((prev) => ({ ...prev, membershipType: val as string }))}
        items={membershipTypes}
        placeholder="Select Membership Type"
      />
      {selectedPlan && (
        <div className="text-sm text-gray-600 mb-2">
          Price: <span className="font-semibold">₦{selectedPlan.price.toLocaleString()}</span>
        </div>
      )}
      {/* Replace DatePickerOne with your actual date picker and wire up value/onChange */}
      <div>
        <label className="block text-sm font-medium mb-1">Start Date</label>
        <Input
          name="startDate"
          type="date"
          value={form.startDate}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">End Date</label>
        <Input
          name="endDate"
          type="date"
          value={form.endDate}
          onChange={handleChange}
          required
        />
      </div>
      <Input
        name="paymentInfo"
        placeholder="Payment Info"
        value={form.paymentInfo}
        onChange={handleChange}
        required
      />
      <Button label={submitLabel}
       />
    </form>
  );
};
