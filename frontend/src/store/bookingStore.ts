import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookingState {
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  room: {
    name: string;
    image: string;
    amenities: string[];
    pricePerNight: number;
  } | null;
  totalPrice: number;
  updateBooking: (data: Partial<BookingState>) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      checkIn: null,
      checkOut: null,
      guests: 1,
      room: null,
      totalPrice: 0,
      updateBooking: (data) => set((state) => ({ ...state, ...data })),
      resetBooking: () =>
        set({
          checkIn: null,
          checkOut: null,
          guests: 1,
          room: null,
          totalPrice: 0,
        }),
    }),
    {
      name: "booking-storage", // Saves booking data in localStorage
    }
  )
);
