import Link from "next/link";
import Image from 'next/image';

export default function Navigation() {
  return (
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 col">
            <div className="full">
              <div className="logo rounded-logo">
                <Link href="/">
                  <Image className="rounded-logo" src="https://i.postimg.cc/j5qdbbvk/fmmm1-logo.png" alt="Logo" width={100} height={50} />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-xl-9 col-lg-9 col-md-9 col-sm-9">
            <nav className="navigation navbar navbar-expand-md navbar-dark">
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample04" aria-controls="navbarsExample04" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarsExample04">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link className="nav-link menu-link" href="/">Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link menu-link" href="/about">About</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link menu-link" href="/rooms">Our Rooms</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link menu-link" href="/restaurant">Restaurant</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link menu-link" href="/contact">Contact Us</Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
  );
}
