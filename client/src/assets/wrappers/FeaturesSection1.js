import styled from "styled-components";

const FeaturesSection1 = styled.div`
  /* general feature section container styles */
  width: 100%;
  margin-bottom: 3rem;

  /* features section styles */
  .features-section {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 2rem;
    font-size: 1.3rem;
  }

  .features-img-container {
  }

  .img {
    border: 5px solid var(--primary-500);
    border-radius: var(--borderRadius-3);
    box-shadow: var(--shadow-3);
  }
`;

export default FeaturesSection1;
