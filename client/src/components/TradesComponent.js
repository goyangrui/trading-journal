import { useState } from "react";

import Wrapper from "../assets/wrappers/TradesComponent";

import { TradesList, AddTradeModal } from ".";

import { useAppContext } from "../context/appContext";

function TradesComponent() {
  // local state variables
  const [toggleModal, setToggleModal] = useState(false);

  // global state functions and variables
  const { selectedTrades, deleteTrade } = useAppContext();

  // add trade button handler (toggles modal)
  const addTradeHandler = (e) => {
    setToggleModal(!toggleModal);
  };

  // delete trade button handler
  const deleteTradeHandler = (selectedTrades) => {
    // convert object to array of entries
    const selectedTradesArr = Object.entries(selectedTrades);

    // filter selectedTradesArr to only those whose second index is true
    const tradesToDeletePair = selectedTradesArr.filter((pair) => {
      return pair[1];
    });

    // if the tradesToDeletePair array is NOT empty
    if (tradesToDeletePair.length) {
      // map each pair of entries to an array of key entries as strings
      const tradesToDelete = tradesToDeletePair.map((pair) => {
        return pair[0];
      });

      // delete the trade(s)
      deleteTrade(tradesToDelete);
    }
    // otherwise don't do anything
  };

  return (
    <Wrapper>
      {/* Button container with add trade, and delete trades buttons */}
      <div className="btn-container">
        {/* add trade button */}
        <button className="btn" onClick={addTradeHandler}>
          Add Trade
        </button>

        {/* delete trades button */}
        <button
          className="btn btn-reverse"
          onClick={(e) => {
            deleteTradeHandler(selectedTrades);
          }}
        >
          Delete Trades
        </button>
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
