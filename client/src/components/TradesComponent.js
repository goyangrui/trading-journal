import { useState } from "react";

import Wrapper from "../assets/wrappers/TradesComponent";

import { TradesList, AddTradeModal, Alert } from ".";

import { useAppContext } from "../context/appContext";

function TradesComponent() {
  // tag text local state variable
  const [tag, setTag] = useState("");

  // global state functions and variables
  const {
    selectedTrades,
    deleteTrade,
    createTag,
    showMainModal,
    toggleMainModal,
    showTagModal,
    toggleTagModal,
    showAlert,
  } = useAppContext();

  // add trade button handler (toggles modal)
  const addTradeHandler = (e) => {
    toggleMainModal();
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

  // add tag button handler
  const addTagHandler = () => {
    // clear the tag text box
    setTag("");
    // toggle tag modal
    toggleTagModal();
  };

  // handle change for tag text box
  const handleTag = (e) => {
    setTag(e.target.value);
  };

  // save tag function
  const submitTagHandler = (e) => {
    e.preventDefault();

    // create tag, update global tags array, then toggle tag modal
    const submitData = async () => {
      await createTag(tag);
    };

    submitData();
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

        {/* add tag button container*/}
        <div className="add-tag-container">
          {/* add tag button */}
          <button className="btn" onClick={addTagHandler}>
            Add Tag
          </button>
        </div>
      </div>

      {/* if the toggle add tag local state is true, display add tag modal */}
      {showTagModal && (
        <div className="add-tag-modal">
          <div className="tag-modal-content">
            {/* header */}
            <h3>Add tag</h3>

            {/* alert */}
            {showAlert && <Alert />}

            {/* modal form */}
            <form className="add-tag-form" onSubmit={submitTagHandler}>
              {/* text box for user to type tag they want to add */}
              <input
                name="tag"
                type="text"
                className="add-tag-text"
                onChange={handleTag}
              />

              {/* save and cancel button container */}
              <div className="btn-container">
                {/* button to save tag */}
                <button type="submit" className="btn">
                  save
                </button>
                {/* button to cancel tag creation */}
                <button
                  type="button"
                  className="btn btn-reverse"
                  onClick={addTagHandler}
                >
                  cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main list to show all trades */}
      <TradesList />

      {/* Add Trade Modal (show if toggleModal state is true) */}
      {showMainModal && <AddTradeModal />}
    </Wrapper>
  );
}

export default TradesComponent;
