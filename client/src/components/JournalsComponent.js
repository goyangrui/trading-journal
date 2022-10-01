import { useEffect } from "react";

import { JournalsList } from ".";

import Wrapper from "../assets/wrappers/JournalsComponent";

function JournalsComponent() {
  return (
    <Wrapper>
      {/* button container */}
      <div className="btn-container">
        {/* add journal entry button */}
        <button className="btn">Add Journal Entry</button>
      </div>

      {/* journals list */}
      <JournalsList />
    </Wrapper>
  );
}

export default JournalsComponent;
