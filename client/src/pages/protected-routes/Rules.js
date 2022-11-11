import { useEffect } from "react";

import { useAppContext } from "../../context/appContext";

import { Loading } from "../../components";

function Rules() {
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
      return <h1>Rules</h1>;
    } else {
      return <h2>Need subscription to access</h2>;
    }
  }
}

export default Rules;
