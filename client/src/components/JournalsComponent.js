import { useState } from "react";

import { JournalsList, AddJournalModal, EditTradeModal } from ".";

import { useAppContext } from "../context/appContext";

import Wrapper from "../assets/wrappers/JournalsComponent";

function JournalsComponent() {
  // global state functions and variables
  const { showMainModal, toggleMainModal, showEditTradeModal, editTrade } =
    useAppContext();

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

      {/* If the showEditTradeModal flag is set to true, show the EditTradeModal component */}
      {showEditTradeModal && <EditTradeModal editTrade={editTrade} />}
    </Wrapper>
  );
}

export default JournalsComponent;
