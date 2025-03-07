import Image from 'next/image';

interface Amenity {
  id: number;
  name: string;
  icon: string;
}

interface Room {
  id: number;
  title: string;
  imgUrl: string;
  description: string;
  price: number;
  amenities: Amenity[];
  bed?: string;
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
              <p>Discover our luxurious rooms, designed for your comfort and relaxation.</p>
            </div>
          </div>
        </div>
        <div className="row">
          {rooms.map((room) => (
            <div key={room.id} className="col-md-4 col-sm-6">
              <div id="serv_hover" className="room">
                <div className="room_img">
                  <figure>
                    <Image src={room.imgUrl} alt={room.title} layout="responsive" width={375} height={232} />
                  </figure>
                </div>
                <div className="bed_room">
                  <h3>{room.title}</h3>
                  <p>{room.description}</p>
                  <p className="room-price">Price: ₦ {room.price}</p>
                  <p className="room-size">BED-SIZE: {room.bed ? room.bed : 'Size not specified'}</p>
                  <div className="amenities-section" style={{ textAlign: 'center' }}>
                    <h4 style={{ marginTop: '10px' }}>Amenities:</h4>
                    <ul style={{ display: 'flex', justifyContent: 'center', listStyleType: 'none', padding: 0 }}>
                      {room.amenities.map((amenity) => (
                        <li key={amenity.id} style={{ marginRight: '10px' }}>
                          {amenity.icon ? (
                            <Image src={amenity.icon} alt={amenity.name} width={20} height={20} />
                          ) : (
                            <span>Icon</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
