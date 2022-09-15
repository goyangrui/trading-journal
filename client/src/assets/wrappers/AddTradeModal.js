import styled from "styled-components";

const AddTradeModal = styled.div`
  /* general modal styles */

  position: fixed;
  z-index: 10;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
  overflow: auto;

  /* modal content styles */
  .modal-content {
    margin: 2rem auto;
    padding: 1rem;
    width: var(--fluid-width);
    background-color: var(--gray-100);
  }

  /* modal header */
  .modal-header {
    display: flex;
    justify-content: space-between;
  }

  /* modal header close button */
  .modal-close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 35px;
    width: 35px;
    border: none;
    background-color: var(--gray-100);
    color: var(--gray-900);
    font-size: 1.5rem;
    transition: var(--transition);
  }

  .modal-close-btn:hover {
    cursor: pointer;
    color: var(--gray-600);
  }

  /* modal form */
  .modal-form {
    background-color: var(--gray-100);
    width: 100%;
  }

  /* modal form buttons */
  .modal-btn-container {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
  }

  /* modal form execution header */
  .execution-header {
    display: flex;
    justify-content: space-between;
  }
`;

export default AddTradeModal;
