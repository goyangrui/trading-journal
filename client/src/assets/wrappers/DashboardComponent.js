import styled from "styled-components";

const DashboardComponent = styled.div`
  /* general styles */
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 1.5rem;

  /* button styles */
  .timeframe-button-container {
    display: flex;
    column-gap: 0.25rem;
    margin-bottom: 1rem;
  }

  .btn:disabled {
    cursor: not-allowed;
  }

  .btn-set {
    color: var(--primary-500);
    background: var(--white);
  }

  /* charts container styles */
  .charts-container {
    display: flex;
    justify-content: center;
    width: 100%;
    column-gap: 1rem;
    margin-bottom: 1rem;
  }

  @media screen and (max-width: 1200px) {
    .charts-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 1.5rem;
      width: 100%;
    }
  }

  /* individual chart/stat container styles */
  .chart-stat-container {
    display: flex;
    width: 100%;
    padding: 1rem;
    border-radius: var(--borderRadius-2);
    border: 1px solid var(--gray-600);
    background-color: var(--gray-600);
  }

  .chart-stat {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;
    color: var(--gray-200);
    width: 100%;
  }

  .chart-container {
    display: flex;
  }

  .chart-container canvas {
    max-height: 75px !important;
    max-width: 150px !important;
  }

  /* stat table styles */
  .stats-table-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: var(--gray-600);
    border-top-left-radius: var(--borderRadius-2);
    border-top-right-radius: var(--borderRadius-2);
    color: var(--gray-200);
  }

  .stats-table-header-container {
    display: flex;
    width: 100%;
    justify-content: center;
    background-color: var(--gray-700);
    border-top-left-radius: var(--borderRadius-2);
    border-top-right-radius: var(--borderRadius-2);
  }

  .stats-table-header-container h4 {
    margin: 0.5rem 0;
  }

  .stats-table {
    width: 100%;
    border-collapse: collapse;
  }

  .stats-table td {
    padding: 0.5rem 0.75rem;
  }

  .stats-table tr:nth-child(odd) {
    background-color: var(--gray-500);
  }
`;

export default DashboardComponent;
