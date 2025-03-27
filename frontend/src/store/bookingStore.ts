// /store/bookingStore.ts
import {create} from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface GuestInfo {
  FirstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}

interface Amenity {
  id: number;
  name: string;
  iconUrl?: string;
  description?: string;
}

interface RoomDetails {
  id: number;
  title: string;
  description: string;
  priceOnline: number;
  priceAtHotel: number;
  imgUrl: string;
  capacity: number;
  roomNumber?: string;
  floor?: string;
  amenities: Amenity[];
}

// Temporary fallback interface for backward compatibility
interface Room extends Partial<RoomDetails> {
  id: number;
  title: string;
  priceOnline: number;
  imgUrl: string;
  description?: string;
  amenities?: Amenity[];
}

interface ExtraItem {
  id: number;
  name: string;
  price: number;
  type: 'service' | 'restaurant' | 'bar';
  description?: string;
}

interface BookingStore {
  bookingId: number | null;
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  nights: number;
  selectedRoom: RoomDetails | Room | null;
  extras: ExtraItem[];
  guestInfo: GuestInfo;
  customerId: number | null;
  totalPrice: number;
  paymentMethod: 'online' | 'premise';
  updateBooking: (data: Partial<Omit<BookingStore, 'updateBooking' | 'resetBooking'>>) => void;
  resetBooking: () => void;
}

const initialBookingState: Omit<BookingStore, 'updateBooking' | 'resetBooking'> = {
  bookingId: null,
  checkIn: null,
  checkOut: null,
  guests: 1,
  nights: 1,
  selectedRoom: null,
  extras: [],
  guestInfo: {},
  customerId: null,
  totalPrice: 0,
  paymentMethod: 'online',
};

const cookieStorage: PersistStorage<BookingStore> = {
  getItem: (name) => {
    const value = Cookies.get(name);
    if (!value) return null;
    return JSON.parse(value);
  },
  setItem: (name, value) => {
    Cookies.set(name, JSON.stringify(value.state), { expires: 3 });
  },
  removeItem: (name) => {
    Cookies.remove(name);
  },
};

export const useBookingStore = create(
  persist<BookingStore>(
    (set) => ({
      ...initialBookingState,
      updateBooking: (data) => set((state) => ({ ...state, ...data })),
      resetBooking: () => set(initialBookingState),
    }),
    {
      name: 'booking-store',
      storage: cookieStorage,
    }
  )
);
