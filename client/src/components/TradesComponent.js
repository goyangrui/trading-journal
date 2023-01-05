import { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";

import Wrapper from "../assets/wrappers/TradesComponent";

import { TradesList, AddTradeModal, Alert, EditTradeModal } from ".";

import { useAppContext } from "../context/appContext";

const initialFilterState = {
  symbol: "",
  sides: {
    long: false,
    short: false,
  },
  status: {
    open: false,
    win: false,
    loss: false,
    breakeven: false,
  },
  markets: {
    stock: false,
    options: false,
    futures: false,
  },
  date1: "",
  date2: "",
  tags: {},
};

function TradesComponent() {
  // tag text local state variable
  const [tag, setTag] = useState("");

  // local isLoading variable for loading the tags in the tag modal
  const [isLoading, setIsLoading] = useState(true);

  // local state variable for keeping track of the state of the dropdown overselect that is active
  const [activeDropdown, setActiveDropdown] = useState("");

  // local state for keeping track of the filter variables
  const [filterStates, setFilterStates] = useState({ ...initialFilterState });

  // local state variable for keeping track of the current page
  const [currentPage, setCurrentPage] = useState(1);

  // global state functions and variables
  const {
    selectedTrades,
    getTrades,
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
    numPages,
  } = useAppContext();

  // variable for keeping track of the pages (depending on numPages global state variable)
  const pages = Array.from({ length: numPages }, (_, index) => {
    return index + 1;
  });

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

      // reset filter state
      setFilterStates({ ...initialFilterState });

      // reset currentPage to 1
      setCurrentPage(1);
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

    // reset filter state
    setFilterStates({ ...initialFilterState });

    // reset currentPage to 1
    setCurrentPage(1);
  };

  // handle click of side/status/tag overselect
  const handleOverselectClick = (e, index) => {
    // if the activeDropdown that is set is the same as the one that is clicked
    if (activeDropdown === e.target.id) {
      setActiveDropdown("");
    } else {
      // set the active drop down overselect to be the id of the selected overselect
      setActiveDropdown(e.target.id);

      // get location of target element
      const targetDim = e.target.getBoundingClientRect();

      // set the position of the ref (dropdown options) to be right below the target that was clicked on
      dropdownElements.current[index].style.top = `${
        targetDim.height + targetDim.y
      }px`;
      dropdownElements.current[index].style.left = `${targetDim.x}px`;
    }
  };

  // handle apply filter and clear filter button clicks
  const handleFilterClick = async (e, clear) => {
    // reset the currentPage to the first page
    setCurrentPage(1);

    // if the user clicks the clear filters button
    if (clear) {
      // set filtersState to the initial filters state
      setFilterStates({ ...initialFilterState });
      // send request to get trades with initial filters state
      await getTrades(undefined, undefined, initialFilterState);
    } else {
      // send request to get trades with current filter state
      await getTrades(undefined, undefined, filterStates);
    }
  };

  // handle page button click
  const handlePageClick = async (e, page) => {
    // only if the current page is not the same as the given page
    if (page !== currentPage) {
      // set the currentPage to the passed in page
      setCurrentPage(page);

      // send a request to get trades with filter states, and page number
      await getTrades(undefined, undefined, filterStates, page);
    }
  };

  // references to dropdown elements
  const dropdownElements = useRef([]);

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

      {/* Filter container */}
      <div className="filter-container">
        {/* Filter by symbol (text box) */}
        <div>
          <input
            type="text"
            id="symbol-filter"
            placeholder="Symbol"
            value={filterStates.symbol}
            onChange={(e) => {
              setFilterStates({ ...filterStates, symbol: e.target.value });
            }}
          />
        </div>

        {/* Filter by side (multi checkbox select) */}
        <div className="dropdown-button">
          <select>
            <option>Side</option>
          </select>
          <div
            className="overselect"
            id="side-filter-overselect"
            onClick={(e) => {
              handleOverselectClick(e, 0);
            }}
          ></div>
        </div>
        {/* only show the dropdown options for side if this dropdown is active */}
        {
          <div
            className={
              activeDropdown === "side-filter-overselect"
                ? "dropdown-options side-options"
                : "dropdown-options side-options hide-options"
            }
            ref={(el) => (dropdownElements.current[0] = el)}
          >
            <label htmlFor="long-checkbox">
              <input
                type="checkbox"
                id="long-checkbox"
                value="LONG"
                onChange={(e) => {
                  setFilterStates({
                    ...filterStates,
                    sides: {
                      ...filterStates.sides,
                      long: !filterStates.sides.long,
                    },
                  });
                }}
                checked={!!filterStates.sides.long}
              />
              LONG
            </label>
            <label htmlFor="short-checkbox">
              <input
                type="checkbox"
                id="short-checkbox"
                value="SHORT"
                onChange={(e) => {
                  setFilterStates({
                    ...filterStates,
                    sides: {
                      ...filterStates.sides,
                      short: !filterStates.sides.short,
                    },
                  });
                }}
                checked={!!filterStates.sides.short}
              />
              SHORT
            </label>
          </div>
        }

        {/* Filter by status (multi checkbox select) */}
        <div className="dropdown-button">
          <select>
            <option>Status</option>
          </select>
          <div
            className="overselect"
            id="status-filter-overselect"
            onClick={(e) => {
              handleOverselectClick(e, 1);
            }}
          ></div>
        </div>
        {
          <div
            className={
              activeDropdown === "status-filter-overselect"
                ? "dropdown-options status-options"
                : "dropdown-options status-options hide-options"
            }
            ref={(el) => (dropdownElements.current[1] = el)}
          >
            <label htmlFor="open-checkbox">
              <input
                type="checkbox"
                id="open-checkbox"
                value="OPEN"
                onChange={(e) => {
                  setFilterStates({
                    ...filterStates,
                    status: {
                      ...filterStates.status,
                      open: !filterStates.status.open,
                    },
                  });
                }}
                checked={!!filterStates.status.open}
              />
              OPEN
            </label>
            <label htmlFor="win-checkbox">
              <input
                type="checkbox"
                id="win-checkbox"
                value="WIN"
                onChange={(e) => {
                  setFilterStates({
                    ...filterStates,
                    status: {
                      ...filterStates.status,
                      win: !filterStates.status.win,
                    },
                  });
                }}
                checked={!!filterStates.status.win}
              />
              WIN
            </label>
            <label htmlFor="loss-checkbox">
              <input
                type="checkbox"
                id="loss-checkbox"
                value="LOSS"
                onChange={(e) => {
                  setFilterStates({
                    ...filterStates,
                    status: {
                      ...filterStates.status,
                      loss: !filterStates.status.loss,
                    },
                  });
                }}
                checked={!!filterStates.status.loss}
              />
              LOSS
            </label>
            <label htmlFor="breakeven-checkbox">
              <input
                type="checkbox"
                id="breakeven-checkbox"
                value="BREAKEVEN"
                onChange={(e) => {
                  setFilterStates({
                    ...filterStates,
                    status: {
                      ...filterStates.status,
                      breakeven: !filterStates.status.breakeven,
                    },
                  });
                }}
                checked={!!filterStates.status.breakeven}
              />
              BREAKEVEN
            </label>
          </div>
        }

        {/* Filter by market (multi checkbox select) */}
        <div className="dropdown-button">
          <select>
            <option>Market</option>
          </select>
          <div
            className="overselect"
            id="market-filter-overselect"
            onClick={(e) => {
              handleOverselectClick(e, 2);
            }}
          ></div>
        </div>
        {
          <div
            className={
              activeDropdown === "market-filter-overselect"
                ? "dropdown-options market-options"
                : "dropdown-options market-options hide-options"
            }
            ref={(el) => (dropdownElements.current[2] = el)}
          >
            <label htmlFor="stock-checkbox">
              <input
                type="checkbox"
                id="stock-checkbox"
                value="STOCK"
                onChange={(e) => {
                  setFilterStates({
                    ...filterStates,
                    markets: {
                      ...filterStates.markets,
                      stock: !filterStates.markets.stock,
                    },
                  });
                }}
                checked={!!filterStates.markets.stock}
              />
              STOCK
            </label>
            <label htmlFor="options-checkbox">
              <input
                type="checkbox"
                id="options-checkbox"
                value="OPTIONS"
                onChange={(e) => {
                  setFilterStates({
                    ...filterStates,
                    markets: {
                      ...filterStates.markets,
                      options: !filterStates.markets.options,
                    },
                  });
                }}
                checked={!!filterStates.markets.options}
              />
              OPTIONS
            </label>
            <label htmlFor="futures-checkbox">
              <input
                type="checkbox"
                id="futures-checkbox"
                value="FUTURES"
                onChange={(e) => {
                  setFilterStates({
                    ...filterStates,
                    markets: {
                      ...filterStates.markets,
                      futures: !filterStates.markets.futures,
                    },
                  });
                }}
                checked={!!filterStates.markets.futures}
              />
              FUTURES
            </label>
          </div>
        }

        {/* Filter by date (select start and end date) */}
        <div>
          <input
            type="date"
            id="date-filter1"
            onChange={(e) => {
              setFilterStates({ ...filterStates, date1: e.target.value });
            }}
            value={filterStates.date1}
          />
        </div>
        <div>
          <input
            type="date"
            id="date-filter2"
            onChange={(e) => {
              setFilterStates({ ...filterStates, date2: e.target.value });
            }}
            value={filterStates.date2}
          />
        </div>

        {/* Filter by tag (multi checkbox select) */}
        <div className="dropdown-button">
          <select>
            <option>Tag</option>
          </select>
          <div
            className="overselect"
            id="tag-filter-overselect"
            onClick={(e) => {
              handleOverselectClick(e, 3);
            }}
          ></div>
        </div>
        {
          <div
            className={
              activeDropdown === "tag-filter-overselect"
                ? "dropdown-options tag-options"
                : "dropdown-options tag-options hide-options"
            }
            ref={(el) => (dropdownElements.current[3] = el)}
          >
            {/* for every tag */}
            {tags.map((tag, index) => {
              return (
                <label htmlFor={`tag${index}-checkbox`} key={`tag${index}`}>
                  <input
                    type="checkbox"
                    id={`tag${index}-checkbox`}
                    value={tag._id}
                    onChange={(e) => {
                      setFilterStates({
                        ...filterStates,
                        tags: {
                          ...filterStates.tags,
                          [tag._id]: !filterStates.tags[tag._id],
                        },
                      });
                    }}
                    checked={!!filterStates.tags[tag._id]}
                  />
                  {tag.text}
                </label>
              );
            })}
          </div>
        }

        {/* Filter management buttons */}
        <div className="filter-buttons-container">
          <button
            className="btn filter-btn"
            onClick={(e) => {
              handleFilterClick(e, false);
            }}
          >
            Apply Filters
          </button>
          <button
            className="btn btn-reverse filter-btn"
            onClick={(e) => {
              handleFilterClick(e, true);
            }}
          >
            Clear Filters
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
      {/* Pass the filterStates state variable to TradesList component so that the filters are maintained when user sorts the trades */}
      <TradesList filterStates={filterStates} />

      {/* Page switching bar */}
      {/* only show page switching bar if there are more than 1 pages */}
      {numPages > 1 && (
        <div className="page-btn-container">
          {/* show a button for every page */}
          {pages.map((page, index) => {
            return (
              <button
                className={page === currentPage ? "btn set-page-btn" : "btn"}
                type="button"
                key={index}
                onClick={(e) => {
                  handlePageClick(e, page);
                }}
              >
                {page}
              </button>
            );
          })}
        </div>
      )}

      {/* Add Trade Modal (show if toggleModal state is true) */}
      {showMainModal && (
        <AddTradeModal
          initialFilterState={initialFilterState}
          setFilterStates={setFilterStates}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* If the showEditTradeModal flag is set to true, show the EditTradeModal component */}
      {showEditTradeModal && (
        <EditTradeModal
          initialFilterState={initialFilterState}
          setFilterStates={setFilterStates}
          setCurrentPage={setCurrentPage}
        />
      )}
    </Wrapper>
  );
}

export default TradesComponent;
