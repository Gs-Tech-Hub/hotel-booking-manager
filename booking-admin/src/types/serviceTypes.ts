     // Process other services data
   export interface MenuCategory {
        categoryName: string;
      }
  
     export interface ServiceItem {
        amount_paid?: number;
        status?: string;
        menu_category?: MenuCategory;
      }
  