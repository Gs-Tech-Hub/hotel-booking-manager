import React, { useState } from "react";
import { Modal } from "@/components/ui-elements/modal";
import { Button } from "@/components/ui-elements/button";
import UpdateBookingForm from "@/app/(protected)/bookings/_components/update-booking-form"

interface UpdateCustomerBookingProps {
    isOpen: boolean;
    onClose: () => void;
    booking: any;
    onSubmit: (updatedData: { checkout: string; status: string; }) => Promise<void>;
  }

export default function UpdateCustomerBooking ({
       isOpen,
       onClose,
       booking,
       onSubmit,
    
    }: 
       UpdateCustomerBookingProps )
          {
    const handleSubmit = (updatedBooking: any) => {
        // Handle the form submission
        onClose();
    };

    return (
         <Modal
              isOpen={isOpen}
              onClose={onClose}
              title="Update Customer Booking"
              content={
                <>
                  <UpdateBookingForm 
                  booking={booking} 
                  onSubmit={handleSubmit} />

                  <Button label="Close" onClick={onClose} />
                </>
              }
         />
    );
}