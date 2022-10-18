import styled from "styled-components";

const JournalEntry = styled.div`
  /* general journal entry styles */
  width: 100%;
  margin-bottom: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: var(--shadow-3);
  border-radius: var(--borderRadius-2);
  color: var(--gray-200);
  background-color: var(--gray-500);

  /* journal header styles */
  .journal-header {
    width: 100%;
    display: flex;
    justify-content: center;
    border-radius: var(--borderRadius-2) var(--borderRadius-2) 0 0;
    background-color: var(--gray-700);
  }

  /* journal content styles */
  .journal-content {
    width: 100%;
    padding: 1rem 2rem;
  }

  /* journal notes styles */
  .journal-notes {
    display: flex;
    resize: none;
    padding: 0.5rem;
    border-radius: var(--borderRadius-2);
    border: 2px solid var(--gray-700);
    outline: none;
    margin: 1rem 0;
    height: 40px;
    max-height: 100px;
    width: 100%;
  }

  .journal-notes:focus {
    border-color: var(--primary-500);
  }

  .journal-notes::-webkit-scrollbar {
    width: 0px;
  }

  /* screenshots container */
  .screenshots-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 3rem;
    margin-bottom: 2rem;
  }

  .screenshot-container,
  .add-image-box {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    width: 45%;
    height: 250px;
  }

  .add-image-box {
    color: var(--primary-500);
    border: 2px dotted var(--gray-300);
  }

  /* screenshot */
  .screenshot-container img {
    width: 100%;
    height: 100%;
  }

  /* remove image button */
  .remove-button-container {
    position: absolute;
    top: 0;
    right: 0;
  }

  .remove-image-button {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    background-color: var(--gray-300);
    height: 25px;
    width: 25px;
  }

  .remove-image-button:hover {
    background-color: var(--gray-400);
    cursor: pointer;
  }

  /* hide file input button */
  .file-input {
    display: none;
  }

  /* trades table styles */
  .trades-table {
    border-collapse: collapse;
    width: 100%;
  }

  /* trades table header styles */
  .trades-table th {
    font-size: 0.75rem;
    text-transform: uppercase;
    text-align: left;
    letter-spacing: 0.05rem;
    color: var(--gray-300);
    padding: 0.75rem 0.5rem;
    background-color: var(--gray-700);
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
`;

export default JournalEntry;
