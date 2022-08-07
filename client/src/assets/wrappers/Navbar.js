import styled from "styled-components";

const Wrapper = styled.header`
  /* General navigation bar styles */

  nav {
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
    display: none;

    @media screen and (max-width: 960px) {
      color: var(--white);
      background: var(--navColor-1);
      border: transparent;
      display: flex;
      width: 100vw;
      justify-content: flex-end;
      margin-right: 24px;
      font-size: 1.8rem;
      cursor: pointer;
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
`;

export default Wrapper;
