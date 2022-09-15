import { useState, useEffect } from "react";
import moment from "moment";

import { useAppContext } from "../context/appContext";

import { Loading } from ".";
import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";

import Wrapper from "../assets/wrappers/TradesList";

function TradesList() {
  // global state variables
  const { getTrades, trades } = useAppContext();

  // local state variables
  // local isLoading for trades list
  const [isLoading, setIsLoading] = useState(true);

  // useEffect
  // on initial render, send get request to get trades from server, and only set isLoading to false once getTrades has been fulfilled
  useEffect(() => {
    const loadData = async () => {
      await getTrades();
      setIsLoading(false);
    };

    loadData();
  }, []);

  // if getTrades is still loading
  if (isLoading) {
    return <Loading />;
  } else {
    // otherwise return the list of trades
    return (
      <Wrapper>
        <table className="trades-table">
          {/* table header row with names of metrics and other information*/}
          <thead>
            <tr>
              <th>
                <ImCheckboxUnchecked />
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
            </tr>
          </thead>
          {/* for each trade in trades global state variable array, display the trades and their relevant trade metrics information as a row in the table body */}
          <tbody>
            {trades.map((trade) => {
              return (
                <tr className="table-body-row" key={trade._id}>
                  <td>
                    <ImCheckboxUnchecked />
                  </td>
                  <td>{trade.status}</td>
                  <td>{moment(trade.openDate).format("MMM do, YYYY")}</td>
                  <td>{trade.market}</td>
                  <td>{trade.symbol}</td>
                  <td>${Math.round(trade.averageEntry * 100) / 100}</td>
                  <td>${Math.round(trade.averageExit * 100) / 100}</td>
                  <td>{Math.round(trade.positionSize * 100) / 100}</td>
                  <td>${Math.round(trade.dollarReturn * 100) / 100}</td>
                  <td>{Math.round(trade.percentReturn * 100) / 100}%</td>
                  <td>${Math.round(trade.netReturn * 100) / 100}</td>
                  <td>{trade.side}</td>
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
