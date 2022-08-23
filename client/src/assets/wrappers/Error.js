import styled from "styled-components";

const Error = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .img {
    width: 600px;
    max-width: 90vw;
    margin-bottom: 3rem;
  }

  .text-container {
    margin: 0 auto;
  }

  .error-text {
    color: var(--gray-800);
  }
`;

export default Error;
