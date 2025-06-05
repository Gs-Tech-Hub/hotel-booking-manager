export interface Drink {
    id: number;
    documentId: string;
    name: string;
    description: string | null;
    price: number;
    type: string | null;
    quantity: number;
    threshold: number | null;
    availability: boolean;
    sold: number | null;
    bar_stock: number | null;
    restaurant_stock: number | null;
    supplied: number | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface FoodItem {
    id: number;
    name: string;
    price: number;

    // Add more fields as needed
}

export interface HotelService {
    id: number;
    name: string;
    price: number;

    // Add more fields as needed
}

export interface GymMembership {
    id: number;
    name: string;
    price: number;

    // Add more fields as needed
}

export interface Game {
    id: number;
    name: string;
    amount_paid: number;

    // Add more fields as needed
}

export interface Booking {
    id: number;
}

export interface ProductCount {
    id: number;
    documentId: string;
    product_count: number;
    total_amount: number | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface PaymentType {
    id: number;
    documentId: string;
    types: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface BookingItem {
    id: number;
    documentId: string;
    quantity: number;
    amount_paid?: number;
    status?: string;
    drinks: Drink[];
    food_items: FoodItem[];
    hotel_services: HotelService[];
    games: Game[];
    product_count: ProductCount[];
    gym_membership: GymMembership[];
    sport_membership: GymMembership[];
    bookings: Booking[];
    payment_type?: PaymentType;
    food_type: string | null;
    drink_type: string | null;
    menu_category: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}
