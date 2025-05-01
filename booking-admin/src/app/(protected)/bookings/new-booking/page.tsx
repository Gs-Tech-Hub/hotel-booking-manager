'use client';
import React, { useState, useEffect } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { Button } from "@/components/ui-elements/button";
import { Booking } from "@/types/bookingTypes";
import { strapiService } from "@/utils/dataEndPoint";
import { getRoomsLeft } from "@/utils/getavailableDate";
import Image from "next/image";

const CreateBookingForm: React.FC = () => {
  const [step, setStep] = useState(1); // Track the current step
  const [formData, setFormData] = useState<Booking>({
    checkin: "",
    checkout: "",
    guests: 1,
    nights: 1,
    totalPrice: 0,
    customer: { firstName: "", lastName: "", phone: "", email: "" },
    payment: { paymentMethod: "cash", paymentStatus: "success" },
    room: { title: "", price: 0, imgUrl: "" },
  });
  const [roomData, setRoomData] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [unavailableDates, setUnavailableDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchRoomsAndAvailability = async () => {
      try {
        const rooms = await strapiService.getRooms();
        setRoomData(rooms);

        if (rooms.length > 0) {
          setSelectedRoom(selectedRoom);

          const today = new Date();
          const threeMonthsLater = new Date();
          threeMonthsLater.setMonth(today.getMonth() + 3);

          const unavailable = new Set<string>();
          for (
            let date = new Date(today);
            date <= threeMonthsLater;
            date.setDate(date.getDate() + 1)
          ) {
            const formattedDate = date.toISOString().split("T")[0];
            const roomsLeft = await getRoomsLeft({
              roomId: selectedRoom.id,
              availableRooms: selectedRoom.availability,
              startDate: formattedDate,
              endDate: formattedDate,
            });
            if (roomsLeft === 0) {
              unavailable.add(formattedDate);
            }
          }
          setUnavailableDates(unavailable);
        }
      } catch (error) {
        console.error("Error fetching rooms or availability:", error);
      }
    };

    fetchRoomsAndAvailability();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof Booking) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...prev,
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

  const isDateDisabled = (date: string) => unavailableDates.has(date);

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePreviousStep = () => setStep((prev) => prev - 1);

  return (
    <div className="grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <form className="create-booking-form">
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
              <option value="" disabled>
                Select a room
              </option>
              {roomData.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.title}
                </option>
              ))}
            </select>

            {selectedRoom && (
              <div className="room-preview mt-4">
                <h4 className="text-lg font-semibold">Room Details</h4>
                <p>
                  <strong>Price:</strong> {selectedRoom.price}
                </p>
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
              max={new Date(new Date().setMonth(new Date().getMonth() + 3))
                .toISOString()
                .split("T")[0]}
              disabledDates={unavailableDates}
            />
            <InputGroup
              label="Check-out Date"
              type="date"
              name="checkout"
              value={formData.checkout}
              handleChange={handleDateChange}
              className="mb-4"
              min={formData.checkin || new Date().toISOString().split("T")[0]}
              max={new Date(new Date().setMonth(new Date().getMonth() + 3))
                .toISOString()
                .split("T")[0]}
              disabledDates={unavailableDates}
            />

            <p>
              <strong>Nights:</strong> {formData.nights}
            </p>
            <p>
              <strong>Total Price:</strong> {formData.totalPrice}
            </p>
            <div className="mt-5 flex justify-between">
            <Button label="Previous" variant="primary" onClick={handlePreviousStep} />
            <Button label="Next" variant="primary" onClick={handleNextStep} />
          </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3 className="text-lg font-semibold mt-6 mb-4">Customer Information</h3>
            <InputGroup
              label="First Name"
              type="text"
              name="firstName"
              value={formData.customer.firstName}
              handleChange={(e) => handleNestedChange(e, "customer")}
              className="mb-4"
            />
            <InputGroup
              label="Last Name"
              type="text"
              name="lastName"
              value={formData.customer.lastName}
              handleChange={(e) => handleNestedChange(e, "customer")}
              className="mb-4"
            />
            <InputGroup
              label="Phone"
              type="text"
              name="phone"
              value={formData.customer.phone}
              handleChange={(e) => handleNestedChange(e, "customer")}
              className="mb-4"
            />
            <InputGroup
              label="Email"
              type="email"
              name="email"
              value={formData.customer.email}
              handleChange={(e) => handleNestedChange(e, "customer")}
              className="mb-4"
            />
          <div className="mt-5 flex justify-between">
          <Button label="Previous" variant="primary" onClick={handlePreviousStep} />
          <Button label="Next" variant="primary" onClick={handleNextStep} />
         </div>
          </>
        )}

        {step === 4 && (
          <>
            <h3 className="text-lg font-semibold mt-6 mb-4">Payment Information</h3>
            <InputGroup
              label="Payment Method"
              type="text"
              name="paymentMethod"
              value={formData.payment.paymentMethod}
              handleChange={(e) => handleNestedChange(e, "payment")}
              className="mb-4"
            />
            <InputGroup
              label="Payment Status"
              type="text"
              name="paymentStatus"
              value={formData.payment.paymentStatus}
              handleChange={(e) => handleNestedChange(e, "payment")}
              className="mb-4"
            />
          <div className="mt-5 flex justify-between">
          <Button label="Previous" variant="primary" onClick={handlePreviousStep} />
          <Button label="Submit" variant="primary" onClick={() => console.log("Booking Data:", formData)} />
           </div>
          </>
        )}
      </form>
    </div>
  );
};

export default CreateBookingForm;