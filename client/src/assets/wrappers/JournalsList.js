import styled from "styled-components";

const JournalsList = styled.div`
  /* general journal list styles */
  display: flex;
  flex-direction: column;
  align-items: center;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
  }

  /* journal entry styles */
  .journal-entry {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: var(--shadow-3);
    border-radius: var(--borderRadius-2);
    color: var(--gray-200);
    background-color: var(--gray-500);
  }

  .journal-header {
    width: 100%;
    display: flex;
    justify-content: center;
    border-radius: var(--borderRadius-2) var(--borderRadius-2) 0 0;
    background-color: var(--gray-700);
  }

  .journal-content {
    width: 100%;
    padding: 1rem 2rem;
  }

  .journal-notes {
    border-radius: var(--borderRadius-2);
    border: 2px solid var(--primary-600);
    height: 50px;
    max-height: 200px;
    width: 100%;
  }
`;

export default JournalsList;
