import { BookingItem,  } from "@/types/bookingItem";
type DepartmentKey = 'bar' | 'restaurant' | 'hotel' | 'games' | 'account';


interface DepartmentItem {
    id: number;
    documentId: number | string | null;
    name: string;
    price: number;
    quantity: number;
}

export const itemsByDepartment = (bookingItems: BookingItem[]): Record<DepartmentKey, DepartmentItem[]> => {
    const itemsByDept: Record<DepartmentKey, DepartmentItem[]> = {
        bar: [],
        restaurant: [],
        hotel: [],
        games: [],
        account: [],
    };

    for (const item of bookingItems) {
        const { id, documentId, drinks, food_items, hotel_services, games, product_count } = item;

        if (drinks.length > 0) {
            drinks.forEach((drink, i) => {
                itemsByDept.bar.push({
                    id,
                    documentId: item.bookings?.[0]?.id ?? documentId ?? null,
                    name: drink.name,
                    price: drink.price ?? 0,
                    quantity: product_count?.[i]?.product_count ?? 1,
                });
            });
        }

        if (food_items.length > 0) {
            food_items.forEach((food, i) => {
                itemsByDept.restaurant.push({
                    id,
                    documentId: item.bookings?.[0]?.id ?? documentId ?? null,
                    name: food.name,
                    price: 0, // Fill in if `food.price` is available
                    quantity: product_count?.[i]?.product_count ?? 1,
                });
            });
        }

        if (hotel_services.length > 0) {
            hotel_services.forEach((svc, i) => {
                itemsByDept.hotel.push({
                    id,
                    documentId: item.bookings?.[0]?.id ?? documentId ?? null,
                    name: svc.name,
                    price: 0, // Fill in if price available
                    quantity: product_count?.[i]?.product_count ?? 1,
                });
            });
        }

        if (games.length > 0) {
            games.forEach((game, i) => {
                itemsByDept.games.push({
                    id,
                    documentId: item.bookings?.[0]?.id ?? documentId ?? null,
                    name: game.name,
                    price: 0, // Fill in if price available
                    quantity: product_count?.[i]?.product_count ?? 1,
                });
            });
        }

        // If item has amount_paid or no department matches, categorize under account
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
                name: item.payment_type?.types ?? 'Account',
                price: item.amount_paid,
                quantity: 1,
            });
        }
    }

    return itemsByDept;
};
