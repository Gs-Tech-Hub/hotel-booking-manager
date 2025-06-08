'use client';
/* eslint-disable */
import React, { useState, useEffect } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { Button } from "@/components/ui-elements/button";
import { Booking, Customer } from "@/types/bookingTypes";
import { strapiService } from "@/utils/dataEndPoint";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter
import { toast } from "react-toastify";
import { AddNewCustomerModal } from "@/app/(protected)/bookings/_components/add-new-user-modal"; // Import AddNewCustomerModal

const CreateBookingForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Booking>({
    checkin: "",
    checkout: "",
    guests: 1,
    nights: 1,
    totalPrice: 0,
    customer: {  documentId: "", firstName: "", lastName: "", phone: "", email: "" },
    payment: { paymentMethod: "cash", PaymentStatus: "pending" },
    room: { title: "", price: 0,  },
  });
  const [roomData, setRoomData] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRoomsAndAvailability = async () => {
      try {
        const rooms = await strapiService.getRooms();
        setRoomData(rooms);

        if (rooms.length > 0) {
          const firstRoom = rooms[0];
          setSelectedRoom(firstRoom);

          const today = new Date();
          const threeMonthsLater = new Date();
          threeMonthsLater.setMonth(today.getMonth() + 3);

        }
      } catch (error) {
        console.error("Error fetching rooms or availability:", error);
      }
    };

    fetchRoomsAndAvailability();
  }, []);

  const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, key: keyof Booking) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...((prev[key] as object) || {}), // Ensure prev[key] is treated as an object
        [name]: value,
      },
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "checkin" || name === "checkout") {
      const { checkin, checkout } = {
        ...formData,
        [name]: value,
      } as Pick<Booking, 'checkin' | 'checkout'>;

      if (checkin && checkout) {
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);

        if (checkoutDate <= checkinDate) {
          alert("Checkout date must be greater than check-in date.");
          return;
        }

        const nights = Math.ceil(
          (checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (nights > 0 && selectedRoom) {
          setFormData((prev) => ({
            ...prev,
            nights,
            totalPrice: nights * selectedRoom.price,
          }));
        }
      }
    }
  };

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setStep((prev) => {
      if (prev === 2) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          nights: 1,
          totalPrice: 0,
        }));
      }
      return prev - 1;
    });
  };

  const handleBookingSubmission = async () => {
    try {
      if (!customerId) {
        toast.error("Please select or create a customer first.");
        return;
      }

      // Destructure the necessary fields from formData
      const { checkin, checkout, guests, nights, totalPrice, payment } = formData;

    console.log("form Data:", formData);

      const transactionData = {
      PaymentStatus: payment.PaymentStatus,
      paymentMethod: payment.paymentMethod,
      totalPrice: totalPrice,
    };

      // Post the payload directly
      const paymentId = await strapiService.createTransaction(transactionData);

      const response = await strapiService.createBooking({
        checkin,
        checkout,
        guests,
        nights,
        totalPrice,
        customer: customerId, // Use the customer ID
        room: selectedRoom?.documentId, // Use the room's documentId
        payment: paymentId,
      });

      const bookingResponse = await response;
      console.log("booking Response:", bookingResponse);
      toast.success("Booking created successfully!");

      // Redirect to the booking summary page
      router.push(`/booking-confirmation?bookingId=
        ${bookingResponse.documentId}
        &amount=${bookingResponse.totalPrice}
        &checkIn=${bookingResponse.checkin}
        &checkOut=${bookingResponse.checkout}
        &room=${selectedRoom.title}
      `);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking. Please try again.");
    }
  };

  return (
    <div className="grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <form
        className="create-booking-form"
        onSubmit={(e) => {
          e.preventDefault();
          // handleBookingSubmission();
        }}
      >
        <h2 className="text-xl font-bold mb-4">Create Booking</h2>

        {step === 1 && (
          <>
            <label htmlFor="room-select" className="block text-body-sm font-medium text-dark dark:text-white">
              Select Room
            </label>
            <select
              id="room-select"
              value={selectedRoom?.id || ""}
              onChange={(e) => {
                const room = roomData.find((r) => r.id === Number(e.target.value));
                setSelectedRoom(room || null);
              }}
              className="w-full appearance-none rounded-lg border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
            >
              <option value="" disabled>Select a room</option>
              {roomData.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.title}
                </option>
              ))}
            </select>

            {selectedRoom && (
              <div className="room-preview mt-4">
                <h4 className="text-lg font-semibold">Room Details</h4>
                <p><strong>Price:</strong> {selectedRoom.price}</p>
                <Image
                  src={selectedRoom.imgUrl}
                  alt={selectedRoom.title}
                  width={300}
                  height={300}
                  className="rounded-lg mt-2"
                  style={{ width: "100%", maxWidth: "300px" }}
                />
              </div>
            )}
            <div className="mt-5">
              <Button label="Next" variant="primary" onClick={handleNextStep} />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="text-lg font-semibold mt-6 mb-4">Booking Details</h3>
            <InputGroup
              label="Check-in Date"
              type="date"
              name="checkin"
              value={formData.checkin}
              handleChange={handleDateChange}
              className="mb-4"
              min={new Date().toISOString().split("T")[0]}
              max={new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split("T")[0]}
            />
            <InputGroup
              label="Check-out Date"
              type="date"
              name="checkout"
              value={formData.checkout}
              handleChange={handleDateChange}
              className="mb-4"
              min={formData.checkin || new Date().toISOString().split("T")[0]}
              max={new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split("T")[0]}
            />
            <p><strong>Nights:</strong> {formData.nights}</p>
            <p><strong>Total Price:</strong> {formData.totalPrice}</p>

            <div className="mt-5 flex justify-between">
              <Button label="Previous" variant="primary" onClick={handlePreviousStep} />
              <Button
                label="Next"
                variant="primary"
                onClick={handleNextStep}
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3 className="text-lg font-semibold mt-6 mb-4">Payment Information</h3>
            <label htmlFor="payment-method" className="block text-body-sm font-medium text-dark dark:text-white">
              Payment Method
            </label>
            <select
              id="payment-method"
              name="paymentMethod"
              value={formData.payment.paymentMethod}
              onChange={(e) => handleNestedChange(e, "payment")}
              className="w-full appearance-none rounded-lg border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary mb-4"
            >
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="card">Debit Card</option>
            </select>

            <label htmlFor="payment-status" className="block text-body-sm font-medium text-dark dark:text-white">
              Payment Status
            </label>
            <select
              id="payment-status"
              name="PaymentStatus" // Ensure this matches the key in the payment object
              value={formData.payment.PaymentStatus}
              onChange={(e) => handleNestedChange(e, "payment")}
              className="w-full appearance-none rounded-lg border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary mb-4"
            >
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            <div className="mt-5 flex justify-between">
              <Button label="Previous" variant="primary" onClick={handlePreviousStep} />
              <Button label="Next" variant="primary" onClick={handleNextStep} />
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h3 className="text-lg font-semibold mt-6 mb-4">Customer Information</h3>
            <Button
              label="Select or Create Customer"
              variant="primary"
              onClick={() => setIsCustomerModalOpen(true)}
              className="mb-4"
            />
            <p>
              <strong>Selected Customer:</strong>{" "}
              {formData.customer.firstName
                ? `${formData.customer.firstName} ${formData.customer.lastName}`
                : "None"}
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-4">Confirm Booking</h3>
            <div className="mt-5 flex justify-between">
              <Button label="Previous" variant="primary" onClick={handlePreviousStep} />
              <Button
                label="Submit"
                variant="primary"
                onClick={handleBookingSubmission}
                disabled={!customerId} // Disable until a customer is selected or created
              />
            </div>
          </>
        )}
      </form>

      <AddNewCustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSubmit={(customer: Customer) => {
          setCustomerId(customer.id ?? null); 
          setFormData((prev) => ({
            ...prev,
            customer: {
              ...prev.customer,
              documentId: customer.documentId, // Save the documentId
            },
          }));
          setIsCustomerModalOpen(false);
        }}
      />
    </div>
  );
};

export default CreateBookingForm;
