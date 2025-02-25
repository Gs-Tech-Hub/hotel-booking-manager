export default function AboutSection() {
  return (
    <div className="about">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-5">
            <div className="titlepage">
              <h2>About Us</h2>
              <p>The passage experienced a surge in popularity during the 1960s when Letraset used it on their dry-transfer sheets, and again during the 90s as desktop publishers bundled the text with their software.</p>
              <a className="read_more" href="#"> Read More</a>
            </div>
          </div>
          <div className="col-md-7">
            <div className="about_img">
              <figure><img src="/images/about.png" alt="#"/></figure>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
