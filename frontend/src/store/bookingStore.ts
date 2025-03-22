import { create } from "zustand";

interface Amenity {
  id: number;
  name: string;
  icon: string;
}

interface Room {
  id: number;
  title: string;
  imgUrl: string;
  description: string;
  amenities: Amenity[];
  price: number;
  bed?: string;
  priceOnline: number;
  discount: string;
  availability: number;
}

interface ExtraService {
  name: string;
  price: number;
}


interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

interface BookingState {
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  guestInfo: GuestInfo;
  paymentMethod: "online" | "premise";
  selectedRoom: Room | null;
  selectedHotel: string;
  totalPrice: number;
  nights: number;
  extras: ExtraService[]; // Unopinionated array of selected extras
  updateBooking: (booking: Partial<BookingState>) => void;
  resetBooking: () => void; // New function to reset all booking data
}

// Omit function properties for initial state
type BookingStateWithoutFunctions = Omit<BookingState, 'updateBooking' | 'resetBooking'>

// Initial state for resetting
const initialState: BookingStateWithoutFunctions = {
  checkIn: null,
  checkOut: null,
  guests: 1,
  guestInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  },
  paymentMethod: "online",
  selectedRoom: null,
  selectedHotel: "",
  totalPrice: 0,
  nights: 1,
  extras: [], // Empty array for extras
};

export const useBookingStore = create<BookingState>((set) => ({
  ...initialState,
  updateBooking: (booking) => set((state) => ({ ...state, ...booking })),
  resetBooking: () => set(() => ({ ...initialState })), // Reset booking data
}));
