import styled from "styled-components";

const DashboardComponent = styled.div`
  /* general styles */
  display: flex;
  width: 100%;
  margin: 0 1rem;

  /* charts container styles */
  .charts-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 25px;
    width: 100%;
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
`;

export default DashboardComponent;
