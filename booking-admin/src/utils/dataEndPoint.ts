/* eslint-disable */

import qs from "qs";
import ApiHandler from "@/utils/apiHandler";
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const apiHandlerInstance = ApiHandler({ baseUrl });

interface BookingItemPayload {
  quantity: number;
  food_items: { id: string }[] | null;
  drinks: { id: string }[] | null;
  menu_category: { id: string;} | null;
}

// Main service function
export const strapiService = {
  async fetch(endpoint: string, params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`${endpoint}${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  async post(endpoint: string, body: any) {
    const result = await apiHandlerInstance.createData({ endpoint, data: body });
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  async put(endpoint: string, id: string | number, body: any) {
    const result = await apiHandlerInstance.updateData({ endpoint, id, updatedData: body });
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  async delete(endpoint: string, id: string | number) {
    const result = await apiHandlerInstance.deleteData({ endpoint, id });
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  buildUrl(endpoint: string, params?: Record<string, string | number | boolean>) {
    const url = new URL(`${baseUrl}/${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    return url.toString();
  },   
  
  // find items by id
  async findDrinkByDocumentId(documentId: string, drinkId: number | string) {
    const query = qs.stringify({
      filters: {
        documentId: {
          $eq: documentId,
        },
      },
      populate: ['drinks'],
      encodeValuesOnly: true,
    });
  
    const result = await apiHandlerInstance.fetchData(`bar-and-clubs?${query}`);
  
    if (result.error) throw new Error(result.error?.message || 'Failed to fetch bar data');
  
    const bar = result.data?.[0];
    if (!bar) throw new Error(`Bar with documentId "${documentId}" not found`);
  
    const drink = bar.drinks?.find((d: any) => d.id === Number(drinkId));
    if (!drink) throw new Error(`Drink with ID ${drinkId} not found in bar "${documentId}"`);
  
    return drink;
  },  
  // Booking related methods
  async createBooking(bookingData: any) {
    const result = await apiHandlerInstance.createData({ 
      endpoint: "boookings", 
      data: bookingData 
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  async createOrGetBooking(bookingData: any) {
    const booking = await this.createBooking(bookingData);
    return booking.documentId;
  },
  
  //get bookings
  async getBookings(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`boookings${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  async createBookingItem(itemData: BookingItemPayload) {
    const result = await apiHandlerInstance.createData({ 
      endpoint: "booking-items", 
      data: itemData 
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  // Get booking items
  async getBookingItems(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`booking-items${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },

 async findCustomerByPhoneOrEmail(input: any) {
    const query = qs.stringify({
      filters: {
        $or: [
          { email: { $eq: input } },
          { phone: { $eq: input } },
        ]
      }
    });
    const result = await apiHandlerInstance.fetchData(`customers?${query}`);
    if (result.error) throw new Error(result.error);
  
    return result.data?.[0] || null;
  },
  

  // Customer related methods
  async createCustomer(customerData: any) {
    const result = await apiHandlerInstance.createData({ 
      endpoint: "customers", 
      data: customerData 
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  async createOrGetCustomer(customerData: any) {
    const query = qs.stringify({
      filters: {
        $or: [
          { email: { $eq: customerData.email } },
          { phone: { $eq: customerData.phone } },
        ]
      }      
    });
    const result = await apiHandlerInstance.fetchData(`customers?${query}`);
    if (result.error) throw new Error(result.error);
    
    const existing = result.data;
    if (existing && existing.length > 0) {
      return existing[0].documentId;
    }
    const customer = await this.createCustomer(customerData);
    return customer.documentId;
  },

  // Payment related methods
  async createTransaction(paymentData: any) {
    const result = await apiHandlerInstance.createData({ 
      endpoint: "payments", 
      data: paymentData 
    });
    if (result.error) throw new Error(result.error);
    return result.data.documentId;
  },

  //get transactions
  async getTransactions(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`payments${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  //get bar-and-clubs 
  async getBarAndClubs(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`bar-and-clubs${queryString}`); 
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  // get restaurants
  async getRestaurants(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`restaurants${queryString}`);
    if (result.error) throw new Error(result.error); 
    return result.data 
  },

  // get hotelServices
  async getHotelServices(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`hotel-services${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  // Menu related methods
  async getDrinksList(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`drinks${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  //update drinks Data
async updateDrinksList(drinkId: string | number, drinkData: any) {
  try {
    console.log("Updating drink with ID:", drinkId);
    const result = await apiHandlerInstance.updateData({
      endpoint: "drinks",
      id: drinkId,
      updatedData: drinkData,
    });

    if (result.error) throw new Error(result.error);
    return result.data;
  } catch (error) {
    console.error("Error updating drinks:", error);
    throw error; // rethrow or handle as needed
  }
 },


   // Games related methods
   async getGamesList(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`games${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },

   // Add a new game
   async createGame(gameData: any) {
    const result = await apiHandlerInstance.createData({
      endpoint: "games",
      data: gameData,
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  // Update an existing game
  async updateGame(gameId: string | number, gameData: any) {
    const result = await apiHandlerInstance.updateData({
      endpoint: "games",
      id: gameId,
      updatedData: gameData, 
    });
  
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  

  // Delete a game
  async deleteGame(gameId: string | number) {
    const result = await apiHandlerInstance.deleteData({
      endpoint: "games",
      id: gameId,
      
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  async loginUser(email: string, password: string) {
    try {
      console.log('Making login request to:', `${baseUrl}/auth/local`);
      const res = await apiHandlerInstance.createData({
        endpoint: "auth/local",
        data: {
          identifier: email,
          password,
        },
      });
  
      if (!res) {
        throw new Error('No response received from server');
      }
      
      if (res.error) {
        console.error('Login error response:', res.error);
        throw new Error(res.error.message || 'Authentication failed');
      }
      
      if (!res.jwt) {
        console.error('Invalid response format:', res);
        throw new Error('Invalid response format from server');
      }
  
      return {
        jwt: res.jwt,
        user: res.user,
      };
    } catch (error) {
      console.error('Login request failed:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to authenticate user');
    }
  },

  async verifyToken(token: string, userId: number) {
    try {
      console.log('Verifying token for user ID:', userId);
      const userProfile = await this.getUserProfileWithRole(userId);

      if (!userProfile) {
        console.error('User profile not found for ID:', userId);
        return { valid: false };
      }

      return { valid: true };
    } catch (error) {
      console.error('Token verification failed:', error);
      return { valid: false };
    }
  },

   //get users
  async getUsers(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result: { data?: any[]; error?: string } = await apiHandlerInstance.fetchData(`users${queryString}`);
    if (result.error) throw new Error(result.error);
    return result;
  },

  async getUserProfileWithRole(userId: number) {
    try {
      console.log('Fetching user profile for ID:', userId);
      const res = await apiHandlerInstance.fetchData(
        `users/${userId}?populate[role]=*`
      );
  
      if (!res) {
        throw new Error('No response received from server');
      }
      
      if (res.error) {
        console.error('Error fetching user profile:', res.error);
        throw new Error(res.error.message || 'Failed to fetch user profile');
      }
      
      // The response is the user data directly, not wrapped in a data property
      console.log('User profile response:', res);
      return res;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch user profile');
    }
  },
// get menu category 
  async getMenuCategory(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`menu-categories${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  // GET FOOD ITEMS
  async getFoodItems(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`food-items${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  // Create a new employee order with discount
  async createEmployeeOrder (orderData: any) {
    const result = await apiHandlerInstance.createData({ 
      endpoint: "employee-orders", 
      data: orderData 
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  }, 

  async getEmployeeOrders(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`employee-orders${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  } ,

  async getEmployeeSummary(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`employee-summaries${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  //get rooms
  async getRooms(params?: Record<string, string | number | boolean>) {
    const queryString = params
    ? '?' + new URLSearchParams(params as Record<string, string>).toString()
    : '';
    const result = await apiHandlerInstance.fetchData(`rooms${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },

  //create product count
  async createProductCount(productCountData: any) {
    const result = await apiHandlerInstance.createData({ 
      endpoint: "product-counts", 
      data: productCountData 
    });
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  
  getProductCounts(params?: Record<string, string | number | boolean>) {  
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    return apiHandlerInstance.fetchData(`product-counts${queryString}`);
  },

  //get job-application
  async getJobApplications(params?: Record<string, string | number | boolean>) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const result = await apiHandlerInstance.fetchData(`job-applications${queryString}`);
    if (result.error) throw new Error(result.error);
    return result.data;
  },
  
  // Additional utility methods can be added here following the same pattern
};

