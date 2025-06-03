import { BookingItem } from "@/types/bookingItem";

type DepartmentKey = 'bar' | 'restaurant' | 'hotel' | 'games' | 'account' | 'gym-and-sports';

interface DepartmentItem {
    id: number;
    documentId: number | string | null;
    name: string;
    price: number;
    quantity: number;
    paymentMethods: string;
    amountPaid: number;
    department: string;
}

export const itemsByDepartment = (bookingItems: BookingItem[]): Record<DepartmentKey, DepartmentItem[]> => {
    const itemsByDept: Record<DepartmentKey, DepartmentItem[]> = {
        bar: [],
        restaurant: [],
        hotel: [],
        games: [],
        account: [],
        'gym-and-sports': [],
    };

    for (const item of bookingItems) {
        const { id, documentId, drinks, food_items, hotel_services, games, product_count, payment_type, amount_paid } = item;

        // Function to safely access product count
        const getProductCount = (i: number) => product_count?.[i]?.product_count ?? 1;

        // Process drinks
        if (drinks.length > 0) {
            drinks.forEach((drink, i) => {
                            itemsByDept.bar.push({
                                id,
                                documentId: item.bookings?.[0]?.id ?? documentId ?? null,
                                name: drink.name ?? 'Bar Item', // Fallback to 'Bar Item'
                                price: drink.price ?? 0, // Default to 0 if price is missing
                                quantity: getProductCount(i),
                                paymentMethods: payment_type?.types?.toLowerCase() ?? 'cash', // Fallback to 'cash'
                                amountPaid: amount_paid ?? 0, // Default to 0 if amount_paid is missing
                                department: 'bar'
                            });
                        });
        }

        // Process food items
        if (food_items.length > 0) {
            food_items.forEach((food, i) => {
                itemsByDept.restaurant.push({
                    id,
                    documentId: item.bookings?.[0]?.id ?? documentId ?? null,
                    name: food.name ?? 'Restaurant Item', // Fallback to 'Restaurant Item'
                    price: food.price ?? 0, // Default to 0 if price is missing
                    quantity: getProductCount(i),
                    paymentMethods: payment_type?.types?.toLowerCase() ?? 'cash', // Fallback to 'cash'
                    amountPaid: amount_paid ?? 0, // Default to 0 if amount_paid is missing
                    department: 'restaurant'
                });
            });
        }

        // Process hotel services
        if (hotel_services.length > 0) {
            hotel_services.forEach((svc, i) => {
                itemsByDept.hotel.push({
                    id,
                    documentId: item.bookings?.[0]?.id ?? documentId ?? null,
                    name: svc.name ?? 'Hotel Service', // Fallback to 'Hotel Service'
                    price: svc.price ?? 0, // Default to 0 if price is missing
                    quantity: getProductCount(i),
                    paymentMethods: payment_type?.types?.toLowerCase() ?? 'cash', // Fallback to 'cash'
                    amountPaid: amount_paid ?? 0, // Default to 0 if amount_paid is missing
                    department: 'hotel'
                });
            });
        }

        // Process games
        if (games.length > 0) {
            games.forEach((game, i) => {
                itemsByDept.games.push({
                    id,
                    documentId: item.bookings?.[0]?.id ?? documentId ?? null,
                    name: game.name ?? 'Game', // Fallback to 'Game'
                    price: game.amount_paid ?? 0, // Default to 0 if price is missing
                    quantity: getProductCount(i),
                    paymentMethods: payment_type?.types?.toLowerCase() ?? 'cash', // Fallback to 'cash'
                    amountPaid: amount_paid ?? 0, // Default to 0 if amount_paid is missing
                    department: 'games'
                });
            });
        }

        // Process account items (for payment)
        if (
            drinks.length === 0 &&
            food_items.length === 0 &&
            hotel_services.length === 0 &&
            games.length === 0 &&
            item.amount_paid
        ) {
            itemsByDept.account.push({
                id,
                documentId: item.bookings?.[0]?.id ?? documentId ?? null,
                name: 'Account Payment', // Use a generic name for account items
                price: item.amount_paid,
                quantity: 1,
                paymentMethods: payment_type?.types?.toLowerCase() ?? 'cash', // Fallback to 'cash'
                amountPaid: amount_paid ?? 0, // Default to 0 if amount_paid is missing
                department: 'account'
            });
        }
    }

    return itemsByDept;
};
