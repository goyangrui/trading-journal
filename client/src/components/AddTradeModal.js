import { useState } from "react";

import { FaTimes } from "react-icons/fa";

import Wrapper from "../assets/wrappers/AddTradeModal";

import { FormRow } from ".";

// initially, the executions array will have 1 execution by default
const initialState = {
  market: "STOCK",
  symbol: "",
  executions: [
    {
      action: "BUY",
      execDate: undefined,
      positionSize: 0,
      price: 0,
      commissions: 0,
      fees: 0,
    },
  ],
};

function AddTradeModal({ toggleModal, setToggleModal }) {
  // local state variables
  const [state, setState] = useState(initialState);

  // close modal button handler
  const closeButtonHandler = (e) => {
    setToggleModal(!toggleModal);
  };

  // add trades form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit");
  };

  // on input change handler for market and symbol state variables
  const handleChange = (e) => {
    console.log(e);
    setState({ ...state, [e.target.name]: e.target.value });
  };

  // add execution form handler
  const addExecutionHandler = (e) => {
    // add a new execution object to the state executions array when the user clicks on the add execution button
    state.executions.push({
      action: "BUY",
      execDate: undefined,
      positionSize: 0,
      price: 0,
      commissions: 0,
      fees: 0,
    });
    setState({ ...state });
  };

  return (
    <Wrapper>
      {/* Modal content */}
      <div className="modal-content">
        {/* modal header */}
        <div className="modal-header">
          <h2>Add Trade</h2>

          {/* close modal button */}
          <button
            type="button"
            className="modal-close-btn"
            onClick={closeButtonHandler}
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Form */}
        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Basic trade information */}
          <div className="basic-trade-info">
            {/* Market */}
            <FormRow
              name="market"
              type="select"
              options={["STOCK", "OPTIONS", "FUTURES"]}
              handleChange={handleChange}
              value={state.market}
            />
            {/* Ticker symbol */}
            <FormRow
              name="symbol"
              type="text"
              handleChange={handleChange}
              value={state.symbol}
            />
          </div>

          {/* Executions */}
          {/* For each execution in the executions state array, return an execution form */}
          {state.executions.map((item, index) => {
            return (
              <div className="exec-info" key={index}>
                {/* execution header */}
                <div className="execution-header">
                  <h5>Execution {index + 1}</h5>

                  {/* every execution except the first one will have a remove button */}
                  {index !== 0 && <button className="btn">Remove</button>}
                </div>

                {/* Action (buy or sell) */}
                <FormRow
                  name="action"
                  type="select"
                  options={["BUY", "SELL"]}
                />

                {/* Execution date */}
                <FormRow
                  name="execDate"
                  labelText="execution date"
                  type="date"
                />

                {/* Shares/contracts */}
                <FormRow
                  name="positionSize"
                  labelText="position size"
                  type="number"
                  min="0.001"
                  step="0.001"
                />

                {/* If the market is futures, have a form row input for lot size as well */}
                {state.market === "FUTURES" && (
                  <FormRow
                    name="lotSize"
                    labelText="lot size multiplier"
                    type="number"
                    min="0.001"
                    step="0.001"
                  />
                )}

                {/* Price */}
                <FormRow name="price" type="number" min="0.001" step="0.001" />

                {/* Commissions */}
                <FormRow
                  name="commissions"
                  type="number"
                  min="0.001"
                  step="0.001"
                />

                {/* Fees */}
                <FormRow name="fees" type="number" min="0.001" step="0.001" />
              </div>
            );
          })}

          {/* button container */}
          <div className="modal-btn-container">
            {/* add execution button */}
            <button
              className="btn btn-reverse btn-block"
              type="button"
              onClick={addExecutionHandler}
            >
              Add Execution
            </button>
            {/* submit button */}
            <button className="btn btn-block" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </Wrapper>
  );
}

export default AddTradeModal;
