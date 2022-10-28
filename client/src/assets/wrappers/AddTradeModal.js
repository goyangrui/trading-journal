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

  /* tag multi-select styles */
  /* multi-select container styles */
  .multi-select-dropdown-container {
    position: relative;
    margin-bottom: 1rem;
  }

  /* multi-select dropdown styles */
  .multi-select-dropdown {
    display: flex;
    align-items: center;
    width: 100%;
    padding-top: 0.375rem;
    padding-bottom: 0.375rem;
    padding-left: 0.75rem;
    height: 2.25rem;
    border: 1px solid var(--gray-200);
    border-radius: var(--borderRadius-2);
    user-select: none;
  }

  /* tag multi-select dropdown button container styles */
  .dropdown-button-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
  }

  .dropdown-button-container svg {
    color: var(--gray-500);
  }

  /* dropdown tag options list */
  .tag-options-list {
    position: absolute;
    top: 48px;
    width: 100%;
    border: 1px solid var(--gray-500);
    box-shadow: var(--shadow-3);
    background-color: var(--backgroundColor);
  }

  .tag-item {
    display: flex;
    align-items: center;
    padding: 0 0.5rem;
    column-gap: 0.35rem;
  }

  .tag-item:hover {
    background-color: var(--gray-300);
  }

  .selected-tag-item {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    padding: 0.3rem;
    margin-right: 0.5rem;
    background-color: var(--primary-500);
    color: var(--gray-100);
    border-radius: var(--borderRadius-2);
    border: 1px solid var(--primary-600);
    box-shadow: var(--shadow-1);
    white-space: nowrap;
  }
`;

export default AddTradeModal;
