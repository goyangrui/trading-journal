// react router dom
import { NavLink } from "react-router-dom";

// styles for Navbar component (nav tag)
import Wrapper from "../assets/wrappers/Navbar";

// react icons
import { FaBars } from "react-icons/fa";

// components
import { Logo } from "../components";

function Navbar() {
  return (
    <Wrapper>
      {/* Logo */}
      <Logo />

      {/* IF SCREEN IS SMALL */}
      {/* toggle button to show nav menu */}
      <button className="toggle-btn" type="button">
        <FaBars />
      </button>

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
        <button type="button" className="btn">
          Login
        </button>
      </div>
    </Wrapper>
  );
}

export default Navbar;
