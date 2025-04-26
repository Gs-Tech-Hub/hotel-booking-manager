      // Process booking data
    export  interface Room {
        price?: number;
       }
       
      export     interface Payment {
               PaymentStatus?: 'success' | 'debt';
               paymentMethod?: 'cash' | 'online';
           }
       
         export  interface Booking {
               room?: Room;
               nights?: number;
               payment?: Payment;
           }
       
       export  interface BookingResponse {
               data: Booking[];
           }