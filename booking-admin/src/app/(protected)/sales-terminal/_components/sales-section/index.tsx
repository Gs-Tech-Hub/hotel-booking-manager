// components/pos/POSLayout.tsx
import MenuGrid from './menu-grid';
import OrderDetailsModal from './order-details-modal';
import { useState } from 'react';
import OrdersList from './orders-list';
import CartSidebar from './cart-sidebar';
import { useOrderStore, Order } from '@/app/stores/useOrderStore';
import { MenuItem } from '@/app/stores/useCartStore';
import { useCartStore } from '@/app/stores/useCartStore'; // <-- you already have this store for MenuItem[]

import { toast } from "react-toastify";


type PosMenuProps = {
  menuItems: MenuItem[];
  onDepartmentChange: (department: 'bar' | 'restaurant' | 'hotel') => void;
  loading: boolean;
};


export default function POSLayout(props: PosMenuProps) {
  const [isOrderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [department, setDepartment] = useState<'bar' | 'restaurant' | 'hotel'>('bar');
  const cartItems = useCartStore((state) => state.cartItems); // get cart items





  const orders = useOrderStore((state) => state.orders);
  const setOrders = useOrderStore((state) => state.setOrders);

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
    setActiveOrder(order);
  };

  const handleDepartmentChange = (value: 'bar' | 'restaurant' | 'hotel') => {
    if (activeOrder) {
      toast.error('Cannot change department while an active order exists.');
      return;
    }
    setDepartment(value);
    props.onDepartmentChange(value);
  };
  

  const handleCreateOrder = (order: Order) => {
    const { customerName, tableNumber, waiterId, items, discountPrice, finalPrice, selectedStaffId } = order;

    if (!customerName || !tableNumber || !waiterId || items.length === 0) {
      // console.error('Invalid order details');
      return;
    }

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const newOrder: Order = {
      id: (orders.length + 1).toString(),
      customerName,
      tableNumber,
      waiterId,
      items,
      status: 'active',
      totalAmount,
      discountPrice: discountPrice || 0, // Use the passed discountPrice
      finalPrice: finalPrice || totalAmount, // Use the passed finalPrice
      selectedStaffId: selectedStaffId || '', // Use the passed selectedStaffId
    };

    setOrders([...orders, newOrder]);
    setActiveOrder(newOrder);
    // console.log('Order added to list:', newOrder);
  };

  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
         <select
          className="form-select w-auto"
          value={department}
          onChange={(e) => handleDepartmentChange(e.target.value as 'bar' | 'restaurant' | 'hotel')}
          disabled={!!activeOrder || cartItems.length > 0 || props.loading} // disable if activeOrder exists OR cart is not empty
          > 
          <option value="bar">BAR</option>
          <option value="restaurant">RESTAURANT</option>
          <option value="hotel">HOTEL SERVICES</option>

        </select>

        {/* Order Details Modal */}
        {isOrderDetailsOpen && selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setOrderDetailsOpen(false)}
          />
        )}
      {/* Orders List at the Top */}
      <div className="col-span-3">
        <OrdersList onViewOrderDetails={handleViewOrderDetails} />
      </div>

      {/* Menu Grid */}
      <div className="lg:col-span-2 space-y-4">
        <MenuGrid menuItems={props.menuItems} />
      </div>

      {/* Chart Sidebar */}
      <div className="lg:col-span-1">
        <CartSidebar 
        onCreateOrder={handleCreateOrder}
        prefillOrder={activeOrder}  
        />
      </div>
    </div>
  );
}
