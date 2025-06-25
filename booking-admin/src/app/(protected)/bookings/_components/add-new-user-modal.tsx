import React, { useState } from "react";
import { Modal } from "@/components/ui-elements/modal";
import { Button } from "@/components/ui-elements/button";
import { strapiService } from "@/utils/dataEndPoint";
import { toast } from "react-toastify";
import { Customer } from "@/types/bookingTypes";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { cn } from "@/lib/utils";

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
  
  const [customerInput, setCustomer] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserLastName, setNewUserLastName] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserStreet, setNewUserStreet] = useState("");
  const [newUserCity, setNewUserCity] = useState("");
  const [newUserState, setNewUserState] = useState("");
  const [newUserCountry, setNewUserCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');

   const handleLookup = async () => {
      if (!customerInput.trim()) {
        toast.warning("Please enter a phone number or email.");
        return;
      }
    
      setIsLoading(true);
      try {
        const user = await strapiService.findCustomerByPhoneOrEmail(customerInput);
    
        if (user) {
          toast.success("Customer found! Skipping to the last step.");
          onSubmit({
            id: user.id,
            documentId: user.documentId,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            email: user.email,
          });
          onClose();
        } else {
          toast.info("No customer found with this phone or email. Please create a new customer.");
          setShowUserForm(true);
        }
      } catch (error) {
        toast.error(`Error checking customer: ${(error as Error).message}`);
      } finally {
        setIsLoading(false);
      }
    };


  const handleCreateUser = async () => {
    if (!newUserName || !newUserLastName || !newUserPhone || !newUserEmail || !newUserStreet || !newUserCity || !newUserState || !newUserCountry) {
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
        street: newUserStreet,
        city: newUserCity,
        state: newUserState,
        nationality: newUserCountry,
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
        showUserForm ? (
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
                  if (phoneError) setPhoneError('');
                }}
                className={`w-full px-3 py-2 mt-1 border rounded ${phoneError ? 'border-red-500' : ''}`}
                placeholder="Enter phone number"
              />
              {phoneError && <p className="text-red-600 text-sm mt-1">{phoneError}</p>}
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
            <div className="flex gap-3">
              <div>
              <label>Street</label>
              <input
                value={newUserStreet}
                onChange={(e) => setNewUserStreet(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded"
                placeholder="Enter street address"
              />
              </div>
              <div>
              <label>City</label>
              <input
                value={newUserCity}
                onChange={(e) => setNewUserCity(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded"
                placeholder="Enter city"
              />
              </div>
            </div>
            <div className="flex gap-3">
              <div>
              <label>State</label>
              <input
                value={newUserState}
                onChange={(e) => setNewUserState(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded"
                placeholder="Enter state"
              />
              </div>
              <div>
              <label>Country</label>
              <input
                value={newUserCountry}
                onChange={(e) => setNewUserCountry(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded"
                placeholder="Enter country"
              />
              </div>
               
            </div>
          </fieldset>
        ) : (
          <fieldset className="space-y-4" disabled={isLoading}>
            <div>
              <label>Phone or Email</label>
              <input
                value={customerInput}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded"
                placeholder="Enter phone or email to search"
              />
            </div>
          </fieldset>
        )
      }
      
      footer={
        <div className="flex justify-end gap-2">
          <Button label="Cancel" onClick={onClose} />
           {showUserForm ? (
                  <Button
                    label={isLoading ? "Creating..." : "Create User"}
                    onClick={handleCreateUser}
                    className={cn(isLoading && "opacity-50")}
                  />
                ) : (
                  <Button
                    label={isLoading ? "Checking..." : "Check"}
                    onClick={handleLookup}
                    className={cn(isLoading && "opacity-50")}
                  />
                )}
        </div>
      }
    />
  );
}
