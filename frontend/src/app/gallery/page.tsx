// Gallery page 

import Image from 'next/image';

export default function Gallery() {
  const galleryImages = [
    { id: 1, image: "gallery/gallery1.jpg" },
    { id: 2, image: "gallery/gallery2.jpg" },
    { id: 3, image: "gallery/gallery3.jpg" },
    { id: 4, image: "gallery/gallery4.jpg" },
    { id: 5, image: "gallery/gallery5.jpg" },
    { id: 6, image: "gallery/gallery6.jpg" },
    { id: 7, image: "gallery/gallery7.jpg" },
    { id: 8, image: "gallery/gallery8.jpg" },
  ];

  return (
    <>
      <div className="back_re">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="title">
                <h2>gallery</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="gallery">
        <div className="container">
          <div className="row">
            {galleryImages.map((item) => (
              <div key={item.id} className="col-md-3 col-sm-6">
                <div className="gallery_img">
                  <figure>
                    <Image src={`/images/${item.image}`} alt={`Gallery image ${item.id}`} layout="responsive" width={500} height={300} />
                  </figure>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
} 