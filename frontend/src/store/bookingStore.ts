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
  documentId: string;
  title: string;
  description: string;
  priceOnline: number;
  pricePremise: number;
  roomTotalPrice: number;
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
  pricePremise: number;
  imgUrl: string;
  description?: string;
  amenities?: Amenity[];
}

interface MenuItem {
  id: number;
  name: string;
  price: number;
}

export type MenuType = 'Breakfast' | 'Lunch' | 'Dinner';


interface ExtraItem {
  id: number;
  name: string;
  price: number;
  type: 'service' | 'restaurant' | 'bar';
  description?: string;
}

interface BookingStore {
  bookingId: number | null;
  checkin: string | null;
  checkout: string | null;
  guests: number;
  nights: number;
  selectedRoom: RoomDetails | Room | null;
  extras: ExtraItem[];
  guestInfo: GuestInfo;
  customerId: number | null;
  totalPrice: number;
  roomTotalPrice: number;
  paymentMethod: 'online' | 'premise';
  stayDate: string | null;
  stayStartTime: string;
  stayEndTime: string;
  stayPrice: number;
  selectedMenus: { item: MenuItem; menuType: MenuType }[];
  removeSelectedMenu: (itemId: number) => void; // Function to remove selected menu
  selectedMenuType: MenuType; // Add selected menu type here
  updateBooking: (data: Partial<Omit<BookingStore, 'updateBooking' | 'resetBooking'>>) => void;
  updateSelectedMenu: (item: MenuItem, menuType: MenuType) => void; // Function to update selected menu
  resetBooking: () => void;
}

const initialBookingState: Omit<BookingStore, 'updateBooking' | 'updateSelectedMenu' | 'resetBooking'> = {
  bookingId: null,
  checkin: null,
  checkout: null,
  guests: 1,
  nights: 1,
  selectedRoom: null,
  extras: [],
  guestInfo: {},
  customerId: null,
  totalPrice: 0,
  roomTotalPrice: 0,
  paymentMethod: 'online',
  stayDate: null,
  stayStartTime: '',
  stayEndTime: '',
  stayPrice: 0,
  selectedMenus: [], // Initialize with empty array
  removeSelectedMenu: () => {}, // Placeholder function
  selectedMenuType: 'Lunch', // Default to 'Lunch'
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
      updateSelectedMenu: (item, menuType) => set((state) => ({
        ...state,
        selectedMenus: [...state.selectedMenus, { item, menuType }],
      })),
      removeSelectedMenu: (itemId: number) => set((state) => ({
        ...state,
        selectedMenus: state.selectedMenus.filter(
          (menu) => menu.item.id !== itemId
        ),
      })),
      resetBooking: () => set(initialBookingState),
    }),
    {
      name: 'booking-store',
      storage: cookieStorage,
    }
  )
);
