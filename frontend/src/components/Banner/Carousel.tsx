import Image from 'next/image';

// Define the type for the props
interface BannerCarouselProps {
  images: { src: string; alt: string }[];
}

export default function BannerCarousel({ images }: BannerCarouselProps) {
  return (
    <div id="myCarousel" className="carousel slide banner" data-ride="carousel">
      <ol className="carousel-indicators">
        {images.map((_, index) => (
          <li key={index} data-target="#myCarousel" data-slide-to={index} className={index === 0 ? "active" : ""}></li>
        ))}
      </ol>
      <div className="carousel-inner">
        {images.map((image, index) => (
          <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
            <Image className={`${index === 0 ? "first-slide" : index === 1 ? "second-slide" : "third-slide"}`} src={image.src} alt={image.alt} layout="responsive" width={500} height={300} />
          </div>
        ))}
      </div>
      <a className="carousel-control-prev" href="#myCarousel" role="button" data-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="sr-only">Previous</span>
      </a>
      <a className="carousel-control-next" href="#myCarousel" role="button" data-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="sr-only">Next</span>
      </a>
    </div>
  )
}
