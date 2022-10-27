import styled from "styled-components";

const Trades = styled.div`
  /* general styles for Trades component */
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 1rem;

  /* button container styles */
  .btn-container {
    display: flex;
    justify-content: flex-start;
    column-gap: 1rem;
    margin-bottom: 2rem;
  }

  /* add tag container */
  .add-tag-container {
    display: flex;
    justify-content: flex-end;
    width: 100%;
  }

  /* add tag modal */
  .add-tag-modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 10;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
    overflow: auto;
  }

  /* add tag modal content */
  .tag-modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 2rem auto;
    padding: 1rem;
    width: var(--fluid-width);
    max-width: 15rem;
    background-color: var(--gray-100);
  }

  /* add tag text box */
  .add-tag-text {
    margin-bottom: 1rem;
    border-radius: var(--borderRadius-2);
    border: 2px solid var(--gray-700);
    outline: none;
    padding: 0.5rem;
  }

  .btn-container {
    column-gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;

export default Trades;
