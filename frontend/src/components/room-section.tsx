import Image from 'next/image';

interface Room {
  id: number;
  image: string;
  title: string;
  description: string;
}

interface RoomSectionProps {
  rooms: Room[];
}

export default function RoomSection({ rooms }: RoomSectionProps) {
  return (
    <div className="our_room">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="titlepage">
              <h2>Our Room</h2>
              <p>Lorem Ipsum available, but the majority have suffered</p>
            </div>
          </div>
        </div>
        <div className="row">
          {rooms.map((room) => (
            <div key={room.id} className="col-md-4 col-sm-6">
              <div id="serv_hover" className="room">
                <div className="room_img">
                  <figure>
                    <Image src={`/images/${room.image}`} alt={room.title} layout="responsive" width={500} height={300} />
                  </figure>
                </div>
                <div className="bed_room">
                  <h3>{room.title}</h3>
                  <p>{room.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
