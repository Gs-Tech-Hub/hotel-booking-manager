import Image from 'next/image';

export default function Room() {
  const rooms = [
    { id: 1, image: "room1.jpg" },
    { id: 2, image: "room2.jpg" },
    { id: 3, image: "room3.jpg" },
    { id: 4, image: "room4.jpg" },
    { id: 5, image: "room5.jpg" },
    { id: 6, image: "room6.jpg" },
  ];

  return (
    <>
      <div className="back_re">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="title">
                <h2>Our Room</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="our_room">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="titlepage">
                <p className="margin_0">Lorem Ipsum available, but the majority have suffered</p>
              </div>
            </div>
          </div>
          
          <div className="row">
            {rooms.map((room) => (
              <div key={room.id} className="col-md-4 col-sm-6">
                <div id="serv_hover" className="room">
                  <div className="room_img">
                    <figure>
                      <Image src={`/images/${room.image}`} alt={`Room ${room.id}`} layout="responsive" width={500} height={300} />
                    </figure>
                  </div>
                  <div className="bed_room">
                    <h3>Bed Room</h3>
                    <p>If you are going to use a passage of Lorem Ipsum, you need to be sure there</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
} 