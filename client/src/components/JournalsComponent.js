import { useState } from "react";

import { JournalsList, AddJournalModal } from ".";

import { useAppContext } from "../context/appContext";

import Wrapper from "../assets/wrappers/JournalsComponent";

function JournalsComponent() {
  // global state functions and variables
  const { showMainModal, toggleMainModal } = useAppContext();

  // handle click of add journal entry button
  const addJournalHandler = () => {
    toggleMainModal();
  };

  return (
    <Wrapper>
      {/* button container */}
      <div className="btn-container">
        {/* add journal entry button */}
        <button className="btn" onClick={addJournalHandler}>
          Add Journal Entry
        </button>
      </div>

      {/* add journal modal */}
      {showMainModal && <AddJournalModal />}

      {/* journals list */}
      <JournalsList />
    </Wrapper>
  );
}

export default JournalsComponent;
