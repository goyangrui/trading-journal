import { useEffect } from "react";

import { useAppContext } from "../../context/appContext";

import { Loading } from "../../components";

function Journal() {
  // global state variables and functions
  const { getSubscriptions, hasSubscription, isLoading } = useAppContext();

  useEffect(() => {
    getSubscriptions();
  }, []);

  // if is loading
  if (isLoading) {
    return <Loading />;
  } else {
    // otherwise if the user has a subscription
    if (hasSubscription) {
      // return the main content
      return <h1>Journal</h1>;
    } else {
      return <h1>Need subscription to access</h1>;
    }
  }
}

export default Journal;
