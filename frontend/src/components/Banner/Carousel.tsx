import Image from 'next/image';

export default function BannerCarousel() {
  return (
    <div id="myCarousel" className="carousel slide banner" data-ride="carousel">
      <ol className="carousel-indicators">
        <li data-target="#myCarousel" data-slide-to="0" className="active"></li>
        <li data-target="#myCarousel" data-slide-to="1"></li>
        <li data-target="#myCarousel" data-slide-to="2"></li>
      </ol>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <Image className="first-slide" src="/images/banner1.jpg" alt="First slide" layout="responsive" width={500} height={300} />
        </div>
        <div className="carousel-item">
          <Image className="second-slide" src="/images/banner2.jpg" alt="Second slide" layout="responsive" width={500} height={300} />
        </div>
        <div className="carousel-item">
          <Image className="third-slide" src="/images/banner3.jpg" alt="Third slide" layout="responsive" width={500} height={300} />
        </div>
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
