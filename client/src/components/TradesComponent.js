import Wrapper from "../assets/wrappers/TradesComponent";

import { TradesList } from ".";

function TradesComponent() {
  return (
    <Wrapper>
      {/* Button container with add trade, and delete trades buttons */}
      <div className="btn-container">
        {/* add trade button */}
        <div className="btn">Add Trade</div>

        {/* delete trades button */}
        <div className="btn btn-reverse">Delete Trades</div>
      </div>

      {/* Main list to show all trades */}
      <TradesList />
    </Wrapper>
  );
}

export default TradesComponent;
