import { useEffect, useState } from "react";
import moment from "moment";

import { FaTimes } from "react-icons/fa";
import { AiFillMinusSquare } from "react-icons/ai";

import { Loading } from ".";
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

  // global state variables and functions
  const {
    toggleEditTradeModal,
    getExecutions,
    deleteExecution,
    executions,
    updateTrade,
    editTrade: trade,
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
        await updateTrade(cellState);
      }

      // clear cell state activation flag and cell state values
      setActivatedCell("");
      setCellState({ ...cellState, value: "", executionInfo: "" });
    };

    processData();
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

  // handle click of execution delete button
  const handleExecDelete = (e, executionId) => {
    // send a request to delete the execution that was clicked

    const processData = async (executionId) => {
      await deleteExecution(executionId);
    };

    processData(executionId);
  };

  // handle modal close button
  const closeButtonHandler = () => {
    toggleEditTradeModal({});
  };

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
                    <th>Strike</th>
                    <th>Expire</th>
                    <th>Lot Size Multiplier</th>
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
                              <>${Math.round(trade.strikePrice * 100) / 100}</>
                            )
                          )}
                        </td>
                        {/* EXPIRATION DATE CELL */}
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
                        {/* LOT SIZE CELL */}
                        <td
                          id={`execution-${execution._id}-lot`}
                          onClick={handleCellClick}
                          onBlur={handleCellBlur}
                        >
                          {/* only if the market is futures, and the cell is activated */}
                          {activatedCell === `execution-${execution._id}-lot` &&
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
                        <td className="remove-button-cell">
                          <AiFillMinusSquare
                            onClick={(e) => {
                              handleExecDelete(e, execution._id);
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
}

export default EditTradeModal;
