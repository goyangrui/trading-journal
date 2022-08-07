import { Outlet } from "react-router-dom";

import { Navbar } from "../components";

function SharedLanding() {
  return (
    <>
      <Navbar />
      <Outlet />
      {/* Add footer later on */}
    </>
  );
}

export default SharedLanding;
