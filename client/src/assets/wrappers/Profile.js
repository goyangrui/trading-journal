import styled from "styled-components";

const Profile = styled.div`
  /* General styles */
  margin-top: 2rem;

  /* Submit button */
  button:disabled {
    cursor: not-allowed;
    pointer-events: all !important;
  }
`;

export default Profile;
