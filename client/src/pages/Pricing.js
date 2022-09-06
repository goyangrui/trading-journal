import { useEffect } from "react";

import { useAppContext } from "../context/appContext";

import Wrapper from "../assets/wrappers/Pricing";
import { PricingCard, Loading } from "../components";

function Pricing() {
  // global state variables
  const { isLoading, fetchProducts, products } = useAppContext();

  // fetch products on initial render to show products on pricing page
  useEffect(() => {
    fetchProducts();
  }, []);

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

        {isLoading ? (
          <div className="loading-container">
            <Loading />
          </div>
        ) : (
          // pricing card components based on products from stripe API
          products.map((product, index) => {
            return <PricingCard key={index} product={product} type="pricing" />;
          })
        )}

        {/* free pricing card */}
        {/* <div className="pricing-card">
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
        </div> */}
      </div>
    </Wrapper>
  );
}

export default Pricing;
