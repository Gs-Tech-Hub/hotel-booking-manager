// components/pos/POSLayout.tsx
import MenuGrid from './menu-grid';
import OrderDetailsModal from './order-details-modal';
import { useState } from 'react';
import OrdersList from './orders-list';
import CartSidebar from './chart-sidebar';
import { useOrderStore, Order } from '@/app/stores/useOrderStore';

export default function POSLayout() {
  const [isOrderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);


  const orders = useOrderStore((state) => state.orders);
  const setOrders = useOrderStore((state) => state.setOrders);

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
    setActiveOrder(order);
  };
 
  const handleCreateOrder = ({
    customerName,
    tableNumber,
    waiterName,
    items,
  }: {
    customerName: string;
    tableNumber: string;
    waiterName: string;
    items: Order['items'];
  }) => {
    if (!customerName || !tableNumber || !waiterName || items.length === 0) {
      console.error('Invalid order details');
      return;
    }

    const newOrder: Order = {
      id: (orders.length + 1).toString(),
      customerName,
      tableNumber,
      waiterName,
      items,
      status: 'active',
    };

    setOrders([...orders, newOrder]);
    console.log('Order added to list:', newOrder);
  };

  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
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
        <MenuGrid />
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
