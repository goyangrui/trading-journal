import { NavLink, Link } from "react-router-dom";
import { useState } from "react";

import { FaBars } from "react-icons/fa";

import Wrapper from "../assets/wrappers/Navbar";

import { Logo } from ".";
import { MainToggleMenu } from ".";

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
          {/* route to landing page */}
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>

          {/* route to features page*/}
          <NavLink to="/features" className="nav-link">
            Features
          </NavLink>

          {/* route to pricing page */}
          <NavLink to="/pricing" className="nav-link">
            Pricing
          </NavLink>
        </div>

        {/* login button */}
        <div className="btn-container">
          <Link to="/login" className="btn">
            Login
          </Link>
        </div>
      </nav>

      {/* toggle menu */}
      <MainToggleMenu toggle={toggle} toggleMenu={toggleMenu} />
    </Wrapper>
  );
}

export default Navbar;
