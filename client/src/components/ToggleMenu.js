import { Link } from "react-router-dom";

import mainLinks from "../utils/links";

function ToggleMenu({ toggle, toggleMenu }) {
  return (
    <div className={toggle ? "toggle-menu active" : "toggle-menu"}>
      {/* Get links from mainLinks array */}
      {mainLinks.map((item) => {
        return (
          <Link to={item.path} key={item.id} onClick={toggleMenu}>
            {item.text}
          </Link>
        );
      })}

      {/* Login link */}
      <Link to="/login" className="btn" onClick={toggleMenu}>
        Login
      </Link>
    </div>
  );
}

export default ToggleMenu;
