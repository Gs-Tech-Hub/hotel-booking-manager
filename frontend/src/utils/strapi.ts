interface GuestInfo {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }
export const getOrCreateCustomer = async (guestInfo: GuestInfo) => {
    const existing = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/customers?filters[email][$eq]=${guestInfo.email}`,
      {
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}` },
      }
    );
    const existingData = await existing.json();
  
    if (existingData.data.length > 0) {
      return existingData.data[0];
    } else {
      const created = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
            data: {
              FirstName: guestInfo.firstName,
              lastName: guestInfo.lastName,
              email: guestInfo.email,
              phone: guestInfo.phone ? parseInt(guestInfo.phone, 10) : null,
            },
          }),
      });
      const newCustomer = await created.json();
      console.log('newCustomer', newCustomer);
      return existingData.data[0];
    }
  };
  
  export const createBookingIfNotExists = async (store: any) => {
    if (!store.bookingId) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/boookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            checkin: store.checkIn,
            checkout: store.checkOut,
            room: store.selectedRoom?.documentId,
            customer: store.customerId,
          },
        }),
      });
      const result = await res.json();
      console.log('result', result);
      return result.data;
    }
    return store.bookingId;
  };
  