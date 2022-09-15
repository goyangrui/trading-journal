import { useState } from "react";

import Wrapper from "../assets/wrappers/TradesComponent";

import { TradesList, AddTradeModal } from ".";

function TradesComponent() {
  // local state variables
  const [toggleModal, setToggleModal] = useState(true);

  // add trade button handler (toggles modal)
  const addTradeHandler = (e) => {
    setToggleModal(!toggleModal);
  };

  return (
    <Wrapper>
      {/* Button container with add trade, and delete trades buttons */}
      <div className="btn-container">
        {/* add trade button */}
        <div className="btn" onClick={addTradeHandler}>
          Add Trade
        </div>

        {/* delete trades button */}
        <div className="btn btn-reverse">Delete Trades</div>
      </div>

      {/* Main list to show all trades */}
      <TradesList />

      {/* Add Trade Modal (show if toggleModal state is true) */}
      {toggleModal && (
        <AddTradeModal
          toggleModal={toggleModal}
          setToggleModal={setToggleModal}
        />
      )}
    </Wrapper>
  );
}

export default TradesComponent;
