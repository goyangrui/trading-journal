import { useEffect } from "react";

import { useAppContext } from "../../context/appContext";

import { Loading, DashboardComponent } from "../../components";

function Dashboard() {
  // global state variables and functions
  const { getSubscriptions, hasSubscription, isLoading, clearAlert } =
    useAppContext();

  useEffect(() => {
    getSubscriptions();
    clearAlert();
  }, []);

  // if is loading
  if (isLoading) {
    return <Loading />;
  } else {
    // otherwise if the user has a subscription
    if (hasSubscription) {
      // return the main content
      return <DashboardComponent />;
    } else {
      return <h2>Need subscription to access</h2>;
    }
  }
}

export default Dashboard;
