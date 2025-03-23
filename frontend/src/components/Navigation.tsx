import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !(menuRef.current as HTMLElement).contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div ref={menuRef} className={`menubar ${scrolled ? "scrolled" : ""}`}> 
      <div className="top_menu row mt-2">
        <div className="container">
          <div className="float-left">
            <ul className="list header_social">
              <li>
                <a href="#">Contact Us: +234 704 523 2697</a>
              </li>
            </ul>
          </div>
          <div className="float-right gap-5">
            <select>
              <option value="NGN">NGN</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            <select>
              <option value="ENG">ENG</option>
              <option value="FRA">DUT</option>
              <option value="FRA">FRA</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3">
            <div className="full">
              <div className="logo rounded-logo">
                <Link href="/">
                  <Image
                    className="rounded-logo"
                    src="https://i.postimg.cc/j5qdbbvk/fmmm1-logo.png"
                    alt="Logo"
                    width={70}
                    height={50}
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-xl-9 col-lg-9 col-md-9 col-sm-9">
            <nav className="navigation navbar-expand-md navbar-dark">
              <button
                className="navbar-toggler"
                type="button"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className={`${menuOpen ? "d-block" : "d-none"} d-md-block mt-4 mt-md-0`}>
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
    </div>
  );
}
