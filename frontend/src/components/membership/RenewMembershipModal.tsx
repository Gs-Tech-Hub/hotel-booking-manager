import React from 'react';
import { Modal } from '@/components/';
import { MembershipForm, MembershipFormValues } from './MembershipForm';

interface RenewMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRenew: (values: MembershipFormValues) => void;
  initialValues: MembershipFormValues;
}

const RenewMembershipModal: React.FC<RenewMembershipModalProps> = ({ isOpen, onClose, onRenew, initialValues }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Renew Membership">
      <MembershipForm
        initialValues={initialValues}
        onSubmit={(values) => {
          onRenew(values);
          onClose();
        }}
        submitLabel="Renew Membership"
      />
    </Modal>
  );
};

export default RenewMembershipModal;
