import Image from 'next/image';

export default function Bookings() {
    return (
      <div>
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="mt-2">Manage your bookings here.</p>
        <Image src="/images/bookings.jpg" alt="Bookings" width={500} height={300} />
      </div>
    );
  }
  