import { useEffect } from "react";
import { useLocation } from "react-router";

// Wrapper component which scrolls to the top of the page when location changes
function ScrollToTop({ children }) {
  // on render, get the location
  const location = useLocation();

  // if on initial render, the location has changed, scroll to the top of the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return <>{children}</>;
}

export default ScrollToTop;
