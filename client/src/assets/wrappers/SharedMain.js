import styled from "styled-components";

const SharedMain = styled.div`
  display: flex;
  flex-direction: column;

  /* sidebar and main content flex */
  .main-content {
    display: flex;
    margin-top: var(--nav-height-2);
  }

  /* main content page */
  .main-page {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    margin-left: calc(var(--sidebar-width-1));
    margin-top: 1rem;
    transition: var(--transition);

    /* When small screen, move main content page all the way to left (remove the left margin) */
    @media screen and (max-width: 960px) {
      margin-left: 0;
    }
  }

  /* sidebar show menu class */
  .show-menu {
    left: 0px;
  }
`;

export default SharedMain;
