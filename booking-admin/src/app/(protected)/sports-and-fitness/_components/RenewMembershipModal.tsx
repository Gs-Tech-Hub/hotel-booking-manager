import React from 'react';
import { Modal } from '@/components/ui-elements/modal';
import { MembershipForm, MembershipFormValues } from './create-membership-form';

interface RenewMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRenew: (values: MembershipFormValues) => void;
  initialValues: MembershipFormValues;
}

const RenewMembershipModal: React.FC<RenewMembershipModalProps> = ({ isOpen, onClose, onRenew, initialValues }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Renew Membership"
      content={
        <MembershipForm
          initialValues={initialValues}
          onSubmit={(values) => {
            onRenew(values);
            onClose();
          }}
          submitLabel="Renew Membership"
        />
      }
    />
  );
};

export default RenewMembershipModal;
