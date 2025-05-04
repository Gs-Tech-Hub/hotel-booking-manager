import React, { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { Button } from "@/components/ui-elements/button";
import { toast } from "react-toastify";
import { strapiService } from "@/utils/dataEndPoint";

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
  onSubmit: (updatedBooking: Partial<Booking>) => void;
}

const UpdateBookingForm: React.FC<UpdateBookingFormProps> = ({ booking, onSubmit }) => {
  const [formData, setFormData] = useState({
    booking_status: booking.booking_status,
    payment: {
      id: booking.payment?.id || 0,
      totalPrice: booking.payment?.totalPrice || 0,
      paymentMethod: booking.payment?.paymentMethod || "",
      transactionID: booking.payment?.transactionID || "",
      PaymentStatus: booking.payment?.PaymentStatus || "pending",
    },
    checkout: booking.checkout || "",
    totalPrice: booking.totalPrice || 0, // Ensure totalPrice is always a number
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: keyof typeof formData
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Dynamically construct the payload with only updated fields
      const payload: Partial<typeof formData> = {};

      if (formData.booking_status !== booking.booking_status) {
        payload.booking_status = formData.booking_status;
      }

      if (formData.checkout !== booking.checkout) {
        payload.checkout = formData.checkout;
      }

      if (formData.totalPrice !== booking.totalPrice) {
        payload.totalPrice = formData.totalPrice;
      }

      // Send the payload only if there are changes
      if (Object.keys(payload).length === 0) {
        toast.info("No changes to update.");
        return;
      }

      const response = await strapiService.updateBooking(booking.documentId, payload);
      if (response) {
        toast.success("Booking updated successfully!");
        onSubmit(payload);
      }
    } catch (error) {
      toast.error("Failed to update booking");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="update-booking-form">
      {/* Booking Status */}
      <h3 className="text-lg font-semibold mt-6 mb-4">Booking Status</h3>
      <select
        value={formData.booking_status ?? ""}
        onChange={handleChange}
        name="booking_status"
        className="w-full p-2 border rounded mb-4" 
      >
        <option value="">Select Booking Status</option>
        <option value="cancelled">Cancelled</option>
        <option value="pending">Pending</option>
        <option value="checkedin">Checked In</option>
        <option value="checkedout">Checked Out</option>
      </select>

      {/* Payment Details */}
      <h3 className="text-lg font-semibold mt-6 mb-4">Payment Details</h3>
      <Select
        label="Payment Method"
        value={formData.payment.paymentMethod}
        onChange={(e) => handleNestedChange({ ...e, target: { ...e.target, name: 'paymentMethod' } }, "payment")}
        items={[
          { label: "Cash", value: "cash" },
          { label: "Credit Card", value: "credit_card" },
          { label: "Online", value: "online" },
        ]}
        className="mb-4"
        placeholder="Select Payment Method"
      />
      <Select
        label="Payment Status"
        value={formData.payment.PaymentStatus}
        onChange={(e) => handleNestedChange({ ...e, target: { ...e.target, name: 'PaymentStatus' } }, "payment")}
        items={[
          { label: "Pending", value: "pending" },
          { label: "Completed", value: "completed" },
          { label: "Failed", value: "failed" },
        ]}
        className="mb-4"
        placeholder="Select Payment Status"
      />

      {/* Checkout Date */}
      <InputGroup
        label="Check-out Date"
        type="date"
        name="checkout"
        value={formData.checkout}
        handleChange={handleChange}
        className="mb-4"
      />

      {/* Total Price */}
      {/* <InputGroup
        label="Total Price"
        type="number"
        name="totalPrice"
        value={formData.totalPrice.toString()}
        handleChange={handleChange}
        className="mb-4"
      /> */}

      <Button
        label="Update Booking"
        className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
      />
    </form>
  );
};

export default UpdateBookingForm;