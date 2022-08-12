import styled from "styled-components";

const Register = styled.div`
  /* outer div styles */
  margin: 3rem auto;

  /* form heading */
  .form h2 {
    text-align: center;
    /* font-weight: 500; */
  }

  /* submit button */
  .btn:hover {
    color: var(--white);
    background: var(--primary-600);
    border: 2px solid var(--primary-600);
  }

  /* form paragraph */
  .form p {
    text-align: center;
    margin-bottom: 0rem;
  }

  /* redirect button */
  .redirect-btn {
    font-weight: 500;
    color: var(--primary-500);
    transition: var(--transition);
  }

  .redirect-btn:hover {
    color: var(--primary-600);
  }
`;

export default Register;
