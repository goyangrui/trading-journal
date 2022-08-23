import styled from "styled-components";

const Sidebar = styled.nav`
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100%;
  width: var(--sidebar-width-1);
  transition: var(--transition);

  background: var(--navmenuColor-1);

  /* Sidebar items */
  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    color: var(--white);
    font-size: 1.1rem;
    padding: 0.5rem 0.75rem;
  }

  .sidebar-item:hover,
  .sidebar-item.active {
    background: var(--navmenuColor-hover);
    box-shadow: var(--shadow-2);
  }

  .sidebar-item svg {
    width: 25px;
  }

  .sidebar-item.active svg {
    color: var(--primary-500);
  }

  /* Sidebar in small screen (moved to the left off screen by default) */

  @media screen and (max-width: 960px) {
    left: calc(0px - var(--sidebar-width-1));
  }

  /* show menu class in SharedMain styled component */
`;

export default Sidebar;
