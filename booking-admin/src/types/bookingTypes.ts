export interface Room {
    title?: string;
    price?: number;
    imgUrl?: string; // renamed from imgUrl for consistency
  }
  
  export interface Payment {
    paymentMethod?: 'cash' | 'bank_transfer' | 'card';
    PaymentStatus?: 'success' | 'pending' | 'declined'; 
  }
  
  export interface Customer {
    id?: number;
    documentId?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
  }
  
  export interface Booking {
    checkin: string;
    checkout: string;
    guests: number;
    nights: number;
    totalPrice: number;
    customer: Customer;
    payment: Payment;
    room: Room;
  }
  
  export interface BookingResponse {
    data: Booking[];
  }
  