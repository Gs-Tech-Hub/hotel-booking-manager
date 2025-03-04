import Image from 'next/image';

interface Room {
  id: number;
  title: string;
  imgUrl: string;
  description: string;
  price: number;
  amenities: { 
    name: string;
    icon: { 
      formats: { 
        thumbnail: { url: string } 
      } 
    } 
  }[];
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
                  <ul>
                    {room.amenities.map((amenity) => (
                      <li key={amenity.name}>
                        {amenity.icon && amenity.icon.formats && amenity.icon.formats.thumbnail ? (
                          <img src={amenity.icon.formats.thumbnail.url} alt={amenity.name} width={156} height={156} />
                        ) : (
                          <span>something is missing </span>
                        )}
                        {amenity.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
