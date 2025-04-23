export async function getOverviewData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    views: {
      value: 15,
      date: 24,
    },
    profit: {
      value: 14,
      date: 24,
    },
    products: {
      value: 5,
      date: 24,
    },
    users: {
      value: 3,
      date: 24,
    },
  };
}

export async function getChatsData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      name: "Jacob Jones",
      profile: "/images/user/user-01.png",
      isActive: true,
      lastMessage: {
        content: "See you tomorrow at the meeting!",
        type: "text",
        timestamp: "2024-12-19T14:30:00Z",
        isRead: false,
      },
      unreadCount: 3,
    },
    {
      name: "Wilium Smith",
      profile: "/images/user/user-03.png",
      isActive: true,
      lastMessage: {
        content: "Thanks for the update",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "Johurul Haque",
      profile: "/images/user/user-04.png",
      isActive: false,
      lastMessage: {
        content: "What's up?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "M. Chowdhury",
      profile: "/images/user/user-05.png",
      isActive: false,
      lastMessage: {
        content: "Where are you now?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 2,
    },
    {
      name: "Akagami",
      profile: "/images/user/user-07.png",
      isActive: false,
      lastMessage: {
        content: "Hey, how are you?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
  ];
}


export async function getProductsListData() {
  return [
      // Soft Drinks
      { name: "Coca-Cola", category: "Drinks", type: "Soft", price: 1.5, quantity: 200, threshold: 50, availability: true, sold: 300, profit: 0.5 },
      { name: "Pepsi", category: "Drinks", type: "Soft", price: 1.5, quantity: 180, threshold: 50, availability: true, sold: 270, profit: 0.5 },
      { name: "Sprite", category: "Drinks", type: "Soft", price: 1.5, quantity: 160, threshold: 40, availability: true, sold: 250, profit: 0.5 },
      { name: "Fanta", category: "Drinks", type: "Soft", price: 1.5, quantity: 150, threshold: 40, availability: true, sold: 220, profit: 0.5 },
      { name: "Mountain Dew", category: "Drinks", type: "Soft", price: 1.7, quantity: 130, threshold: 30, availability: true, sold: 190, profit: 0.6 },
      { name: "7 Up", category: "Drinks", type: "Soft", price: 1.5, quantity: 120, threshold: 30, availability: true, sold: 170, profit: 0.5 },
    
      // Alcoholic Drinks
      { name: "Heineken", category: "Drinks", type: "Alcoholic", price: 3, quantity: 90, threshold: 25, availability: true, sold: 140, profit: 1 },
      { name: "Guinness", category: "Drinks", type: "Alcoholic", price: 3, quantity: 80, threshold: 20, availability: true, sold: 130, profit: 1 },
      { name: "Budweiser", category: "Drinks", type: "Alcoholic", price: 3.5, quantity: 85, threshold: 25, availability: true, sold: 120, profit: 1.2 },
      { name: "Red Wine", category: "Drinks", type: "Alcoholic", price: 12, quantity: 40, threshold: 10, availability: true, sold: 60, profit: 4 },
      { name: "White Wine", category: "Drinks", type: "Alcoholic", price: 12, quantity: 35, threshold: 10, availability: true, sold: 55, profit: 4 },
      { name: "Whiskey", category: "Drinks", type: "Alcoholic", price: 15, quantity: 25, threshold: 8, availability: true, sold: 40, profit: 6 },
      { name: "Vodka", category: "Drinks", type: "Alcoholic", price: 14, quantity: 28, threshold: 8, availability: true, sold: 38, profit: 5 },
    
      // Other Beverages
      { name: "Orange Juice", category: "Drinks", type: "Juice", price: 2.5, quantity: 100, threshold: 30, availability: true, sold: 160, profit: 0.9 },
      { name: "Apple Juice", category: "Drinks", type: "Juice", price: 2.5, quantity: 90, threshold: 25, availability: true, sold: 140, profit: 0.9 },
      { name: "Pineapple Juice", category: "Drinks", type: "Juice", price: 2.7, quantity: 85, threshold: 25, availability: true, sold: 130, profit: 1 },
      { name: "Bottled Water (500ml)", category: "Drinks", type: "Water", price: 1, quantity: 400, threshold: 100, availability: true, sold: 600, profit: 0.3 },
      { name: "Bottled Water (1L)", category: "Drinks", type: "Water", price: 1.5, quantity: 300, threshold: 80, availability: true, sold: 450, profit: 0.4 },
      { name: "Iced Tea", category: "Drinks", type: "Other", price: 2, quantity: 110, threshold: 30, availability: true, sold: 150, profit: 0.7 },
      { name: "Energy Drink", category: "Drinks", type: "Other", price: 2.5, quantity: 90, threshold: 25, availability: true, sold: 120, profit: 1 },
      { name: "Lemonade", category: "Drinks", type: "Other", price: 2, quantity: 95, threshold: 25, availability: true, sold: 135, profit: 0.8 },
    ];
  }

export async function getInvoiceTableData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1400));

  return [
    {
      name: "Free package",
      price: 0.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Paid",
    },
    {
      name: "Standard Package",
      price: 59.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Paid",
    },
    {
      name: "Business Package",
      price: 99.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Unpaid",
    },
    {
      name: "Standard Package",
      price: 59.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Pending",
    },
  ];
}

export async function getTopChannels() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return [
    {
      name: "Google",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
    },
    {
      name: "X.com",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
    },
    {
      name: "Github",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
    },
    {
      name: "Vimeo",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
    },
    {
      name: "Facebook",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
    },
  ];
}


