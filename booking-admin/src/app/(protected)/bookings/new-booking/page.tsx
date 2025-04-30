'use client';
import React, { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { Button } from "@/components/ui-elements/button";

interface Booking {
  checkin: string;
  checkout: string;
  guests: number;
  nights: number;
  totalPrice: number;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  payment: {
    paymentMethod: string;
    transactionID: string;
    PaymentStatus: string;
  };
  room: {
    title: string;
    price: number;
    imgUrl: string;
  };
}

const initialBookingState: Booking = {
  checkin: "",
  checkout: "",
  guests: 1,
  nights: 1,
  totalPrice: 0,
  customer: {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  },
  payment: {
    paymentMethod: "online",
    transactionID: "",
    PaymentStatus: "success",
  },
  room: {
    title: "",
    price: 0,
    imgUrl: "",
  },
};

const CreateBookingForm: React.FC = () => {
  const [formData, setFormData] = useState<Booking>(initialBookingState);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: keyof Booking
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...prev,
        [name]: value,
      },
    }));
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New Booking Data:", formData);
    // Add API call or logic to create a new booking
  };

  return (
    <div className="grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <form onSubmit={handleSubmit} className="create-booking-form">
        <h2 className="text-xl font-bold mb-4">Create Booking</h2>

        {currentStep === 1 && (
          <>
            <h3 className="text-lg font-semibold mt-6 mb-4">Room Details</h3>
            <InputGroup
              label="Room Title"
              type="text"
              name="title"
              value={formData.room.title}
              handleChange={(e) => handleNestedChange(e, "room")}
              className="mb-4"
              placeholder=""
            />
            <InputGroup
              label="Room Price"
              type="number"
              name="price"
              value={formData.room.price.toString()}
              handleChange={(e) => handleNestedChange(e, "room")}
              className="mb-4"
              placeholder=""
            />
            <InputGroup
              label="Room Image URL"
              type="text"
              name="imgUrl"
              value={formData.room.imgUrl}
              handleChange={(e) => handleNestedChange(e, "room")}
              className="mb-4"
              placeholder=""
            />
          </>
        )}

        {currentStep === 2 && (
          <>
            <h3 className="text-lg font-semibold mt-6 mb-4">General Booking Details</h3>
            <InputGroup
              label="Check-in Date"
              type="date"
              name="checkin"
              value={formData.checkin}
              handleChange={handleChange}
              className="mb-4"
              placeholder=""
            />
            <InputGroup
              label="Check-out Date"
              type="date"
              name="checkout"
              value={formData.checkout}
              handleChange={handleChange}
              className="mb-4"
              placeholder=""
            />
            <InputGroup
              label="Guests"
              type="number"
              name="guests"
              value={formData.guests.toString()}
              handleChange={handleChange}
              className="mb-4"
              placeholder=""
            />
            <InputGroup
              label="Nights"
              type="number"
              name="nights"
              value={formData.nights.toString()}
              handleChange={handleChange}
              className="mb-4"
              placeholder=""
            />
            <InputGroup
              label="Total Price"
              type="number"
              name="totalPrice"
              value={formData.totalPrice.toString()}
              handleChange={handleChange}
              className="mb-4"
              placeholder=""
            />
          </>
        )}

        {currentStep === 3 && (
          <>
            <h3 className="text-lg font-semibold mt-6 mb-4">Customer Details</h3>
            <InputGroup
              label="First Name"
              type="text"
              name="firstName"
              value={formData.customer.firstName}
              handleChange={(e) => handleNestedChange(e, "customer")}
              className="mb-4"
              placeholder=""
            />
            <InputGroup
              label="Last Name"
              type="text"
              name="lastName"
              value={formData.customer.lastName}
              handleChange={(e) => handleNestedChange(e, "customer")}
              className="mb-4"
              placeholder=""
            />
            <InputGroup
              label="Phone"
              type="text"
              name="phone"
              value={formData.customer.phone}
              handleChange={(e) => handleNestedChange(e, "customer")}
              className="mb-4"
              placeholder=""
            />
            <InputGroup
              label="Email"
              type="email"
              name="email"
              value={formData.customer.email}
              handleChange={(e) => handleNestedChange(e, "customer")}
              className="mb-4"
              placeholder=""
            />
          </>
        )}

        {currentStep === 4 && (
          <>
            <h3 className="text-lg font-semibold mt-6 mb-4">Payment Details</h3>
            <Select
              label="Payment Method"
              value={formData.payment.paymentMethod}
              onChange={(e) => handleNestedChange(e, "payment")}
              items={[
                { label: "Online", value: "online" },
                { label: "Cash", value: "cash" },
              ]}
              className="mb-4"
              placeholder="Select payment method"
            />
            <InputGroup
              label="Transaction ID"
              type="text"
              name="transactionID"
              value={formData.payment.transactionID}
              handleChange={(e) => handleNestedChange(e, "payment")}
              className="mb-4"
              placeholder=""
            />
            <Select
              label="Payment Status"
              value={formData.payment.PaymentStatus}
              onChange={(e) => handleNestedChange(e, "payment")}
              items={[
                { label: "Success", value: "success" },
                { label: "Debt", value: "debt" },
              ]}
              className="mb-4"
              placeholder="Select payment status"
            />
          </>
        )}

        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <Button
              label="Back"
              variant="outlinePrimary"
              onClick={handleBack}
              className="mr-2"
            />
          )}
          {currentStep < 4 ? (
            <Button
              label="Next"
              variant="primary"
              onClick={handleNext}
            />
          ) : (
            <Button
              label="Submit"
              variant="primary"
              onClick={(e) => handleSubmit(e)}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateBookingForm;