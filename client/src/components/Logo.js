// react router dom
import { NavLink } from "react-router-dom";

// images
import logo from "../assets/images/logo-no-bg.png";

function Logo() {
  return (
    <NavLink className="logo" to="/">
      <img src={logo} alt="stonk" />
    </NavLink>
  );
}

export default Logo;
