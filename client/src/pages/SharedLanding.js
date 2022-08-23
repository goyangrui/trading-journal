import { Outlet } from "react-router-dom";

import { Navbar } from "../components";

function SharedLanding() {
  return (
    <>
      {/* fixed navbar */}
      <Navbar />

      {/* main landing page content */}
      <div className="landing-page">
        <Outlet />
      </div>

      {/* Add footer later on */}
    </>
  );
}

export default SharedLanding;
