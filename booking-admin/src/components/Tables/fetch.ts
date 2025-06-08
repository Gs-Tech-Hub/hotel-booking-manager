export async function getTopProducts() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return [
    {
      image: "/images/product/product-01.png",
      name: "Apple Watch Series 7",
      category: "Electronics",
      price: 296,
      sold: 22,
      profit: 45,
    },
    {
      image: "/images/product/product-02.png",
      name: "Macbook Pro M1",
      category: "Electronics",
      price: 546,
      sold: 12,
      profit: 125,
    },
    {
      image: "/images/product/product-03.png",
      name: "Dell Inspiron 15",
      category: "Electronics",
      price: 443,
      sold: 64,
      profit: 247,
    },
    {
      image: "/images/product/product-04.png",
      name: "HP Probook 450",
      category: "Electronics",
      price: 499,
      sold: 72,
      profit: 103,
    },
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

export async function getGuestList() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const data = [
    {
      bookingId: "BK-202401",
      name: "John Doe",
      roomType: "Deluxe Suite",
      roomNumber: "101",
      duration: 3,
      checkin: "2025-04-20",
      checkout: "2025-04-23",
      status: "Confirmed",
    },
    {
      bookingId: "BK-202402",
      name: "Jane Smith",
      roomType: "Standard Room",
      roomNumber: "204",
      duration: 2,
      checkin: "2025-04-18",
      checkout: "2025-04-20",
      status: "Pending",
    },
    {
      bookingId: "BK-202403",
      name: "Michael Lee",
      roomType: "Executive Suite",
      roomNumber: "305",
      duration: 5,
      checkin: "2025-04-15",
      checkout: "2025-04-20",
      status: "Cancelled",
    },
    {
      bookingId: "BK-202404",
      name: "Aisha Bello",
      roomType: "Single Room",
      roomNumber: "110",
      duration: 1,
      checkin: "2025-04-22",
      checkout: "2025-04-23",
      status: "Confirmed",
    },
    {
      bookingId: "BK-202405",
      name: "Carlos Mendoza",
      roomType: "Double Room",
      roomNumber: "217",
      duration: 4,
      checkin: "2025-04-25",
      checkout: "2025-04-29",
      status: "Confirmed",
    },
  ];
  data.sort(
    (a, b) =>
      new Date(a.checkin).getTime() - new Date(b.checkin).getTime()
  );
  return data;
}