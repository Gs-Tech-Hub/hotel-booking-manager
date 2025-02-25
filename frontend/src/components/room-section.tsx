import Image from 'next/image';

export default function RoomSection() {
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
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div key={num} className="col-md-4 col-sm-6">
              <div id="serv_hover" className="room">
                <div className="room_img">
                  <figure>
                    <Image src={`/images/room${num}.jpg`} alt={`Room ${num}`} layout="responsive" width={500} height={300} />
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
  )
}
