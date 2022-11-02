import styled from "styled-components";

const TradesList = styled.div`
  /* general styles */
  display: flex;
  justify-content: center;
  overflow: scroll;
  margin-bottom: 2rem;
  margin-right: 1rem;
  margin-left: 1rem;

  /* table styles */
  .trades-table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: var(--shadow-4);
  }

  .trades-table tbody {
    background-color: var(--gray-600);
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

  /* table header first column styles */
  .trades-table th:first-child {
    font-size: 1rem;
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

  /* table body first column styles */
  .trades-table td:first-child {
    font-size: 1rem;
  }

  /* table body row data specific styles */

  /* make status, market, symbol, and side columns uppercase */
  .trades-table td:nth-child(2),
  .trades-table td:nth-child(4),
  .trades-table td:nth-child(5),
  .trades-table td:last-child {
    text-transform: uppercase;
  }

  /* center no trades header */
  .no-trades {
    text-align: center;
    margin-top: 3rem;
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
`;

export default TradesList;
