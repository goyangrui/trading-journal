import { useState } from "react";

import { Outlet } from "react-router-dom";

import Wrapper from "../../assets/wrappers/SharedMain";

import { Sidebar, MainNavbar } from "../../components";

function SharedMain() {
  // Set local state to toggle dropdown
  const [toggleDropdown, setToggleDropdown] = useState(false);

  // Set local state to toggle sidebar menu
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <Wrapper>
      {/* Main navbar with toggle button, logo, profile button, and logout button */}
      <MainNavbar
        toggleDropdown={toggleDropdown}
        setToggleDropdown={setToggleDropdown}
        toggleMenu={toggleMenu}
        setToggleMenu={setToggleMenu}
      />

      {/* Main content */}
      <div className="main-content">
        {/* Sidebar component with Navlinks to different pages */}
        <Sidebar
          toggleDropdown={toggleDropdown}
          setToggleDropdown={setToggleDropdown}
          toggleMenu={toggleMenu}
          setToggleMenu={setToggleMenu}
        />

        {/* Component which displays main content to user depending on page */}
        <div className="main-page">
          <Outlet />
        </div>
      </div>
    </Wrapper>
  );
}

export default SharedMain;
