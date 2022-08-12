import Wrapper from "../assets/wrappers/Pricing";

import { Link } from "react-router-dom";

function Pricing() {
  return (
    <Wrapper>
      <div className="container">
        {/* page section header */}
        <section className="section-header">
          <div className="title">
            <h2>Pricing</h2>
            <div className="title-underline"></div>
          </div>
          <h4>Take control of your trading</h4>
        </section>

        {/* free pricing card */}
        <div className="pricing-card">
          <div>
            <h2>Free Plan</h2>
            <p>$0.00/month</p>
          </div>
          <div>View basic performance statistics</div>
          <div>Simple and effective journaling</div>
          <div>Easily add and organize trades</div>
          <div>
            <Link to="/register" className="btn btn-block">
              Sign Up
            </Link>
          </div>
        </div>

        {/* premium pricing card */}
        <div className="pricing-card">
          <div>
            <h2>Premium Plan</h2>
            <p>$10.00/month</p>
          </div>
          <div>More detailed performance statistics</div>
          <div>Extract more insights from your journaling</div>
          <div>
            Unlock more advanced features for your trade reflection process
          </div>
          <div>
            Advanced "find your edge" feature to help you discover what works
            for you, and what doesn't
          </div>
          <div>
            <Link to="/register" className="btn btn-block">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default Pricing;
