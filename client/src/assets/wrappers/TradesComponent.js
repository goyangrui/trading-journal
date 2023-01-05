import styled from "styled-components";

const Trades = styled.div`
  /* general styles for Trades component */
  display: flex;
  flex-direction: column;
  width: 100%;

  /* loading container */
  .loading-container {
    display: flex;
    justify-content: center;
  }

  /* button container styles */
  .btn-container {
    display: flex;
    justify-content: flex-start;
    column-gap: 1rem;
    margin-bottom: 1.5rem !important;
    margin-right: 1rem;
    margin-left: 1rem;
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
    width: 50%;
    min-width: 30rem;
    max-width: 20rem;
    background-color: var(--gray-100);
  }

  .delete-tag-container {
    display: flex;
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-bottom: 1rem;
    column-gap: 0.25rem;
    row-gap: 0.25rem;
  }

  .delete-tag-item {
    display: flex;
    column-gap: 0.25rem;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    color: var(--gray-50);
    text-transform: uppercase;
    font-size: 0.75rem;
    padding: 0.1rem 0.25rem;
    border-radius: var(--borderRadius-1);
    border: 2px solid var(--primary-600);
    background-color: var(--primary-500);
  }

  .delete-tag-item .close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    width: 20px;
    color: var(--primary-800);
    padding: 0.1rem;
    border-radius: 20px;
    border: 2px solid var(--primary-700);
    background-color: var(--primary-500);
    transition: var(--transition);
  }

  .delete-tag-item .close-button:hover {
    cursor: pointer;
    border: 2px solid var(--primary-200);
    color: var(--primary-200);
  }

  .add-tag-form {
    width: 100%;
  }

  /* add tag text box */
  .add-tag-text {
    width: 100%;
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

  .btn {
    white-space: nowrap;
  }

  /* Filter input styles */
  .filter-container {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    column-gap: 0.25rem;
    row-gap: 0.25rem;
    margin-left: 1rem;
    margin-right: 1rem;
    margin-bottom: 1rem;
  }

  .filter-container input,
  select {
    outline: none;
    border-radius: var(--borderRadius-1);
    border: 2px solid var(--gray-500);
  }

  /* overselect styles */
  .dropdown-button {
    position: relative;
  }

  .overselect {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  /* filter buttons container */
  .filter-buttons-container {
    display: flex;
    column-gap: 0.25rem;
    justify-content: flex-end;
  }

  .filter-btn {
    font-size: 0.75rem;
  }

  /* dropdown options styles */
  .dropdown-options {
    display: flex;
    flex-direction: column;
    position: fixed;
    padding: 0.25rem;
    z-index: 10;
    background-color: var(--gray-800);
    border-radius: var(--borderRadius-1);
    border: 1px solid var(--gray-300);
    box-shadow: var(--shadow-4);
  }

  .dropdown-options label {
    display: flex;
    column-gap: 0.25rem;
    text-transform: uppercase;
    color: var(--gray-200);
  }

  .hide-options {
    display: none;
  }
`;

export default Trades;
