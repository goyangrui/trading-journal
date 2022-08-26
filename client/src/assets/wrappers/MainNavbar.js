import styled from "styled-components";

const MainNavbar = styled.nav`
  /* General navbar styles */
  display: flex;
  justify-content: space-between;
  position: fixed;
  width: 100%;
  height: var(--nav-height-2);
  padding: 0.5rem 1rem;
  background-color: var(--navColor-1);
  z-index: 10;

  /* Logo image styles */
  .logo-container {
    display: flex;
    margin-left: 24px;

    /* hide logo when small screen */
    @media screen and (max-width: 960px) {
      display: none;
    }
  }

  .logo {
    width: 100%;
    display: block;
    object-fit: cover;
  }

  /* Drop down button container */
  .btn-container {
    display: flex;
  }

  /* Drop down button */
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    gap: 0 0.5rem;
    background: var(--navColor-1);
    border: none;
  }

  .btn:hover {
    color: var(--white);
  }

  /* Drop down */
  .dropdown {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50px;
    width: 125.51px;
    background: var(--navmenuColor-1);
    box-shadow: var(--shadow-4);
  }

  /* Drop down item */
  .dropdown-item {
    background: var(--navmenuColor-1);
    width: 100%;
    text-align: center;
    color: var(--white);
    border: transparent;
    padding: 0.5rem;
    transition: var(--transition);
  }

  .dropdown-item:hover {
    cursor: pointer;
    color: var(--primary-500);
    background: var(--navmenuColor-hover);
  }

  /* Toggle sidebar button */
  .toggle-btn {
    color: var(--white);
    background: var(--navColor-1);
    border: transparent;
    font-size: 1.8rem;
    cursor: pointer;
  }

  .toggle-btn-container {
    display: none;

    @media screen and (max-width: 960px) {
      display: flex;
    }
  }
`;

export default MainNavbar;
