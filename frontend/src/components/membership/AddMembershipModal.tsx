import React from 'react';
import { Modal } from '../ui-elements';
import { MembershipForm, MembershipFormValues } from './MembershipForm';

interface AddMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (values: MembershipFormValues) => void;
}

const AddMembershipModal: React.FC<AddMembershipModalProps> = ({ isOpen, onClose, onAdd }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Membership">
      <MembershipForm
        onSubmit={(values) => {
          onAdd(values);
          onClose();
        }}
        submitLabel="Add Membership"
      />
    </Modal>
  );
};

export default AddMembershipModal;
