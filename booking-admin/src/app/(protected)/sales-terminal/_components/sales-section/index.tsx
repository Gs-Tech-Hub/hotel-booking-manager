// components/pos/POSLayout.tsx
import MenuGrid from './menu-grid';
import OrderDetailsModal from './order-details-modal';
import { useState } from 'react';
import OrdersList from './orders-list';
import CartSidebar from './chart-sidebar';
import { useOrderStore, Order } from '@/app/stores/useOrderStore';
import { MenuItem } from '@/app/stores/useCartStore';
import { useAuth } from '@/components/Auth/context/auth-context'; // Assuming useAuth is imported

type PosMenuProps = {
  menuItems: MenuItem[];
  onDepartmentChange: (department: 'Bar' | 'Restaurant' | 'Hotel-Services') => void;
};


export default function POSLayout(props: PosMenuProps) {
  const [isOrderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [department, setDepartment] = useState<'Bar' | 'Restaurant' | 'Hotel-Services'>('Bar');



  const orders = useOrderStore((state) => state.orders);
  const setOrders = useOrderStore((state) => state.setOrders);
  const { user } = useAuth(); // Assuming useAuth is imported

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
    setActiveOrder(order);
  };

  const handleDepartmentChange = (value: 'Bar' | 'Restaurant' | 'Hotel-Services') => {
    setDepartment(value);
    props.onDepartmentChange(value);
  };
  

  const handleCreateOrder = (order: Order) => {
    const { customerName, tableNumber, waiterId, items } = order;
    if (!customerName || !tableNumber || !waiterId || items.length === 0) {
      console.error('Invalid order details');
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
    }; 

    setOrders([...orders, newOrder]);
    console.log('Order added to list:', newOrder);
  };

  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
         <select
          className="form-select w-auto"
          value={department}
          onChange={(e) => handleDepartmentChange(e.target.value as 'Bar' | 'Restaurant' | 'Hotel-Services')}
        > 
          <option value="Bar">BAR</option>
          <option value="Restaurant">RESTAURANT</option>
          <option value="Hotel-Services">HOTEL SERVICES</option>

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
