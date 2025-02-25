import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#000', padding: '1rem 0' }}>
      <div className="container">
        <a className="navbar-brand" href="/">
          <img src="/images/logo.png" alt="F-MMM1 Hotel" width="100"/>
        </a>
        
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link text-white" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/about">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/room">Our Rooms</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/gallery">Gallery</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/blog">Blog</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/contact">Contact Us</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
