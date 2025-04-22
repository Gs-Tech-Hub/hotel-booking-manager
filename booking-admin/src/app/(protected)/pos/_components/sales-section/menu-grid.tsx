// components/pos/MenuGrid.tsx
import { useCartStore } from "@/app/stores/useCartStore";
import { Button } from "@/components/ui-elements/button";
import { Card } from "@/components/ui-elements/card";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

const menuItems = [
  { id: 1, name: "Burger", price: 10, available: 20 },
  { id: 2, name: "Fries", price: 5, available: 30 },
  { id: 3, name: "Pizza", price: 15, available: 10 },
  { id: 4, name: "Soda", price: 3, available: 50 },
];

export default function MenuGrid() {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (item: typeof menuItems[0]) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Menu</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {menuItems.map((item) => (
          <Card
            key={item.id}
            title={item.name}
            content={
              <>
                <p className="text-lg text-gray-500">Price: ${item.price}</p>
                <p className="text-sm text-gray-500">Available: {item.available}</p>
                <Button
                  label="Add to Cart"
                  onClick={() => handleAddToCart(item)}
                  className="mt-2 px-2 py-1 bg-blue-600 text-white rounded"
                  size="small"
                  variant="dark"
                />
              </>
            }
          />
        ))}
      </div>
    </div>
  );
}
