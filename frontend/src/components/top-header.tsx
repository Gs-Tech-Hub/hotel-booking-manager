
export default function TopHeader() {
  return (
    <div className="header-container">
      {/* Left Section - Contact Info */}
      <div className="header-left">
        <ul className="header-social">
          <li>
            <a href="#">Contact Us: +234 704 523 2697</a>
          </li>
        </ul>
      </div>

      {/* Right Section - Currency & Language Selectors */}
      <div className="header-right">
        <select className="header-select">
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="NGN">NGN</option>
        </select>

        <select className="header-select">
          <option value="ENG">ENG</option>
          <option value="FRA">FRA</option>
        </select>
      </div>
    </div>
  );
}
