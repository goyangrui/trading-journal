import { NavLink, Link } from "react-router-dom";
import { useState } from "react";

import { FaBars } from "react-icons/fa";

import Wrapper from "../assets/wrappers/Navbar";

import { Logo } from ".";
import { ToggleMenu } from ".";

import links from "../utils/links";

function Navbar() {
  // local state variable for toggling nav menu
  const [toggle, setToggle] = useState(false);

  // toggle function
  const toggleMenu = () => {
    setToggle(!toggle);
  };

  return (
    <Wrapper>
      <nav>
        {/* Logo */}
        <Logo toggle={toggle} toggleMenu={toggleMenu} />

        {/* IF SCREEN IS SMALL */}
        {/* toggle button to show nav menu */}
        <div className="toggle-btn-container">
          <button className="toggle-btn" type="button" onClick={toggleMenu}>
            <FaBars />
          </button>
        </div>

        {/* IF SCREEN IS BIG */}
        {/* nav menu */}
        <div className="nav-menu">
          {/* render every link object in the links array */}
          {links.map((link) => {
            return (
              <NavLink to={link.path} key={link.id} className="nav-link">
                {link.text}
              </NavLink>
            );
          })}
        </div>

        {/* login button */}
        <div className="btn-container">
          <Link to="/login" className="btn">
            Login
          </Link>
        </div>
      </nav>

      {/* toggle menu */}
      <ToggleMenu toggle={toggle} toggleMenu={toggleMenu} />
    </Wrapper>
  );
}

export default Navbar;
