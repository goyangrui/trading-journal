import { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";

import { useAppContext } from "../context/appContext";

// Protected route wrapper, to wrap all protected, nested content
function ProtectedRoute({ children }) {
  // get fetch function, and user state variable from global context
  const { token } = useAppContext();

  // useRef ensures that the fetch request is only sent once per render
  // const shouldFetch = useRef(true);

  // fetch the user on initial render of a protected route (sets the user and token global state variable)
  // useEffect(() => {
  //   if (shouldFetch.current) {
  //     shouldFetch.current = false;
  //     fetchUser();
  //   }
  // }, []);

  // if the token exists
  if (token) {
    // return the protected (nested) resource(s)
    return children;
  }

  // otherwise if the token doesn't exist, return the user to the landing page
  return <Navigate to="/" />;
}

export default ProtectedRoute;
