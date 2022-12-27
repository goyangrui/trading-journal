import { useEffect, useState } from "react";
import moment from "moment";

import { FaTimes } from "react-icons/fa";
import { AiFillMinusSquare, AiFillPlusSquare } from "react-icons/ai";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";

import { Loading, Alert } from ".";
import Wrapper from "../assets/wrappers/EditTradeModal";

import { useAppContext } from "../context/appContext";

function EditTradeModal() {
  // local state variables
  const [isLoading, setIsLoading] = useState(true);

  // local state for keeping track of the state of the current cell being editted
  const [cellState, setCellState] = useState({
    value: "",
    executionInfo: "",
  });

  // local state for keeping track of the cell that has been activated
  const [activatedCell, setActivatedCell] = useState("");

  // local state variable for keeping track of the tag dropdown
  const [toggleDropdown, setToggleDropdown] = useState(false);

  // local state variable for tracking whether a trade edit request is still being processed
  const [tradeProcess, setTradeProcess] = useState(false);

  // global state variables and functions
  const {
    toggleEditTradeModal,
    getExecutions,
    createExecution,
    addExecCellState,
    setAddExecCellState,
    deleteExecution,
    executions,
    updateTrade,
    editTrade: trade,
    tags,
    selectedTags,
    setSelectedTags,
    showAlert,
    clearAlert,
  } = useAppContext();

  // handle edittable cell click
  const handleCellClick = (e) => {
    // only if the event target and event currentTarget are the same (prevent child element from triggering event)
    if (e.target === e.currentTarget) {
      // set the activatedCell to the id of the cell that was clicked
      setActivatedCell(e.target.id);
    }
  };

  // handle blur of edittable cell
  const handleCellBlur = (e) => {
    // if the user submits form by pressing enter, prevent default form submission
    e.preventDefault();

    // send request to back end with edited cell information, and associated execution information
    // if both the value and executionInfo state variables are not empty strings
    const processData = async () => {
      if (cellState.value && cellState.executionInfo) {
        // send a request to edit the execution and trade
        await updateTrade({ ...cellState });
      }

      // clear cell state activation flag and cell state values
      setActivatedCell("");
      setCellState({ ...cellState, value: "", executionInfo: "" });
    };

    processData();
  };

  // handle blur of add execution property cell
  const handleAddCellBlur = (e) => {
    e.preventDefault();

    // deactivate the activated cell
    setActivatedCell("");
  };

  // handle change of state of form inputs in executions
  const handleChange = (e) => {
    console.log("input state changed");
    setCellState({
      ...cellState,
      value: e.target.value,
      executionInfo: activatedCell,
    });
  };

  // handle change of state of form inputs in add executions forms
  const handleAddExecChange = (e, execProp) => {
    console.log(execProp);
    console.log(e.target.value);
    setAddExecCellState({ ...addExecCellState, [execProp]: e.target.value });
  };

  // handle click of execution delete button
  const handleExecDelete = (e, executionId) => {
    // send a request to delete the execution that was clicked

    const processData = async (executionId) => {
      await deleteExecution(executionId);
    };

    processData(executionId);
  };

  // handle click of execution add button
  const handleExecAdd = (e) => {
    // send request to backend to add new execution
    const processData = async () => {
      await createExecution(addExecCellState, trade._id);
    };

    processData();
  };

  // handle modal close button
  const closeButtonHandler = () => {
    // toggle the modal, clear any alerts, and set the add execution global state to the initial state
    toggleEditTradeModal({});
    clearAlert();
    setAddExecCellState({
      action: "",
      execDate: "",
      positionSize: "",
      price: "",
      commissions: "",
      fees: "",
    });
  };

  // Tag functions
  const handleTagDropdown = (e) => {
    setToggleDropdown(!toggleDropdown);
  };

  // handle tag select
  const handleTagSelect = (tagId, tradeId) => {
    const processData = async () => {
      // set trade process state to true (prevent user from sending request when these update trade requests are still being processed)
      setTradeProcess(true);

      // send request to edit this trade (add or remove tags based on selectedTags state variable)
      await updateTrade({
        value: undefined,
        executionInfo: undefined,
        tradeId,
        tagInfo: { [tagId]: !selectedTags[tagId] },
      });

      // after trade has been edited, set id of selected tag to be the opposite state (true or false) of what it was originally
      // update selected tags first
      await setSelectedTags({
        ...selectedTags,
        [tagId]: !selectedTags[tagId],
      });

      setTradeProcess(false);
    };
    processData();
  };

  // on initial render
  useEffect(() => {
    // if there are any tags, loop through each tag, and set the selected tags to all false (except the ones that exist in the trade)
    if (tags.length !== 0) {
      // map the tags array to a map of tag id's as the key, and true/false as the value depending on whether or not the tag exists in the trade
      const tagIdMap = new Map(
        tags.map((tag) => {
          // if the current tag in the loop exists in the trade's tags
          if (trade.tags[tag._id]) {
            // set this tag as being selected by default (set value of this tag id to true)
            return [tag._id, true];
          } else {
            // otherwise, set this tag as being not selected by default (set value of this tag id to false)
            return [tag._id, false];
          }
        })
      );

      // convert the Map to an object
      const tagIdObject = Object.fromEntries(tagIdMap);

      // set the global selectedTags state
      setSelectedTags({ ...tagIdObject });
    }
  }, []);

  // on initial render, fetch all executions
  useEffect(() => {
    const loadData = async () => {
      await getExecutions(trade._id);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    loadData();
  }, []);

  return (
    <Wrapper>
      <div className="modal-content">
        {/* modal header */}
        <div className="modal-header">
          <h3 className="gradient-heading">{trade.symbol.toUpperCase()}</h3>

          {/* close modal button */}
          <button
            type="button"
            className="modal-close-btn"
            onClick={closeButtonHandler}
          >
            <FaTimes />
          </button>
        </div>

        {/* Show alert if there is an alert */}
        {showAlert && <Alert />}

        {/* display modal body once necessary data is loaded */}
        {isLoading ? (
          <div className="loading-container">
            <Loading />
          </div>
        ) : (
          <div className="modal-body">
            {/* trade details */}
            <div className="table-container">
              <table className="trades-table">
                {/* table header row with names of metrics and other information*/}
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Open Date</th>
                    <th>Market</th>
                    <th>Symbol</th>
                    <th>Entry</th>
                    <th>Exit</th>
                    <th>Position Size</th>
                    <th>$ Return</th>
                    <th>% Return</th>
                    <th>Net Return</th>
                    <th>Side</th>
                  </tr>
                </thead>
                {/* display the trade and their relevant trade metrics information as a row in the table body */}
                <tbody>
                  <tr className="table-body-row" key={trade._id}>
                    <td>
                      <span
                        className={`label ${
                          trade.status === "OPEN"
                            ? "status-open"
                            : trade.status === "WIN"
                            ? "status-win"
                            : "status-loss"
                        }`}
                      >
                        {trade.status}
                      </span>
                    </td>
                    <td>
                      {moment(trade.openDate).utc().format("MMM DD, YYYY")}
                    </td>
                    <td>{trade.market}</td>
                    <td>{trade.symbol}</td>
                    <td>${Math.round(trade.averageEntry * 100) / 100}</td>
                    <td>${Math.round(trade.averageExit * 100) / 100}</td>
                    <td>{Math.round(trade.positionSize * 100) / 100}</td>
                    <td>
                      <span
                        className={`${
                          trade.dollarReturn > 0
                            ? "return-win"
                            : trade.dollarReturn === 0
                            ? "return-even"
                            : "return-loss"
                        }`}
                      >
                        ${Math.round(trade.dollarReturn * 100) / 100}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${
                          trade.dollarReturn > 0
                            ? "return-win"
                            : trade.dollarReturn === 0
                            ? "return-even"
                            : "return-loss"
                        }`}
                      >
                        {Math.round(trade.percentReturn * 100) / 100}%
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${
                          trade.dollarReturn > 0
                            ? "return-win"
                            : trade.dollarReturn === 0
                            ? "return-even"
                            : "return-loss"
                        }`}
                      >
                        ${Math.round(trade.netReturn * 100) / 100}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`label ${
                          trade.side === "LONG" ? "side-long" : "side-short"
                        }`}
                      >
                        {trade.side}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* executions table */}
            <div className="table-container">
              <table className="trades-table">
                {/* executions table header with names of metrics and other information */}
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Type</th>
                    {/* only display strike price header if the trade market is options */}
                    {trade.market.toLowerCase() === "options" && (
                      <th>Strike</th>
                    )}
                    {/* Only display expiration date cell if the trade market is either options or futures */}
                    {(trade.market.toLowerCase() === "options" ||
                      trade.market.toLowerCase() === "futures") && (
                      <th>Expire</th>
                    )}
                    {/* Only display lot size multiplier cell if the trade market is futures */}
                    {trade.market.toLowerCase() === "futures" && (
                      <th>Lot Size Multiplier</th>
                    )}
                    <th>Execution Date</th>
                    <th>Position Size</th>
                    <th>Price</th>
                    <th>Commissions</th>
                    <th>Fees</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {/* for every execution, display a row showing the execution information */}
                  {executions.map((execution) => {
                    return (
                      <tr className="table-body-row" key={execution._id}>
                        {/* ACTION CELL */}
                        {/* when this cell is clicked, set local cell-activation state variable */}
                        <td
                          id={`execution-${execution._id}-action`}
                          onClick={handleCellClick}
                          onBlur={handleCellBlur}
                        >
                          {/* if this cell is activated, display the form, otherwise display the original cell value */}
                          {activatedCell ===
                          `execution-${execution._id}-action` ? (
                            <form onSubmit={handleCellBlur}>
                              <select autoFocus onChange={handleChange}>
                                <option value=""></option>
                                <option value="BUY">BUY</option>
                                <option value="SELL">SELL</option>
                              </select>
                            </form>
                          ) : (
                            <>{execution.action}</>
                          )}
                        </td>
                        {/* ASSET TYPE CELL */}
                        <td
                          id={`execution-${execution._id}-option`}
                          onClick={handleCellClick}
                          onBlur={handleCellBlur}
                        >
                          {/* if this cell is activated, display the form, otherwise display the original cell value */}
                          {activatedCell ===
                          `execution-${execution._id}-option` ? (
                            <form onSubmit={handleCellBlur}>
                              <select autoFocus onChange={handleChange}>
                                <option value=""></option>
                                <option value="STOCK">STOCK</option>
                                <option value="CALL">CALL</option>
                                <option value="PUT">PUT</option>
                                <option value="FUTURES">FUTURES</option>
                              </select>
                            </form>
                          ) : trade.market.toLowerCase() === "options" ? (
                            trade.option
                          ) : (
                            trade.market
                          )}
                          {}
                        </td>
                        {/* STRIKE PRICE CELL */}
                        {/* only display this stirke price cell if the trade market is options */}
                        {trade.market.toLowerCase() === "options" && (
                          <td
                            id={`execution-${execution._id}-strike`}
                            onClick={handleCellClick}
                            onBlur={handleCellBlur}
                          >
                            {/* only if the market is options, and this cell is activated */}
                            {activatedCell ===
                              `execution-${execution._id}-strike` &&
                            trade.market.toLowerCase() === "options" ? (
                              <form onSubmit={handleCellBlur}>
                                <input
                                  type="number"
                                  min="0.001"
                                  step="0.001"
                                  autoFocus
                                  onChange={handleChange}
                                />
                              </form>
                            ) : (
                              // otherwise, display the strike price only if it exists
                              trade.strikePrice && (
                                <>
                                  ${Math.round(trade.strikePrice * 100) / 100}
                                </>
                              )
                            )}
                          </td>
                        )}
                        {/* EXPIRATION DATE CELL */}
                        {/* Only display expiration date cell if the trade market is either options or futures */}
                        {(trade.market.toLowerCase() === "options" ||
                          trade.market.toLowerCase() === "futures") && (
                          <td
                            id={`execution-${execution._id}-expire`}
                            onClick={handleCellClick}
                            onBlur={handleCellBlur}
                          >
                            {/* only if the market is options or futures, and the cell is activated */}
                            {activatedCell ===
                              `execution-${execution._id}-expire` &&
                            (trade.market.toLowerCase() === "options" ||
                              trade.market.toLowerCase() === "futures") ? (
                              <form onSubmit={handleCellBlur}>
                                <input
                                  type="date"
                                  autoFocus
                                  onChange={handleChange}
                                />
                              </form>
                            ) : (
                              // otherwise, only if the expiration date exists, display it
                              trade.expDate &&
                              moment(trade.expDate).utc().format("MMM DD, YYYY")
                            )}
                          </td>
                        )}
                        {/* LOT SIZE CELL */}
                        {/* Only display lot size multiplier cell if the trade market is futures */}
                        {trade.market.toLowerCase() === "futures" && (
                          <td
                            id={`execution-${execution._id}-lot`}
                            onClick={handleCellClick}
                            onBlur={handleCellBlur}
                          >
                            {/* only if the market is futures, and the cell is activated */}
                            {activatedCell ===
                              `execution-${execution._id}-lot` &&
                            trade.market.toLowerCase() === "futures" ? (
                              <form onSubmit={handleCellBlur}>
                                <input
                                  type="number"
                                  autoFocus
                                  min="0.001"
                                  step="0.001"
                                  onChange={handleChange}
                                />
                              </form>
                            ) : (
                              // otherwise, only if the lot size multiplier exists, display it
                              trade.lotSize && trade.lotSize
                            )}
                          </td>
                        )}
                        {/* EXECUTION DATE CELL */}
                        <td
                          id={`execution-${execution._id}-exec`}
                          onClick={handleCellClick}
                          onBlur={handleCellBlur}
                        >
                          {/* only if the cell is activated */}
                          {activatedCell ===
                          `execution-${execution._id}-exec` ? (
                            <form onSubmit={handleCellBlur}>
                              <input
                                type="date"
                                autoFocus
                                onChange={handleChange}
                              />
                            </form>
                          ) : (
                            // otherwise, display the execution date
                            moment(execution.execDate)
                              .utc()
                              .format("MMM DD, YYYY")
                          )}
                        </td>
                        {/* POSITION SIZE CELL */}
                        <td
                          id={`execution-${execution._id}-position`}
                          onClick={handleCellClick}
                          onBlur={handleCellBlur}
                        >
                          {/* if the cell is activated */}
                          {activatedCell ===
                          `execution-${execution._id}-position` ? (
                            <form onSubmit={handleCellBlur}>
                              <input
                                type="number"
                                autoFocus
                                min="0.001"
                                step="0.001"
                                onChange={handleChange}
                              />
                            </form>
                          ) : (
                            // otherwise, just show the position size
                            execution.positionSize
                          )}
                        </td>
                        {/* PRICE CELL */}
                        <td
                          id={`execution-${execution._id}-price`}
                          onClick={handleCellClick}
                          onBlur={handleCellBlur}
                        >
                          {/* if the cell is activated */}
                          {activatedCell ===
                          `execution-${execution._id}-price` ? (
                            <form onSubmit={handleCellBlur}>
                              <input
                                type="number"
                                autoFocus
                                min="0.001"
                                step="0.001"
                                onChange={handleChange}
                              />
                            </form>
                          ) : (
                            <>${Math.round(execution.price * 100) / 100}</>
                          )}
                        </td>
                        {/* COMMISSIONS CELL */}
                        <td
                          id={`execution-${execution._id}-commissions`}
                          onClick={handleCellClick}
                          onBlur={handleCellBlur}
                        >
                          {/* if the cell is activated */}
                          {activatedCell ===
                          `execution-${execution._id}-commissions` ? (
                            <form onSubmit={handleCellBlur}>
                              <input
                                type="number"
                                autoFocus
                                min="0"
                                step="0.001"
                                onChange={handleChange}
                              />
                            </form>
                          ) : (
                            <>
                              ${Math.round(execution.commissions * 100) / 100}
                            </>
                          )}
                        </td>
                        {/* FEES CELL */}
                        <td
                          id={`execution-${execution._id}-fees`}
                          onClick={handleCellClick}
                          onBlur={handleCellBlur}
                        >
                          {/* if the cell is activated */}
                          {activatedCell ===
                          `execution-${execution._id}-fees` ? (
                            <form onSubmit={handleCellBlur}>
                              <input
                                type="number"
                                autoFocus
                                min="0"
                                step="0.001"
                                onChange={handleChange}
                              />
                            </form>
                          ) : (
                            <>${Math.round(execution.fees * 100) / 100}</>
                          )}
                        </td>
                        {/* REMOVE EXECUTION BUTTON CELL */}
                        <td className="button-cell">
                          <AiFillMinusSquare
                            onClick={(e) => {
                              handleExecDelete(e, execution._id);
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}

                  {/* ADD EXECUTION TABLE ROW */}
                  <tr className="table-body-row">
                    {/* ADD ACTION CELL */}
                    <td
                      id="add-execution-action"
                      className={
                        addExecCellState["action"] === ""
                          ? "add-cell-empty"
                          : "add-cell"
                      }
                      onClick={handleCellClick}
                      onBlur={handleAddCellBlur}
                    >
                      {/* Show drop down for action only if this add execution cell is activated */}
                      {activatedCell === "add-execution-action" ? (
                        <form onSubmit={handleAddCellBlur}>
                          <select
                            autoFocus
                            onChange={(e) => {
                              handleAddExecChange(e, "action");
                            }}
                          >
                            <option value=""></option>
                            <option value="BUY">BUY</option>
                            <option value="SELL">SELL</option>
                          </select>
                        </form>
                      ) : addExecCellState["action"] === "" ? (
                        "Add"
                      ) : (
                        addExecCellState["action"]
                      )}
                    </td>
                    {/* ADD TYPE CELL */}
                    <td id="add-execution-market">
                      {trade.market.toLowerCase() === "options"
                        ? trade.option
                        : trade.market}
                    </td>
                    {/* ADD STRIKE PRICE CELL */}
                    {/* only display strike price cell if the trade market is options */}
                    {trade.market.toLowerCase() === "options" && (
                      <td id="add-execution-strikePrice">
                        {trade.strikePrice && (
                          <>${Math.round(trade.strikePrice * 100) / 100}</>
                        )}
                      </td>
                    )}
                    {/* ADD EXPIRATION DATE CELL */}
                    {/* Only display expiration date cell if the trade market is either options or futures */}
                    {(trade.market.toLowerCase() === "options" ||
                      trade.market.toLowerCase() === "futures") && (
                      <td id="add-execution-expDate">
                        {trade.expDate &&
                          moment(trade.expDate).utc().format("MMM DD, YYYY")}
                      </td>
                    )}
                    {/* ADD LOT SIZE CELL */}
                    {/* Only display lot size multiplier cell if the trade market is futures */}
                    {trade.market.toLowerCase() === "futures" && (
                      <td id="add-execution-lotSize">
                        {trade.lotSize && trade.lotSize}
                      </td>
                    )}
                    {/* ADD EXECUTION DATE CELL */}
                    <td
                      id="add-execution-execDate"
                      className={
                        addExecCellState["execDate"] === ""
                          ? "add-cell-empty"
                          : "add-cell"
                      }
                      onClick={handleCellClick}
                      onBlur={handleAddCellBlur}
                    >
                      {/* Only display execution date form if this cell is activated */}
                      {activatedCell === "add-execution-execDate" ? (
                        <form>
                          <input
                            autoFocus
                            type="date"
                            onChange={(e) => {
                              handleAddExecChange(e, "execDate");
                            }}
                          />
                        </form>
                      ) : addExecCellState["execDate"] === "" ? (
                        "Add"
                      ) : (
                        moment(addExecCellState["execDate"])
                          .utc()
                          .format("MMM DD, YYYY")
                      )}
                    </td>
                    {/* ADD POSITION SIZE CELL */}
                    <td
                      id="add-execution-positionSize"
                      className={
                        addExecCellState["positionSize"] === ""
                          ? "add-cell-empty"
                          : "add-cell"
                      }
                      onClick={handleCellClick}
                      onBlur={handleAddCellBlur}
                    >
                      {/* Only display position size form if this cell is activated */}
                      {activatedCell === "add-execution-positionSize" ? (
                        <form onSubmit={handleAddCellBlur}>
                          <input
                            type="number"
                            autoFocus
                            min="0.001"
                            step="0.001"
                            onChange={(e) => {
                              handleAddExecChange(e, "positionSize");
                            }}
                          />
                        </form>
                      ) : addExecCellState["positionSize"] === "" ? (
                        "Add"
                      ) : (
                        addExecCellState["positionSize"]
                      )}
                    </td>
                    {/* ADD PRICE CELL */}
                    <td
                      id="add-execution-price"
                      className={
                        addExecCellState["price"] === ""
                          ? "add-cell-empty"
                          : "add-cell"
                      }
                      onClick={handleCellClick}
                      onBlur={handleAddCellBlur}
                    >
                      {/* Only display execution price form if this cell is activated */}
                      {activatedCell === "add-execution-price" ? (
                        <form onSubmit={handleAddCellBlur}>
                          <input
                            type="number"
                            autoFocus
                            min="0.001"
                            step="0.001"
                            onChange={(e) => {
                              handleAddExecChange(e, "price");
                            }}
                          />
                        </form>
                      ) : addExecCellState["price"] === "" ? (
                        "Add"
                      ) : (
                        `$${addExecCellState["price"]}`
                      )}
                    </td>
                    {/* ADD COMMISSIONS CELL */}
                    <td
                      id="add-execution-commissions"
                      className={
                        addExecCellState["commissions"] === ""
                          ? "add-cell-empty"
                          : "add-cell"
                      }
                      onClick={handleCellClick}
                      onBlur={handleAddCellBlur}
                    >
                      {/* Only display commissions form if this cell is activated */}
                      {activatedCell === "add-execution-commissions" ? (
                        <form onSubmit={handleAddCellBlur}>
                          <input
                            type="number"
                            autoFocus
                            min="0"
                            step="0.001"
                            onChange={(e) => {
                              handleAddExecChange(e, "commissions");
                            }}
                          />
                        </form>
                      ) : addExecCellState["commissions"] === "" ? (
                        "Add"
                      ) : (
                        `$${addExecCellState["commissions"]}`
                      )}
                    </td>
                    {/* ADD FEES CELL */}
                    <td
                      id="add-execution-fees"
                      className={
                        addExecCellState["fees"] === ""
                          ? "add-cell-empty"
                          : "add-cell"
                      }
                      onClick={handleCellClick}
                      onBlur={handleAddCellBlur}
                    >
                      {/* Only display fees form if this cell is activated */}
                      {activatedCell === "add-execution-fees" ? (
                        <form onSubmit={handleAddCellBlur}>
                          <input
                            type="number"
                            autoFocus
                            min="0"
                            step="0.001"
                            onChange={(e) => {
                              handleAddExecChange(e, "fees");
                            }}
                          />
                        </form>
                      ) : addExecCellState["fees"] === "" ? (
                        "Add"
                      ) : (
                        `$${addExecCellState["fees"]}`
                      )}
                    </td>
                    {/* ADD EXECUTION CELL */}
                    <td className="button-cell">
                      <AiFillPlusSquare onClick={handleExecAdd} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* TAGS CONTAINER FOR ADDING AND REMOVING TAGS */}
            <div className="tags-container">
              {/* header */}
              <div className="tags-container-header">
                <h4 className="gradient-heading">Tags</h4>
              </div>

              {/* tag dropdown container */}
              <div className="multi-select-dropdown-container">
                <div
                  className="multi-select-dropdown"
                  onClick={handleTagDropdown}
                >
                  {/* tags for this trade will be displayed */}
                  {tags.map((tag) => {
                    // only show tag if it is selected
                    if (selectedTags[tag._id]) {
                      return (
                        <div key={tag._id} className="selected-tag-item">
                          {tag.text}
                        </div>
                      );
                    }
                  })}

                  {/* dropdown icon */}
                  <div className="dropdown-button-container">
                    <IoIosArrowDropdownCircle />
                  </div>
                </div>
                {/* list of options */}
                {/* only show list of options if dropdown is toggled */}
                {toggleDropdown && (
                  <ul className="tag-options-list">
                    {tags.map((tag) => {
                      return (
                        <li
                          id={tag._id}
                          key={tag._id}
                          className={
                            tradeProcess ? "tag-item disable" : "tag-item"
                          }
                          onClick={(e) => {
                            handleTagSelect(tag._id, trade._id);
                          }}
                        >
                          {/* if this tag has been selected, show the checked box, otherwise show the unchecked box */}
                          {selectedTags[tag._id] ? (
                            <ImCheckboxChecked />
                          ) : (
                            <ImCheckboxUnchecked />
                          )}
                          {tag.text}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            {/* SCREENSHOT NOTES CONTAINER FOR ADDING/REMOVING SCREENSHOTS */}
            <div className="screenshots-container">
              {/* header */}
              <div className="screenshots-container-header">
                <h4 className="gradient-heading">Screenshots</h4>
              </div>
            </div>

            {/* NOTES CONTAINER FOR EDITING NOTES */}
            <div className="notes-container">
              {/* header */}
              <div className="notes-container-header">
                <h4 className="gradient-heading">Notes</h4>
              </div>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
}

export default EditTradeModal;
