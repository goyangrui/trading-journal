import { Link } from "react-router-dom";

import { useAppContext } from "../context/appContext";

import Wrapper from "../assets/wrappers/PricingCard";

function PricingCard({ product, type }) {
  // global state variables and functions
  const { createSession, isLoading } = useAppContext();

  // useNavigate hook

  // subscription pricing card button handler
  const handleClick = (e) => {
    // call global createSession function
    createSession(product.priceId);
  };

  return (
    <Wrapper>
      <div className="pricing-card">
        {/* Product name and price */}
        <div>
          <h2>{product.name}</h2>
          <p>${product.price / 100}/month</p>
        </div>

        {/* Product details */}
        <div>Detailed performance statistics</div>
        <div>Swiftly add trades to your journal</div>
        <div>Clean, dynamic view of your trades</div>
        <div>Add screenshots to your journals to gain insights</div>

        {/* conditional button */}
        {type === "pricing" ? (
          // if pricing card is on pricing page
          <div>
            <Link to="/register" className="btn btn-block">
              Try it free for 7 days
            </Link>
          </div>
        ) : (
          // otherwise if pricing card is on subscription page
          <div>
            <button
              className="btn btn-block"
              onClick={handleClick}
              disabled={isLoading}
            >
              Select Plan
            </button>
          </div>
        )}
      </div>
    </Wrapper>
  );
}

export default PricingCard;
