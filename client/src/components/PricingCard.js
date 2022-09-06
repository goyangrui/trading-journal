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
        <div>Extract insights from your journaling</div>
        <div>Advanced features for trade reflection</div>
        <div>
          Advanced "find your edge" feature to help you discover what works for
          you, and what doesn't
        </div>

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
