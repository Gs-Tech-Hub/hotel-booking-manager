import React, { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";

interface Booking {
  id: number;
  documentId: string;
  checkin: string;
  checkout: string;
  guests: number;
  nights: number;
  totalPrice: number;
  booking_status: string | null;
  customer: {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  payment: {
    id: number;
    totalPrice: number;
    paymentMethod: string;
    transactionID: string;
    PaymentStatus: string;
  };
  room: {
    id: number;
    title: string;
    price: number;
    imgUrl: string;
  };
}

interface UpdateBookingFormProps {
  booking: Booking;
  onSubmit: (updatedBooking: Booking) => void;
}

const UpdateBookingForm: React.FC<UpdateBookingFormProps> = ({ booking, onSubmit }) => {
  const [formData, setFormData] = useState<Booking>(booking);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="update-booking-form">
      <h2 className="text-xl font-bold mb-4">Create Booking</h2>

      {/* General Booking Fields */}
      <InputGroup
        label="Check-in Date"
        type="date"
        name="checkin"
        value={formData.checkin}
        handleChange={handleChange}
        className="mb-4" placeholder={""}      />

      <InputGroup
        label="Check-out Date"
        type="date"
        name="checkout"
        value={formData.checkout}
        handleChange={handleChange}
        className="mb-4" placeholder={""}      />

      <InputGroup
        label="Guests"
        type="number"
        name="guests"
        value={formData.guests.toString()}
        handleChange={handleChange}
        className="mb-4" placeholder={""}      />

      <InputGroup
        label="Nights"
        type="number"
        name="nights"
        value={formData.nights.toString()}
        handleChange={handleChange}
        className="mb-4" placeholder={""}      />

      <InputGroup
        label="Total Price"
        type="number"
        name="totalPrice"
        value={formData.totalPrice.toString()}
        handleChange={handleChange}
        className="mb-4" placeholder={""}      />

      {/* Customer Fields */}
      <h3 className="text-lg font-semibold mt-6 mb-4">Customer Details</h3>
      <InputGroup
        label="First Name"
        type="text"
        name="firstName"
        value={formData.customer.firstName}
        handleChange={(e) => handleNestedChange(e, "customer")}
        className="mb-4" placeholder={""}      />

      <InputGroup
        label="Last Name"
        type="text"
        name="lastName"
        value={formData.customer.lastName}
        handleChange={(e) => handleNestedChange(e, "customer")}
        className="mb-4" placeholder={""}      />

      <InputGroup
        label="Phone"
        type="text"
        name="phone"
        value={formData.customer.phone}
        handleChange={(e) => handleNestedChange(e, "customer")}
        className="mb-4" placeholder={""}      />

      <InputGroup
        label="Email"
        type="email"
        name="email"
        value={formData.customer.email}
        handleChange={(e) => handleNestedChange(e, "customer")}
        className="mb-4" placeholder={""}      />

      {/* Payment Fields */}
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
        className="mb-4" placeholder={""}      />
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

      {/* Room Fields */}
      <h3 className="text-lg font-semibold mt-6 mb-4">Room Details</h3>
      <InputGroup
        label="Room Title"
        type="text"
        name="title"
        value={formData.room.title}
        handleChange={(e) => handleNestedChange(e, "room")}
        className="mb-4" placeholder={""}      />

      <InputGroup
        label="Room Price"
        type="number"
        name="price"
        value={formData.room.price.toString()}
        handleChange={(e) => handleNestedChange(e, "room")}
        className="mb-4" placeholder={""}      />

      <InputGroup
        label="Room Image URL"
        type="text"
        name="imgUrl"
        value={formData.room.imgUrl}
        handleChange={(e) => handleNestedChange(e, "room")}
        className="mb-4" placeholder={""}      />

      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
      >
        Create Booking
      </button>
    </form>
  );
};

export default UpdateBookingForm;