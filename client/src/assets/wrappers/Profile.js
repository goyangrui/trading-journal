import styled from "styled-components";

const Profile = styled.div`
  /* General styles */
  width: 100%;
  margin-top: 2rem;

  /* Form styles */
  .form {
    margin-bottom: 5rem;
  }

  /* Submit button */
  button:disabled {
    cursor: not-allowed;
    pointer-events: all !important;
  }
`;

export default Profile;
