import React, { useState } from 'react';
// Import your internal UI components
import { Input, Button, Select, DatePicker } from '../ui-elements';

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

const MEMBERSHIP_TYPES = [
  { value: 'basic', label: 'Basic' },
  { value: 'premium', label: 'Premium' },
  { value: 'vip', label: 'VIP' },
];

export const MembershipForm: React.FC<MembershipFormProps> = ({ initialValues = {}, onSubmit, submitLabel = 'Submit' }) => {
  const [form, setForm] = useState<MembershipFormValues>({
    name: initialValues.name || '',
    email: initialValues.email || '',
    phone: initialValues.phone || '',
    membershipType: initialValues.membershipType || 'basic',
    startDate: initialValues.startDate || '',
    endDate: initialValues.endDate || '',
    paymentInfo: initialValues.paymentInfo || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
      <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
      <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} required />
      <Select label="Membership Type" name="membershipType" value={form.membershipType} onChange={handleChange} options={MEMBERSHIP_TYPES} />
      <DatePicker label="Start Date" name="startDate" value={form.startDate} onChange={(val) => handleDateChange('startDate', val)} required />
      <DatePicker label="End Date" name="endDate" value={form.endDate} onChange={(val) => handleDateChange('endDate', val)} required />
      <Input label="Payment Info" name="paymentInfo" value={form.paymentInfo} onChange={handleChange} required />
      <Button type="submit" className="w-full">{submitLabel}</Button>
    </form>
  );
};
