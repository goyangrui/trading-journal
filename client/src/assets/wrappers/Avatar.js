import styled from "styled-components";

const Avatar = styled.div`
  /* General avatar (container) styles */
  margin-bottom: 1.25rem;
  height: 125px;
  width: 125px;
  border-radius: 100%;
  border: 5px solid var(--gray-500);
  box-shadow: var(--shadow-1);
  background: var(--gray-400);
  overflow: hidden;

  /* image styles */
  .img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  label {
    width: 100%;
    height: 100%;
  }

  /* file type input */
  #file-input {
    display: none;
  }
`;

export default Avatar;
