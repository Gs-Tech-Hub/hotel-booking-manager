import RoomSection from '@/components/room-section';

const roomData = [
  {
    id: 1,
    image: 'room1.jpg',
    title: 'Deluxe Room',
    description: 'If you are going to use a passage of Lorem Ipsum, you need to be sure there.'
  },
  {
    id: 2,
    image: 'room2.jpg',
    title: 'Suite Room',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
  },
  {
    id: 3,
    image: 'room3.jpg',
    title: 'Single Room',
    description: 'Lorem Ipsum has been the industry standard dummy text ever since the 1500s.'
  },
  // Add more rooms as needed
];

export default function RoomPage() {
  return <RoomSection rooms={roomData} />;
} 