import Image from 'next/image';

interface GalleryImage {
  id: number;
  image: string;
  alt: string;
}

interface GalleryProps {
  images: GalleryImage[];
}

export default function Gallery({ images }: GalleryProps) {
  return (
    <div className="gallery">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="titlepage">
              <h2>gallery</h2>
            </div>
          </div>
        </div>
        <div className="row">
          {images.map((image) => (
            <div key={image.id} className="col-md-3 col-sm-6">
              <div className="gallery_img">
                <figure>
                  <Image src={`/images/${image.image}`} alt={image.alt} layout="responsive" width={500} height={300} />
                </figure>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
