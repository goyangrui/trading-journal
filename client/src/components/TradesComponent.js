import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

import Wrapper from "../assets/wrappers/TradesComponent";

import { TradesList, AddTradeModal, Alert, EditTradeModal } from ".";

import { useAppContext } from "../context/appContext";

function TradesComponent() {
  // tag text local state variable
  const [tag, setTag] = useState("");

  // local isLoading variable for loading the tags in the tag modal
  const [isLoading, setIsLoading] = useState(true);

  // global state functions and variables
  const {
    selectedTrades,
    deleteTrade,
    createTag,
    showMainModal,
    toggleMainModal,
    showTagModal,
    toggleTagModal,
    clearAlert,
    showAlert,
    fetchTags,
    tags,
    deleteTag,
    showEditTradeModal,
    editTrade,
  } = useAppContext();

  // useEffect
  // on initial render, fetch the tags and retrieve the updated global state tags variable to be displayed to the user
  useEffect(() => {
    const loadData = async () => {
      await fetchTags();
      setIsLoading(false);
    };
    loadData();
  }, []);

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
    clearAlert();
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
      setTag("");
    };

    submitData();
  };

  // delete tag button handler
  const deleteTagHandler = (tagId) => {
    deleteTag(tagId);
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
            Manage Tags
          </button>
        </div>
      </div>

      {/* if the toggle add tag local state is true, display add tag modal */}
      {showTagModal && (
        <div className="add-tag-modal">
          <div className="tag-modal-content">
            {/* header */}
            <h3>Manage tags</h3>

            {/* alert */}
            {showAlert && <Alert />}

            {/* modal delete tag container */}
            {/* only show this container if tags have been loaded */}
            {!isLoading && (
              <div className="delete-tag-container">
                {/* display existing tags with remove button */}
                {tags.map((tagItem) => {
                  return (
                    <span key={tagItem._id} className="delete-tag-item">
                      <button
                        className="close-button"
                        onClick={() => {
                          deleteTagHandler(tagItem._id);
                        }}
                      >
                        <FaTimes />
                      </button>
                      {tagItem.text}
                    </span>
                  );
                })}
              </div>
            )}

            {/* modal add tag form */}
            <form className="add-tag-form" onSubmit={submitTagHandler}>
              {/* text box for user to type tag they want to add */}
              <input
                name="tag"
                type="text"
                className="add-tag-text"
                onChange={handleTag}
                value={tag}
                autoComplete="off"
              />

              {/* save and cancel button container */}
              <div className="btn-container">
                {/* button to save tag */}
                <button type="submit" className="btn">
                  add
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

      {/* If the showEditTradeModal flag is set to true, show the EditTradeModal component */}
      {showEditTradeModal && <EditTradeModal editTrade={editTrade} />}
    </Wrapper>
  );
}

export default TradesComponent;
