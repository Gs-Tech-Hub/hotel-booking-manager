// /store/bookingStore.ts
import {create} from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface GuestInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  street?: string;
  zip?: number;
  state?: string;
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
  documentId: string;
  name: string;
  price: number;
  type: 'food' | 'drink';
}

export interface MenuType {
  documentId: string;
  categoryName: string;
}

const menuTypes: MenuType[] = [
  {
    documentId: "wmag1r014mv0iuzsfcv50cwj",
    categoryName: "Breakfast",
  },
  {
    documentId: "xd34vgdgpqjfk2ryjtebegyl",
    categoryName: "Lunch",
  },
  {
    documentId: "svjzbgy4a8cwb8q0bm0kjp00",
    categoryName: "Dinner",
  }
];

interface ExtraItem {
  id: number;
  name: string;
  price: number;
  type: 'service';
  description?: string;
}

export interface SelectedMenu {
  localId: string;
  item: MenuItem;
  menuType: MenuType;
  count: number;
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
  selectedMenus: SelectedMenu[];
  removeSelectedMenu: (itemId: number, menuType: MenuType) => void; // Function to remove selected menu
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
  selectedMenuType: menuTypes[0], // Default to 'breakfast'
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
      updateSelectedMenu: ( item: MenuItem, menuType: MenuType) =>
        set((state) => {
          const existingIndex = state.selectedMenus.findIndex(
            (m) => m.item.id === item.id && m.menuType === menuType
          );
      
          if (existingIndex !== -1) {
            // Increment the count
            const updatedMenus = [...state.selectedMenus];
            updatedMenus[existingIndex].count += 1;
            return { selectedMenus: updatedMenus };
          } else {
            // Add new with count = 1
            return {
              selectedMenus: [
                ...state.selectedMenus,
                { localId: crypto.randomUUID(), item, menuType, count: 1 },
              ],
            };
          }
        }),
      
        removeSelectedMenu: (itemId: number, menuType: MenuType) =>
          set((state) => {
            const existingIndex = state.selectedMenus.findIndex(
              (m) => m.item.id === itemId && m.menuType === menuType
            );
        
            if (existingIndex === -1) return { selectedMenus: state.selectedMenus };
        
            const updatedMenus = [...state.selectedMenus];
            const current = updatedMenus[existingIndex];
        
            if (current.count > 1) {
              current.count -= 1;
            } else {
              updatedMenus.splice(existingIndex, 1);
            }
        
            return { selectedMenus: updatedMenus };
          }),
      resetBooking: () => set(initialBookingState),
    }),
    {
      name: 'booking-store',
      storage: cookieStorage,
    }
  )
);
