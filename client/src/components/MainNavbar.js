import { useState } from "react";
import { NavLink } from "react-router-dom";

import { useAppContext } from "../context/appContext";

import Wrapper from "../assets/wrappers/MainNavbar";

import logo from "../assets/images/logo-no-bg.png";
import { FaUserAlt, FaCaretDown, FaBars } from "react-icons/fa";

function MainNavbar({
  toggleDropdown,
  setToggleDropdown,
  toggleMenu,
  setToggleMenu,
}) {
  // Get global context functions and variables
  const { logoutUser } = useAppContext();

  // handle dropdown button click
  const setShowDropdown = () => {
    setToggleDropdown(!toggleDropdown);
  };

  // handle menu button click
  const setShowMenu = () => {
    setToggleMenu(!toggleMenu);
  };

  return (
    <Wrapper>
      {/* toggle button */}
      <div className="toggle-btn-container">
        <button className="toggle-btn" type="button" onClick={setShowMenu}>
          <FaBars />
        </button>
      </div>

      {/* logo */}
      <div className="logo-container">
        <img src={logo} alt="logo" className="logo" />
      </div>

      {/* drop down button and drop down menu container */}
      <div className="btn-container">
        {/* drop down toggle button */}
        <button type="button" className="btn" onClick={setShowDropdown}>
          <FaUserAlt />
          Profile
          <FaCaretDown />
        </button>

        {/* drop down menu container (show drop down if toggle is true) */}
        {toggleDropdown && (
          <div className="dropdown">
            {/* logout button */}
            <button
              className="dropdown-item"
              onClick={() => {
                setShowDropdown();
                logoutUser();
              }}
            >
              Logout
            </button>
            {/* link to profile */}
            <NavLink
              to="/app/profile"
              className="dropdown-item"
              onClick={() => {
                setShowDropdown();
              }}
            >
              User Settings
            </NavLink>
          </div>
        )}
      </div>
    </Wrapper>
  );
}

export default MainNavbar;
