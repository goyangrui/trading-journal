import styled from "styled-components";

const EditTradeModal = styled.div`
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

  .loading-container {
    display: flex;
    justify-content: center;
  }

  .table-container {
    overflow: scroll;
    overflow-y: hidden; /* Hide vertical scrollbar */
    margin-bottom: 1rem;
  }

  /* trades table styles */
  .trades-table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: var(--shadow-4);
  }

  /* table header styles */
  .trades-table th {
    font-family: var(--headingFont);
    font-weight: bold;
    font-size: 0.75rem;
    text-transform: uppercase;
    text-align: left;
    letter-spacing: 0.05rem;
    color: var(--gray-100);
    padding: 0.75rem 0.5rem;
    background-color: var(--gray-700);
  }

  /* table body styles */
  .trades-table tbody {
    background-color: var(--gray-600);
  }

  /* table body row styles */
  .trades-table .table-body-row {
    transition: var(--transition);
    background-color: var(--gray-600);
  }
  .trades-table .table-body-row:hover {
    background-color: var(--primary-hover);
    cursor: pointer;
  }

  /* table body row data styles */
  .trades-table .table-body-row td {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--gray-100);
    text-align: left;
    padding: 0.75rem 0.5rem;
  }

  /* table body row data specific styles */

  /* make status, market, symbol, and side columns uppercase */
  .trades-table td:nth-child(1),
  .trades-table td:nth-child(3),
  .trades-table td:nth-child(4),
  .trades-table td:last-child {
    text-transform: uppercase;
  }

  /* table label styles */
  .label {
    display: flex;
    justify-content: center;
    white-space: nowrap;
    padding: 0.1rem;
    border-radius: var(--borderRadius-1);
  }

  /* side label styles */
  .side-long {
    border: 2px solid var(--green-main);
  }

  .side-short {
    border: 2px solid var(--red-main);
  }

  /* status label styles */
  .status-open {
    border: 2px solid var(--yellow-main);
    background-color: var(--yellow-main);
  }

  .status-win {
    border: 2px solid var(--green-main);
    background-color: var(--green-main);
  }

  .status-loss {
    border: 2px solid var(--red-main);
    background-color: var(--red-main);
  }

  /* return styles */
  .return-win {
    color: var(--green-main);
  }

  .return-loss {
    color: var(--red-main);
  }

  /* tag styles */
  .tag-cell {
    display: flex;
    column-gap: 0.25rem;
    overflow: hidden;
    max-width: 100px;
    align-items: center;
    margin: 1.2rem 0;
  }

  .tag {
    border: 2px solid var(--primary-600);
    background-color: var(--primary-600);
  }

  /* Remove execution button styles */
  .remove-button-cell {
    height: 100%;
    /* display: flex; */
  }

  .remove-button-cell svg {
    height: 25px;
    width: 25px;
    color: var(--gray-600);
    background-color: var(--gray-300);
    border-radius: 5px;
    transition: var(--transition);
  }

  .remove-button-cell svg:hover {
    color: var(--gray-500);
  }
`;

export default EditTradeModal;
