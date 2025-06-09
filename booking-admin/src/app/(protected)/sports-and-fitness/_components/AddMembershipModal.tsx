/* eslint-disable */
import React from 'react';
import { Modal } from '@/components/ui-elements/modal';
import { MembershipForm, MembershipFormValues } from './create-membership-form';

interface AddMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (values: MembershipFormValues) => void;
  membershipPlans?: any[]; // Add this prop
}

const AddMembershipModal: React.FC<AddMembershipModalProps> = ({ isOpen, onClose, onAdd, membershipPlans = [] }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Membership"
      content={
        <MembershipForm
          onSubmit={(values: any) => {
            onAdd(values);
            onClose();
          }}
          submitLabel="Add Membership"
          membershipPlans={membershipPlans}
        />
      }
    />
  );
};

export default AddMembershipModal;
