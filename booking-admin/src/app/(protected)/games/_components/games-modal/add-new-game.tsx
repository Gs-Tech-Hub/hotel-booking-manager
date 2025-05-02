import React, { useState } from "react";
import { Modal } from "@/components/ui-elements/modal";
import { Button } from "@/components/ui-elements/button";
import { strapiService } from "@/utils/dataEndPoint";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const validatePhone = (phone: string) => {
    const phoneNumber = parsePhoneNumberFromString(phone, 'NG'); // or 'US', 'GH', etc.
    if (!phoneNumber || !phoneNumber.isValid()) {
      return 'Invalid phone number';
    }
    return '';
  };

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export function CreateGameModal({ isOpen, onClose, onSubmit }: CreateGameModalProps) {
  const [playerInput, setPlayerInput] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserLastName, setNewUserLastName] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
    const [phoneError, setPhoneError] = useState('');
  

  const handleLookup = async () => {
    if (!playerInput.trim()) {
      toast.warning("Please enter a phone number or email.");
      return;
    }
  
    setIsLoading(true);
    try {
      // assuming playerInput is being matched against both phone & email
      const user = await strapiService.findCustomerByPhoneOrEmail(playerInput);
  
      if (user) {
        await createGame(user.documentId); 
      } else {
        toast.info("No customer found with this phone or email.");
        setShowUserForm(true);
      }
    } catch (error) {
      toast.error(`Error checking customer: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };
  

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
      const newUser = await strapiService.createCustomer({
        firstName: newUserName,
        lastName: newUserLastName,
        phone: newUserPhone,
        email: newUserEmail,
      });
      await createGame(newUser.documentId);
    } catch (error) {
      toast.error(`Failed to create user : ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createGame = async (customerId: string) => {
    try {
      await strapiService.createGame({
        customer: customerId,
        count: 1,
        amount_paid: 0,
        amount_owed: 500,
        game_status: "ongoing",
      });
      toast.success("Game session created!");
      onSubmit();
      onClose();
    } catch (error) {
      toast.error(`Failed to create game.: ${(error as Error).message}`);
    }
  };

  const content = showUserForm ? (
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
          onChange={(e) => {
            setNewUserEmail(e.target.value);
            if (phoneError) {
              setPhoneError(''); // Clear error while typing
            }
          }}
          className={`w-full px-3 py-2 mt-1 border rounded  ${phoneError ? 'border-red-500' : ''}`}
          placeholder="Enter email"
        />
      </div>
    </fieldset>
  ) : (
    <div>
      <label>Enter Phone Number</label>
      <input
        value={playerInput}
        onChange={(e) => {
          setPlayerInput(e.target.value);
          if (phoneError) {
            setPhoneError('');
          }
        }}
        className={`w-full px-3 py-2 mt-1 border rounded  ${phoneError ? 'border-red-500' : ''}`}
        placeholder="e.g. 08123456789"
      />
    </div>
  );

  const footer = (
    <div className="flex justify-end gap-2">
      <Button label="Cancel" onClick={onClose} />
      {showUserForm ? (
        <Button
          label={isLoading ? "Creating..." : "Create User + Game"}
          onClick={handleCreateUser}
          className={cn(isLoading && "opacity-50")}
        />
      ) : (
        <Button
          label={isLoading ? "Checking..." : "Check & Start Game"}
          onClick={handleLookup}
          className={cn(isLoading && "opacity-50")}
        />
      )}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Start New Game"
      content={content}
      footer={footer}
    />
  );
}
