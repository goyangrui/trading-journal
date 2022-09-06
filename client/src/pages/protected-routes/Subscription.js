import { useEffect, useState } from "react";

import { useAppContext } from "../../context/appContext";

import Wrapper from "../../assets/wrappers/Subscription";
import { PricingCard, Loading, Alert } from "../../components";

function Subscription() {
  // global context variables
  const { getSubscriptions, fetchProducts, products, showAlert, clearAlert } =
    useAppContext();

  // local state variables
  const [isLoading, setIsLoading] = useState(true);

  // useEffect to clear any alerts, fetch products on initial render and fetch user as well
  useEffect(() => {
    clearAlert();

    const load = async () => {
      // get subscriptions and fetch the user and products
      await getSubscriptions();
      await fetchProducts();

      // only once both requests have been completed, set local isLoading to false
      setIsLoading(false);
    };

    load();
  }, []);

  // if isLoading
  if (isLoading) {
    return <Loading />;
  } else {
    // otherwise, return the main content
    return (
      <Wrapper>
        <div className="container">
          {/* alert component */}
          {showAlert && <Alert />}

          {products.map((product, index) => {
            return <PricingCard key={index} product={product} />;
          })}
        </div>
      </Wrapper>
    );
  }
}

export default Subscription;
