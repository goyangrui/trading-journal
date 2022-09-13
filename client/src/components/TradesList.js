import { useState, useEffect } from "react";

import { useAppContext } from "../context/appContext";

import { Loading } from ".";

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
        <h1>trades list</h1>
        <table>
          {/* table header row with names of metrics and other information*/}
          <thead>
            <tr></tr>
          </thead>
          {/* for each trade in trades global state variable array, display the trades and their relevant trade metrics information as a row in the table body */}
          <tbody>{/* TODO */}</tbody>
        </table>
      </Wrapper>
    );
  }
}

export default TradesList;
