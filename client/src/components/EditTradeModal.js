import { useEffect, useState } from "react";
import moment from "moment";

import { FaTimes } from "react-icons/fa";

import { Loading } from ".";
import Wrapper from "../assets/wrappers/EditTradeModal";

import { useAppContext } from "../context/appContext";

function EditTradeModal({ editTrade: trade }) {
  // local state variables
  const [isLoading, setIsLoading] = useState(true);

  // global state variables and functions
  const { toggleEditTradeModal, getExecutions, executions } = useAppContext();

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
                    <th>Expire</th>
                    <th>Strike</th>
                    <th>Execution Date</th>
                    <th>Position Size</th>
                    <th>Price</th>
                    <th>Commissions</th>
                    <th>Fees</th>
                  </tr>
                </thead>
                <tbody>
                  {/* for every execution, display a row showing the execution information */}
                  {executions.map((execution) => {
                    return (
                      <tr className="table-body-row" key={execution._id}>
                        <td>{execution.action}</td>
                        <td>{trade.market}</td>
                        <td>
                          {moment(execution.expDate)
                            .utc()
                            .format("MMM DD, YYYY")}
                        </td>
                        <td>strike</td>
                        <td>
                          {moment(execution.execDate)
                            .utc()
                            .format("MMM DD, YYYY")}
                        </td>
                        <td>{execution.positionSize}</td>
                        <td>${Math.round(execution.price * 100) / 100}</td>
                        <td>
                          ${Math.round(execution.commissions * 100) / 100}
                        </td>
                        <td>${Math.round(execution.fees * 100) / 100}</td>
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
