import { useState } from "react";

import { JournalsList, AddJournalModal } from ".";

import Wrapper from "../assets/wrappers/JournalsComponent";

function JournalsComponent() {
  // local state functions and variables
  const [toggleModal, setToggleModal] = useState(false);

  // handle click of add journal entry button
  const addJournalHandler = () => {
    setToggleModal(!toggleModal);
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
      {toggleModal && (
        <AddJournalModal
          toggleModal={toggleModal}
          setToggleModal={setToggleModal}
        />
      )}

      {/* journals list */}
      <JournalsList />
    </Wrapper>
  );
}

export default JournalsComponent;
