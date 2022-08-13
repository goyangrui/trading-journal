import styled from "styled-components";

const Wrapper = styled.header`
  /* General navigation bar styles */

  nav {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    background: var(--navColor-1);
    height: var(--nav-height);
    display: flex;
    justify-content: start;
    padding: 0.5rem calc((100vw - 1350px) / 2);
    z-index: 10;
    align-items: center;
  }

  /* Logo styles */
  .logo {
    display: flex;
    align-items: center;
    margin: 0 24px;
    height: 100%;
  }

  .logo img {
    height: 50%;
    width: auto;
    object-fit: cover;
  }

  /* Nav-menu styles */
  .nav-menu {
    display: flex;
    align-items: center;

    @media screen and (max-width: 960px) {
      display: none;
    }
  }

  /* Nav-link styles */
  .nav-link {
    color: var(--white);
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    text-decoration: none;
    /* padding: 0 1rem; */
    margin: 0 1rem;
    transition: var(--transition);
  }

  .nav-link.active,
  .nav-link:hover {
    color: var(--primary-500);
  }

  /* Toggle button styles */
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
      justify-content: flex-end;
      width: 100%;
      margin-right: 24px;
    }
  }

  /* Login button */

  .btn-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100vw;
    margin-right: 24px;
    font-size: 1.1rem;

    @media screen and (max-width: 960px) {
      display: none;
    }
  }

  /* Toggle menu */
  .toggle-menu {
    display: none;

    @media screen and (max-width: 960px) {
      position: fixed;
      top: -100%;

      display: flex;
      flex-direction: column;

      width: 100%;
      background: var(--navColor-1);

      transition: var(--transition);
    }
  }
  // Move menu down to nav height when toggled on (active)
  .toggle-menu.active {
    top: var(--nav-height);
  }

  // Login button in toggle menu
  .toggle-menu .btn:hover {
    color: var(--primary-500);
  }

  // Toggle menu links
  .toggle-menu a {
    margin: 0.5rem auto;
    padding: 0.5rem 1rem;

    color: var(--white);
    transition: var(--transition);
  }

  .toggle-menu a:hover {
    color: var(--primary-500);
  }
`;

export default Wrapper;
