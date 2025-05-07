
export interface CartItem {
  id: number;
  documentId: string;
  name: string;
  price: number;
  quantity: number;
  paymentMethod?: string;
  department?: string;
  menu_category?: string;
  productCountId?: { productCountId: number }[];
  count: number;
  amount_paid: number;
  amount_owed: number;
  game_status: string;
}

export interface OrderItem {
    id: number;
    documentId: string;
    name: string;
    price: number;
    quantity: number;
    paymentMethod?: string;
    department?: string;
    menu_category?: string;
    productCountId: { productCountId: number }[];
    count: number;
    amount_paid: number;
    amount_owed: number;
    game_status: string;
    waiterId: string;
    customerId?: string | null;
    customerName: string;
}

interface NormalizedOrder {
    items: OrderItem[];
    status: string;
    totalAmount: number;
}

export const normalizeCartItemsToOrderItems = (cartItems: CartItem[]): NormalizedOrder => {
    const items: OrderItem[] = cartItems.map((item) => ({
      id: item.id,
      documentId: item.documentId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      paymentMethod: item.paymentMethod,
      department: item.department,
      menu_category: item.menu_category,
      productCountId: item.productCountId?.map(pc => ({
        productCountId: pc.productCountId,
      })) || [],
      count: item.quantity,
      amount_paid: 0,
      amount_owed: item.price * item.quantity,
      game_status: 'pending',
      waiterId: '',
      customerId: null,
      customerName: ''
    }));
  
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
    return {
      items,
      status: 'pending',
      totalAmount,
    };
  };
  