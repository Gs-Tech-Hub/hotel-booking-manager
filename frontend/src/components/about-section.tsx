import Image from 'next/image';

interface AboutSectionProps {
  title: string;
  description: string;
  image: string;
}

export default function AboutSection({ title, description, image }: AboutSectionProps) {
  return (
    <div className="about">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-5">
            <div className="titlepage">
              {/* <h2>{title}</h2> */}
              <h2>{description.split('\n')[0]}</h2>
              <p>{description.split('\n').slice(1).join('\n')}</p>
              <a className="read_more" href="#">EXPLORE</a>
            </div>
          </div>
          <div className="col-md-7">
            <div className="about_img">
              <figure>
                <Image src={image} alt={title} layout="responsive" width={500} height={300} />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
