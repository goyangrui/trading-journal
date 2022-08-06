// react router dom
import { Outlet } from "react-router-dom";

// components
import { Navbar } from "../components";

function SharedLanding() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default SharedLanding;
