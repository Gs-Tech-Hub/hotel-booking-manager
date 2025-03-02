import Image from 'next/image';

interface BlogPost {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

interface BlogSectionProps {
  posts: BlogPost[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  return (
    <div className="blog">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="titlepage">
              <h2>Blog</h2>
              <p>Lorem Ipsum available, but the majority have suffered</p>
            </div>
          </div>
        </div>
        <div className="row">
          {posts.map((post) => (
            <div key={post.id} className="col-md-4">
              <div className="blog_box">
                <div className="blog_img">
                  <figure>
                    <Image src={`/images/${post.image}`} alt={post.title} layout="responsive" width={500} height={300} />
                  </figure>
                </div>
                <div className="blog_room">
                  <h3>{post.title}</h3>
                  <span>{post.subtitle}</span>
                  <p>{post.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
