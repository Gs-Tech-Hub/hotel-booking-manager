import Image from 'next/image';

export default function Rooms() {
    return (
      <div>
        <h1 className="text-3xl font-bold">Rooms</h1>
        <p className="mt-2">Explore our available rooms.</p>
        <Image src="/images/rooms.jpg" alt="Rooms" width={500} height={300} />
      </div>
    );
  }
  