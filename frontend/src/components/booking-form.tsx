import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays } from "date-fns";

export default function BookingForm() {
  const [checkIn, setCheckIn] = useState<Date>(new Date());
  const [checkOut, setCheckOut] = useState<Date>(addDays(new Date(), 1));
  const [guests, setGuests] = useState(2);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  return (
    <div className="booking_area">
      <form action="">
        <div className="row">
          {/* Check-in */}
          <div className="col-lg-3 col-sm-6 col-6">
            <div className="booking_item relative">
              <p>Check - in</p>
              <div className="flex items-center rounded p-2 cursor-pointer bg-white">
                {/* Display selected date */}
                <span className="day">{format(checkIn, "dd")}</span>
                <span className="month">{format(checkIn, "MMM")}</span>
                <label htmlFor="CheckIn">
                  <i className="fa fa-angle-down ml-2"></i>
                </label>
              </div>
              {/* Hidden DatePicker to trigger selection */}
              <DatePicker
                selected={checkIn}
                onChange={(date: Date | null) => date && setCheckIn(date)}
                dateFormat="dd/MM/yyyy"
                className="absolute top-full left-0 z-50 opacity-0 w-0 h-0"
                id="CheckIn"
              />
            </div>
          </div>

          {/* Check-out */}
          <div className="col-lg-3 col-sm-6 col-6">
            <div className="booking_item relative">
              <p>Check - out</p>
              <div className="flex items-center rounded p-2 cursor-pointer bg-white">
                {/* Display selected date */}
                <span className="day">{format(checkOut, "dd")}</span>
                <span className="month">{format(checkOut, "MMM")}</span>
                <label htmlFor="CheckOut">
                  <i className="fa fa-angle-down ml-2"></i>
                </label>
              </div>
              {/* Hidden DatePicker */}
              <DatePicker
                selected={checkOut}
                onChange={(date: Date | null) => date && setCheckOut(date)}
                dateFormat="dd/MM/yyyy"
                className="absolute opacity-0 w-0 h-0"
                id="CheckOut"
                minDate={checkIn} // Ensures valid date selection
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
              <span className="day">{guests}</span>
              <span className="month">person{guests > 1 ? "s" : ""}</span>
            </div>
            {showGuestDropdown && (
              <div className="absolute bg-white shadow-lg rounded-lg p-2 mt-1 w-full z-10">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div
                    key={num}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      setGuests(num);
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
              <button type="submit" className="main_btn text-uppercase">
                check availability
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
