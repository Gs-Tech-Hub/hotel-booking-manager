// Blog page 

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      image: "blog1.jpg",
      title: "Bed Room",
      subtitle: "The standard chunk",
      description: "If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generatorsIf you are"
    },
    {
      id: 2,
      image: "blog2.jpg",
      title: "Bed Room",
      subtitle: "The standard chunk",
      description: "If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generatorsIf you are"
    },
    {
      id: 3,
      image: "blog3.jpg",
      title: "Bed Room",
      subtitle: "The standard chunk",
      description: "If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generatorsIf you are"
    }
  ];

  return (
    <>
      <div className="back_re">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="title">
                <h2>Blog</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="blog">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="titlepage">
                <p className="margin_0">Lorem Ipsum available, but the majority have suffered</p>
              </div>
            </div>
          </div>
          
          <div className="row">
            {blogPosts.map((post) => (
              <div key={post.id} className="col-md-4">
                <div className="blog_box">
                  <div className="blog_img">
                    <figure>
                      <img src={`/images/${post.image}`} alt={post.title} />
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
    </>
  )
} 