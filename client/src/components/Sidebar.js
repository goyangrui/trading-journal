import { NavLink } from "react-router-dom";

import Wrapper from "../assets/wrappers/Sidebar";

import links from "../utils/main-links";

function Sidebar({
  toggleDropdown,
  setToggleDropdown,
  toggleMenu,
  setToggleMenu,
}) {
  // click handler to toggle off all menus and dropdowns
  const toggleOff = () => {
    setToggleDropdown(false);
    setToggleMenu(false);
  };

  return (
    <Wrapper className={toggleMenu && "show-menu"}>
      {/* Sidebar Links */}
      {links.map((link) => {
        return (
          <NavLink
            className="sidebar-item"
            to={link.path}
            key={link.id}
            onClick={toggleOff}
          >
            {link.icon}
            {link.text}
          </NavLink>
        );
      })}
    </Wrapper>
  );
}

export default Sidebar;
