import styled from "styled-components";

const Pricing = styled.div`
  /* Section header styles */
  .section-header {
    text-align: center;
  }

  /* Additional title styles */
  .title {
    margin-bottom: 1rem;
  }
  .title h2 {
    /* font-weight: 500; */
    margin-bottom: 0.25rem;
  }

  .section-header h4 {
    color: var(--gray-500);
  }

  /* loading container */
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export default Pricing;
