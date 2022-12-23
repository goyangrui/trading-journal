import { useState, useEffect } from "react";
import moment from "moment";

import { useAppContext } from "../context/appContext";

import { Loading } from ".";
import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";

import Wrapper from "../assets/wrappers/TradesList";

function TradesList() {
  // global state variables
  const {
    getTrades,
    trades,
    setSelectedTrades,
    selectedTrades,
    toggleEditTradeModal,
  } = useAppContext();

  // local state variables
  // local isLoading for trades list
  const [isLoading, setIsLoading] = useState(true);

  // local state variable for tracking if the 'check-all-box' has been checked or not
  const [allChecked, setAllChecked] = useState(false);

  // useEffect
  // on initial render, send get request to get trades from server. Set isLoading to false once getTrades proccess has been completed.
  useEffect(() => {
    const loadData = async () => {
      await getTrades();
      // set isLoading to false (to display the trades list)
      setIsLoading(false);
    };

    loadData();
  }, []);

  // once the trades global state variable has been changed, update global selectedTrades state accordingly (if trades array state is empty, do nothing, otherwise set the selected
  // trades state to all false by default)
  useEffect(() => {
    // if trades is NOT empty
    if (trades.length) {
      // map the trades object to a map of trading id's as the key, and false as the value
      const tradeIdMap = new Map(
        trades.map((trade) => {
          return [trade._id, false];
        })
      );

      // convert the Map to an object
      const tradeIdObject = Object.fromEntries(tradeIdMap);

      // set the global selectedTrades state
      setSelectedTrades({ ...tradeIdObject });
    }
    // otherwise do nothing
  }, [trades]);

  // whenever the global selectedTrades state changes, first check if the selectedTrades state is empty. If it's empty, do nothing, otherwise check if all of the values are true.
  // If not, set the allChecked to false, and if so, set allChecked to true
  useEffect(() => {
    // if global selectedTrades state is NOT empty
    if (Object.keys(selectedTrades).length) {
      // convert object of key value pairs to array of key value pairs
      const selectedTradesArr = Object.entries(selectedTrades);

      // use Array.prototype.every to check if the second index of every key value pair (the true or false value) is true
      const allTrue = selectedTradesArr.every((pair) => {
        return pair[1];
      });

      // if all values of the selectedTradesArr are true
      if (allTrue) {
        // set the state of allChecked to true
        setAllChecked(true);
      } else {
        // otherwise set the state of allChecked to false
        setAllChecked(false);
      }
    }
    // otherwise do nothing
  }, [selectedTrades]);

  // function for handling the checkbox which has been clicked
  const handleCheckboxClick = (e, tradeId) => {
    // if the checkbox that was clicked was the 'check-all-box' checkbox
    if (tradeId === "check-all-box") {
      // the new state is whatever the opposite of the current allChecked state is (i.e. if the checkbox is currently checked, set to to unchecked, and vice versa)
      const newState = !allChecked;

      // set allChecked to the new state
      setAllChecked(newState);

      // if the newState is true
      if (newState) {
        // set all of the check boxes to true
        Object.keys(selectedTrades).forEach((key) => {
          selectedTrades[key] = true;
        });
        setSelectedTrades({ ...selectedTrades });
      } else {
        // otherwise if newState is false
        // set all of the check boxes to false
        Object.keys(selectedTrades).forEach((key) => {
          selectedTrades[key] = false;
        });
        setSelectedTrades({ ...selectedTrades });
      }
    } else {
      // otherwise, if it was a normal checkbox box
      // set the selectedTrades state at clicked checkbox id to the opposite of what it previously was
      setSelectedTrades({
        ...selectedTrades,
        [tradeId]: !selectedTrades[tradeId],
      });
    }
  };

  // function for handling click of trade table row (to open edit trade modal)
  const handleTradeRowClick = (e, trade) => {
    console.log(e.target.tagName);
    // only toggle edit trade modal if the event target className is not 'check-box', and if it is not an SVG
    if (
      e.target.tagName !== "svg" &&
      e.target.tagName !== "path" &&
      e.target.className !== "check-box"
    ) {
      toggleEditTradeModal(trade);
    }
  };

  // if getTrades is still loading
  if (isLoading) {
    return (
      <div className="loading-container">
        <Loading />
      </div>
    );
  } else {
    // otherwise return the list of trades
    return (
      <Wrapper>
        <table className="trades-table">
          {/* table header row with names of metrics and other information*/}
          <thead>
            <tr>
              <th onClick={(e) => handleCheckboxClick(e, "check-all-box")}>
                {/* if the check all checkboxes checkbox is checked, display the checked checkbox svg */}
                {allChecked ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />}
              </th>
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
              <th>Tags</th>
            </tr>
          </thead>
          {/* for each trade in trades global state variable array, display the trades and their relevant trade metrics information as a row in the table body */}
          <tbody>
            {trades.map((trade) => {
              return (
                <tr
                  className="table-body-row"
                  key={trade._id}
                  onClick={(e) => {
                    handleTradeRowClick(e, trade);
                  }}
                >
                  <td
                    className="check-box"
                    onClick={(e) => handleCheckboxClick(e, trade._id)}
                  >
                    {/* if the state of the selectedTrade at tradeId is true (i.e. selected) */}
                    {selectedTrades[trade._id] ? (
                      // display the checked checkbox svg
                      <ImCheckboxChecked className="check-box" />
                    ) : (
                      // otherwise display the unchecked checkbox svg
                      <ImCheckboxUnchecked className="check-box" />
                    )}
                  </td>
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
                  <td>{moment(trade.openDate).utc().format("MMM DD, YYYY")}</td>
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
                  <td className="tag-cell">
                    {Object.entries(trade.tags).map((tag) => {
                      return (
                        <span key={tag[0]} className="label tag">
                          {tag[1]}
                        </span>
                      );
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!trades.length && <h5 className="no-trades">no trades</h5>}
      </Wrapper>
    );
  }
}

export default TradesList;
