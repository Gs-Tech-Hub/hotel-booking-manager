"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays } from "date-fns";
import { useBookingStore } from "../store/bookingStore";
import { useRouter } from "next/navigation";


export default function BookingForm() {
  const router = useRouter();
  const { checkIn, checkOut, guests, updateBooking } = useBookingStore();
  const [localCheckIn, setLocalCheckIn] = useState<Date>(checkIn || new Date());
  const [localCheckOut, setLocalCheckOut] = useState<Date>(checkOut || addDays(new Date(), 1));
  const [localGuests, setLocalGuests] = useState<number>(guests);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  // Sync Zustand state when local state changes
  useEffect(() => {
    updateBooking({ checkIn: localCheckIn, checkOut: localCheckOut, guests: localGuests });
  }, [localCheckIn, localCheckOut, localGuests, updateBooking]);

  const handleCheckAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/bookings"); // Navigate to booking page
  };

  return (
    <div className="booking_area">
      <form action="">
        <div className="row">
          {/* Check-in */}
          <div className="col-lg-3 col-sm-6 col-6">
            <div className="booking_item relative">
              <p>Check - in</p>
              <div className="flex items-center rounded p-2 cursor-pointer bg-white">
                <span className="day">{format(localCheckIn, "dd")}</span>
                <span className="month">{format(localCheckIn, "MMM")}</span>
                <label htmlFor="CheckIn">
                  <i className="fa fa-angle-down ml-2"></i>
                </label>
              </div>
              <DatePicker
               selected={localCheckIn}
               onChange={(date: Date | null) => date && setLocalCheckIn(date)}
               dateFormat="dd/MM/yyyy"
               className="absolute top-full left-0 z-50 opacity-0 w-0 h-0"
               id="CheckIn"
               minDate={new Date()} // Prevent past dates
               popperPlacement="bottom-start"
               />
            </div>
          </div>

          {/* Check-out */}
          <div className="col-lg-3 col-sm-6 col-6">
            <div className="booking_item relative">
              <p>Check - out</p>
              <div className="flex items-center rounded p-2 cursor-pointer bg-white">
                <span className="day">{format(localCheckOut, "dd")}</span>
                <span className="month">{format(localCheckOut, "MMM")}</span>
                <label htmlFor="CheckOut">
                  <i className="fa fa-angle-down ml-2"></i>
                </label>
              </div>
              <DatePicker
                selected={localCheckOut}
                onChange={(date: Date | null) => date && setLocalCheckOut(date)}
                dateFormat="dd/MM/yyyy"
                className="absolute opacity-0 w-0 h-0"
                id="CheckOut"
                minDate={localCheckIn}
                popperPlacement="bottom-start"
              />
            </div>
          </div>

          {/* Guests Dropdown */}
          <div className="col-lg-3 col-sm-6 col-6 relative">
            <div
              className="booking_item cursor-pointer"
              onClick={() => setShowGuestDropdown(!showGuestDropdown)}
            >
              <p>Total guests</p>
              <span className="day">{localGuests}</span>
              <span className="month">person{localGuests > 1 ? "s" : ""}</span>
            </div>
            {showGuestDropdown && (
              <div className="absolute bg-white shadow-lg rounded-lg p-2 mt-1 w-full z-10">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div
                    key={num}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      setLocalGuests(num);
                      setShowGuestDropdown(false);
                    }}
                  >
                    {num} person{num > 1 ? "s" : ""}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Coupon and Submit */}
          <div className="col-lg-3 col-sm-6 col-6 coupon-code">
            <div className="booking_item">
              <p className="text-capitalize">
                <a href="#">Got a Coupon Code?</a>
              </p>
              <button type="button" className="main_btn text-uppercase" onClick={handleCheckAvailability}>
              check availability
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
