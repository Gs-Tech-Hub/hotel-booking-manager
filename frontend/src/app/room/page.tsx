import RoomSection from '@/components/room-section';

const roomData = [
  {
    id: 1,
    title: 'Deluxe Room',
    imgUrl: 'room1.jpg',
    description: 'If you are going to use a passage of Lorem Ipsum, you need to be sure there.',
    price: 100,
    amenities: [],
  },
  {
    id: 2,
    title: 'Suite Room',
    imgUrl: 'room2.jpg',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    price: 150,
    amenities: [],
  },
  {
    id: 3,
    title: 'Single Room',
    imgUrl: 'room3.jpg',
    description: 'Lorem Ipsum has been the industry standard dummy text ever since the 1500s.',
    price: 80,
    amenities: [],
  },
  // Add more rooms as needed
];

export default function RoomPage() {
  return <RoomSection rooms={roomData} />;
} 