import React from 'react';

const Footer = () => {
  const contactInfo = [
    { icon: "fa-map-marker", text: "Address" },
    { icon: "fa-mobile", text: "+234 704 523 2697" },
    { icon: "fa-envelope", text: <a href="#">fmmm1hotel@gmail.com</a> },
  ];

  const menuLinks = [
    { text: "Home", href: "#" },
    { text: "About", href: "about.html" },
    { text: "Our Room", href: "room.html" },
    { text: "Gallery", href: "gallery.html" },
    { text: "Blog", href: "blog.html" },
    { text: "Contact Us", href: "contact.html" },
  ];

  const socialIcons = [
    { icon: "fa-facebook", href: "#" },
    { icon: "fa-twitter", href: "#" },
    { icon: "fa-linkedin", href: "#" },
    { icon: "fa-youtube-play", href: "#" },
  ];

  return (
    <footer>
      <div className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h3>Contact Us</h3>
              <ul className="conta">
                {contactInfo.map((item, index) => (
                  <li key={index}>
                    <i className={`fa ${item.icon}`} aria-hidden="true"></i> {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-4">
              <h3>Menu Link</h3>
              <ul className="link_menu">
                {menuLinks.map((link, index) => (
                  <li key={index} className={link.text === "Home" ? "active" : ""}>
                    <a href={link.href}>{link.text}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-4">
              <h3>Newsletter</h3>
              <form className="bottom_form">
                <input className="enter" placeholder="Enter your email" type="text" name="email" />
                <button className="sub_btn">Subscribe</button>
              </form>
              <ul className="social_icon">
                {socialIcons.map((icon, index) => (
                  <li key={index}>
                    <a href={icon.href}><i className={`fa ${icon.icon}`} aria-hidden="true"></i></a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="copyright">
          <div className="container">
            <div className="row">
              <div className="col-md-10 offset-md-1">
                <p>
                  © 2025 All Rights Reserved. Made by <a href="https://gstechhub.com.ng/">Gs Tech Hub</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

