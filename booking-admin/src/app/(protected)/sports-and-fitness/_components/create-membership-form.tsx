import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui-elements/input';
import { Button } from '@/components/ui-elements/button';
import { Select } from '@/components/ui-elements/select';
import { strapiService } from '@/utils/dataEndpoint/index';
import type { PaymentMethod } from '@/types/order';

export interface MembershipFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  membershipType: string;
  planPrice?: number;
  startDate: string;
  endDate: string;
  paymentMethod: PaymentMethod;
}

interface MembershipFormProps {
  initialValues?: Partial<MembershipFormValues>;
  onSubmit: (values: MembershipFormValues) => void;
  submitLabel?: string;
}

export const MembershipForm: React.FC<MembershipFormProps> = ({ initialValues = {}, onSubmit, submitLabel = 'Submit' }) => {
  // If initialValues is a gym membership object, map to MembershipFormValues
  const mapInitialValues = (vals: any): MembershipFormValues => {
    // If already in MembershipFormValues shape, return as is
    if (typeof vals.startDate !== 'undefined' && typeof vals.endDate !== 'undefined') return vals as MembershipFormValues;
    // Map from gym membership object
    const expired = vals.expiry_date && new Date(vals.expiry_date) < new Date();
    let planPrice: number | undefined = undefined;
    if (vals.membership_plan && typeof vals.membership_plan.price === 'number') {
      planPrice = vals.membership_plan.price;
    }
    // Ensure paymentMethod is a PaymentMethod object
    let paymentMethod: PaymentMethod = { type: 'cash', id: 2, documentId: 'aio64xyuu59t961xxvlkasbf' };
    if (vals.paymentMethod && typeof vals.paymentMethod === 'object' && vals.paymentMethod.type) {
      paymentMethod = vals.paymentMethod;
    } else if (typeof vals.paymentMethod === 'string' && vals.paymentMethod) {
      paymentMethod = { type: vals.paymentMethod, id: 0, documentId: '' };
    }
    return {
      firstName: vals.customer?.firstName || vals.firstName || '',
      lastName: vals.customer?.lastName || vals.lastName || '',
      email: vals.customer?.email || vals.email || '',
      phone: vals.customer?.phone || vals.phone || '',
      membershipType: vals.membership_plan?.id?.toString() || vals.membershipType || '',
      startDate: expired
        ? new Date().toISOString().slice(0, 10)
        : vals.expiry_date || '',
      endDate: '',
      paymentMethod,
      planPrice
    };
  };

  const [form, setForm] = useState<MembershipFormValues>(mapInitialValues(initialValues));

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
      const plan = membershipPlans.find((p) => p.id.toString() === form.membershipType);
      setSelectedPlan(plan || null);
      // Always update planPrice in form when plan changes
      setForm((prev) => ({ ...prev, planPrice: plan ? plan.price : undefined }));
    } else {
      setSelectedPlan(null);
      setForm((prev) => ({ ...prev, planPrice: undefined }));
    }
  }, [form.membershipType, membershipPlans]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'paymentMethod') {
      setForm((prev) => ({ ...prev, paymentMethod: { ...prev.paymentMethod, type: value as PaymentMethod['type'] } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  // For date pickers, you may want to use a custom handler or a controlled component
  const handleDateChange = (name: 'startDate' | 'endDate', value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If initialValues has an id, call update instead of create
    if (initialValues && (initialValues as any).id) {
      // Include id in the form values
      onSubmit({ ...form, id: (initialValues as any).id } as MembershipFormValues);
    } else {
      onSubmit(form);
    }
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
        onChange={(val) => {
          const selected = membershipPlans.find((plan) => plan.id.toString() === val);
          setForm((prev) => ({
            ...prev,
            membershipType: val as string,
            planPrice: selected ? selected.price : undefined
          }));
        }}
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
              value={form.paymentMethod.type}
              onChange={(e) => setForm((prev) => 
                ({ ...prev, 
                  paymentMethod: { ...prev.paymentMethod, type: e.target.value as PaymentMethod['type'] } }))}
              className="w-full appearance-none rounded-lg border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary mb-4"
            >
              <option value="">Select Payment Method</option>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="card">Debit Card</option>
            </select>
      <Button label={submitLabel}
       />
    </form>
  );
};
