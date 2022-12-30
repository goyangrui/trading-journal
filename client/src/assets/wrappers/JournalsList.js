import styled from "styled-components";

const JournalsList = styled.div`
  /* general journal list styles */
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  max-width: 1000px;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
  }

  /* journal image modal styles */
  .image-modal {
    position: fixed;
    z-index: 20;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
  }

  .image-modal-content {
    width: var(--fluid-width);
    min-width: 1500px;
    background-color: var(--gray-200);
    padding: 1rem;
    margin: 1rem auto;
    border-radius: var(--borderRadius-2);
  }

  /* modal close button styles */
  .modal-button-container {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin-bottom: 0.25rem;
  }

  .modal-close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 25px;
    width: 25px;
    border: none;
    background-color: var(--gray-200);
    color: var(--gray-900);
    font-size: 1.5rem;
    transition: var(--transition);
  }

  .modal-close-btn:hover {
    cursor: pointer;
    color: var(--gray-500);
  }
`;

export default JournalsList;
