import styled from "styled-components";

const TradesList = styled.div`
  /* general styles */
  display: grid;
  margin-bottom: 2rem;

  /* table styles */
  .trades-table {
    border-collapse: collapse;
    box-shadow: var(--shadow-4);
  }

  /* table header styles */
  .trades-table th {
    font-size: 0.75rem;
    text-transform: uppercase;
    text-align: left;
    letter-spacing: 0.05rem;
    color: var(--gray-300);
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
    background-color: var(--primary-600);
    cursor: pointer;
  }

  /* table body row data styles */
  .trades-table .table-body-row td {
    font-size: 0.75rem;
    color: var(--gray-200);
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

  /* tag styles */
  .tag-cell {
    display: flex;
    /* flex-wrap: wrap; */
    height: 100%;
    width: 100%;
    align-items: center;
  }

  .tag {
    white-space: nowrap;
  }
`;

export default TradesList;
