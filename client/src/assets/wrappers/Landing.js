import styled from "styled-components";

const Landing = styled.div`
  /* outer div styles */
  margin: 5rem 0;
  margin-top: calc(var(--nav-height) + 5rem);

  /* Hero layout styles */
  .hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 3rem;
  }

  /* Emphasize text styles */
  span {
    color: var(--primary-500);
    font-weight: 500;
  }

  /* Additional button styles */
  .btn {
    padding: 1rem 1.5rem;
    font-size: 1.25rem;
  }

  /* styles when small screen */

  @media screen and (max-width: 960px) {
    /* hero styles when small screen */
    .hero {
      display: block;
      text-align: center;
    }

    /* image styles when small screen */
    .img {
      margin: 0 auto;
      margin-bottom: 2rem;
      max-width: 600px;
    }
  }
`;

export default Landing;
