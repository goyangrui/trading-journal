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
    border-radius: var(--borderRadius-2);
    border: 2px solid var(--primary-600);
    margin-bottom: 1rem;
    height: 50px;
    max-height: 200px;
    width: 100%;
  }

  /* screenshots container */
  .screenshots-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  /* add image label and screenshot container */
  .screenshot-container,
  .add-image-box {
    display: flex;
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

  /* hide file input button */
  #file-input {
    display: none;
  }
`;

export default JournalEntry;
