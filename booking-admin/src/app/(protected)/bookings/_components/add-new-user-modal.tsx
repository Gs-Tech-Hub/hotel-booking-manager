import React, { useState } from "react";
import { Modal } from "@/components/ui-elements/modal";
import { Button } from "@/components/ui-elements/button";
import { strapiService } from "@/utils/dataEndPoint";
import { toast } from "react-toastify";
import { Customer } from "@/types/bookingTypes";
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const validatePhone = (phone: string) => {
    const phoneNumber = parsePhoneNumberFromString(phone, 'NG'); // or 'US', 'GH', etc.
    if (!phoneNumber || !phoneNumber.isValid()) {
      return 'Invalid phone number';
    }
    return '';
  };



interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customer: Customer) => void;
}

export function AddNewCustomerModal({ isOpen, onClose, onSubmit }: CreateCustomerModalProps) {
  const [newUserName, setNewUserName] = useState("");
  const [newUserLastName, setNewUserLastName] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');


  const handleCreateUser = async () => {
    if (!newUserName || !newUserLastName || !newUserPhone || !newUserEmail) {
      toast.warning("All fields are required.");
      return;
    }

    const phoneValidationError = validatePhone(newUserPhone);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      return;
    } else {
      setPhoneError('');
    }

    setIsLoading(true);
    try {
      const response = await strapiService.createCustomer({
        firstName: newUserName,
        lastName: newUserLastName,
        phone: newUserPhone,
        email: newUserEmail,
      });

      if (!response) {
        throw new Error("Invalid server response");
      }

      // Pass all required customer fields
      const { id, documentId } = response;
      onSubmit({
        id,
        documentId,
      });
      onClose();
      toast.success("Customer created successfully!");
    } catch (error) {
      console.error("Error creating customer:", error);
      toast.error(`Failed to create customer: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add a new Customer"
      content={
        <fieldset className="space-y-4" disabled={isLoading}>
          <div>
            <label>First Name</label>
            <input
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              value={newUserLastName}
              onChange={(e) => setNewUserLastName(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded"
              placeholder="Enter last name"
            />
          </div>
          <div>
            <label>Phone Number</label>
            <input
                value={newUserPhone}
                onChange={(e) => {
                setNewUserPhone(e.target.value);
                if (phoneError) {
                    setPhoneError(''); // Clear error while typing
                }
                }}
                className={`w-full px-3 py-2 mt-1 border rounded ${phoneError ? 'border-red-500' : ''}`}
                placeholder="Enter phone number"
            />
            {phoneError && (
                <p className="text-red-600 text-sm mt-1">{phoneError}</p>
            )}
            </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded"
              placeholder="Enter email"
            />
          </div>
        </fieldset>
      }
      footer={
        <div className="flex justify-end gap-2">
          <Button label="Cancel" onClick={onClose} />
          <Button
            label={isLoading ? "Creating..." : "Create Customer"}
            onClick={handleCreateUser}
            className={isLoading ? "opacity-50" : ""}
          />
        </div>
      }
    />
  );
}
