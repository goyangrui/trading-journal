import styled from "styled-components";

const Alert = styled.div`
  /* General styles for alert */
  margin-bottom: 3rem;

  /* list container styles */
  .list-container {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .list-container-danger {
    justify-content: center;
  }

  /* close button styles */
  .close-btn {
    display: flex;
    border: none;
    justify-content: center;
    align-items: center;
    transition: var(--transition);
    color: var(--gray-500);
  }

  .close-btn:hover {
    color: var(--gray-800);
    cursor: pointer;
  }

  .close-btn-danger {
    background: var(--red-light);
  }

  .close-btn-success {
    background: var(--green-light);
  }
`;

export default Alert;
