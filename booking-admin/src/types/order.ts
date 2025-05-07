export interface CartItem {
    id: number;
    documentId: string;
    name: string;
    price: number;
    quantity: number;
    paymentMethod?: string;
    department?: string;
    menu_category?: string;
    count: number;
    amount_paid: number;
    amount_owed: number;
    game_status: string;
    waiterId?: string;
    customerName?: string;
  }
  
  export interface ConnectedItem {
    id: string ;
    documentId?: string;
    bar_stock?: number;
  }

 export interface ValidatedItem { 
  id: string; 
  documentId?: string; 
  bar_stock?: number
  }[] = [];


  export interface OrderItem {
      id: number;
      documentId: string;
      name: string;
      price: number;
      quantity: number;
      paymentMethod?: string;
      department?: string;
      menu_category?: string;
      count: number;
      amount_paid: number;
      amount_owed: number;
      game_status: string;
      waiterId: string;
      customerId?: string | null;
      customerName: string;
  }

  export type PaymentMethodType = "cash" | "card" | "bank_transfer";

        export interface PaymentMethod {
        id: number;
        documentId: string;
        type: PaymentMethodType;
        }


        export interface Order {
          id: string;
          customerName: string;
          tableNumber?: string;
          waiterId: string;
          items: CartItem[];
          status: "active" | "completed";
          totalAmount: number;
          discountPrice?: number;
          finalPrice?: number;
          selectedStaffId?: string;
          paymentMethod?: PaymentMethod;

        }