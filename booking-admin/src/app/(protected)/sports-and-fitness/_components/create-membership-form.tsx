import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui-elements/input';
import { Button } from '@/components/ui-elements/button';
import { Select } from '@/components/ui-elements/select';
import { strapiService } from '@/utils/dataEndpoint/index';

export interface MembershipFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  membershipType: string;
  startDate: string;
  endDate: string;
  paymentMethod: string;
}

interface MembershipFormProps {
  initialValues?: Partial<MembershipFormValues>;
  onSubmit: (values: MembershipFormValues) => void;
  submitLabel?: string;
}

export const MembershipForm: React.FC<MembershipFormProps> = ({ initialValues = {}, onSubmit, submitLabel = 'Submit' }) => {
  const [form, setForm] = useState<MembershipFormValues>({
    firstName: initialValues.firstName || '',
    lastName: initialValues.lastName || "",
    email: initialValues.email || '',
    phone: initialValues.phone || '',
    membershipType: initialValues.membershipType || '',
    startDate: initialValues.startDate || '',
    endDate: initialValues.endDate || '',
    paymentMethod: initialValues.paymentMethod || '',
  });

  const [membershipTypes, setMembershipTypes] = useState<{ value: string; label: string }[]>([]);
  const [membershipPlans, setMembershipPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);

  useEffect(() => {
    async function fetchMembershipTypes() {
      const plans = await strapiService.membershipPlansEndpoints.getMembershipPlans();
      console.log('plans:', plans);
      if (Array.isArray(plans)) {
        setMembershipPlans(plans);
        setMembershipTypes(
          plans.map((plan: any) => ({ value: plan.id, label: plan.name }))
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
      <div className="flex">
        <Input
        name="firstName"
        placeholder="First Name"
        value={form.firstName}
        onChange={handleChange}
        required
      />

       <Input
        name="lastName"
        placeholder="Last Name"
        value={form.lastName}
        onChange={handleChange}
        required
      />
      </div>
      
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
      <div className="flex justify-between">
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
      </div>
     
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
        <label htmlFor="payment-method" className="block text-body-sm font-medium text-dark dark:text-white">
              Payment Method
            </label>
            <select
              id="payment-method"
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              className="w-full appearance-none rounded-lg border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary mb-4"
            >
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="card">Debit Card</option>
            </select>
      <Button label={submitLabel}
       />
    </form>
  );
};
