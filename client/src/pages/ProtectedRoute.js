import { Navigate, Outlet } from "react-router-dom";

import { useAppContext } from "../context/appContext";

// Protected route wrapper, to wrap all protected, nested content
function ProtectedRoute() {
  // get user from context
  const { user } = useAppContext();

  // if the user exists
  if (user) {
    // return the protected (nested) resource(s)
    return <Outlet />;
  }

  // otherwise if the user doesn't exist, return the user to the landing page
  return <Navigate to="/" />;
}

export default ProtectedRoute;
