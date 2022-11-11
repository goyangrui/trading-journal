import { useEffect } from "react";

import { useAppContext } from "../../context/appContext";

import { Loading, TradesComponent } from "../../components";

function Trades() {
  // global state variables and functions
  const { getSubscriptions, hasSubscription, isLoading } = useAppContext();

  // on initial render, getSubscriptions
  useEffect(() => {
    getSubscriptions();
  }, []);

  // if is loading
  if (isLoading) {
    return <Loading />;
  } else {
    // otherwise if the user has a subscription
    if (hasSubscription) {
      // return the main TradesComponent
      return <TradesComponent />;
    } else {
      return <h2>Need subscription to access</h2>;
    }
  }
}

export default Trades;
