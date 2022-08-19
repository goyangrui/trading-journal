import { Outlet, NavLink } from "react-router-dom";

function SharedMain() {
  return (
    <>
      <div className="links">
        <NavLink to="/app">Dashboard</NavLink>
        <NavLink to="/app/trades">Trades</NavLink>
        <NavLink to="/app/journal">Journal</NavLink>
        <NavLink to="/app/rules">Rules</NavLink>
        <NavLink to="/app/profile">Profile</NavLink>
      </div>
      <Outlet />
    </>
  );
}

export default SharedMain;
