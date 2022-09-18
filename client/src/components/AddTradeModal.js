import { useState, useEffect } from "react";

import { FaTimes } from "react-icons/fa";

import Wrapper from "../assets/wrappers/AddTradeModal";

import { FormRow, Alert } from ".";

import { useAppContext } from "../context/appContext";

// initially, the executions array will have 1 execution by default
const initialState = {
  market: "STOCK",
  symbol: "",
  executions: [
    {
      action: "BUY",
      execDate: new Date().toISOString().slice(0, 10),
      positionSize: 0,
      price: 0,
      commissions: 0,
      fees: 0,
      lotSize: 0,
      expDate: new Date().toISOString().slice(0, 10),
    },
  ],
};

function AddTradeModal({ toggleModal, setToggleModal }) {
  // global state variables and functions
  const { createTrade, showAlert, clearAlert } = useAppContext();

  // local state variables
  const [state, setState] = useState({ ...initialState });

  // useEffect for clearing alerts and resetting local state to initial state
  // use effect (clear alerts on initial render of this page)
  useEffect(() => {
    setState({ ...initialState });
    clearAlert();
  }, []);

  // close modal button handler
  const closeButtonHandler = (e) => {
    setToggleModal(!toggleModal);
  };

  // add trades form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    createTrade(state);
  };

  // on input change handler for market and symbol state variables
  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  // handler for any inputs to de-focus when scrolled (particularly for number inputs to prevent numbers from changing due to scroll)
  const handleScroll = (e) => {
    e.target.blur();
  };

  // on input change handler for execution inputs
  const handleExecutionChange = (e) => {
    // get the target id (e.g. action-0)
    const targetId = e.target.id;

    // get the index from the target id (number after '-')
    const executionsIndex = targetId.split("-")[1];

    // get the target name (target name corresponds to key in executions object)
    const targetName = e.target.name;

    // get the target value (target value for which the key will correspond to)
    const targetValue = e.target.value;

    // update the value of execution object at target name key at executionsIndex
    state.executions[executionsIndex][targetName] = targetValue;
    setState({ ...state });
  };

  // add execution form handler
  const addExecutionHandler = (e) => {
    // add a new execution object to the state executions array when the user clicks on the add execution button
    state.executions.push({
      action: "BUY",
      execDate: new Date().toISOString().slice(0, 10),
      positionSize: 0,
      price: 0,
      commissions: 0,
      fees: 0,
      lotSize: 0,
      expDate: new Date().toISOString().slice(0, 10),
    });
    setState({ ...state });
  };

  // remove execution form handler
  const removeExecutionHandler = (e) => {
    // get the event target id
    const targetId = e.target.id;

    // get the index of the target
    const executionsIndex = targetId.split("-")[2];

    // splice the executions array (remove execution object at executionsIndex)
    state.executions.splice(executionsIndex, 1);
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
          {/* Alert */}
          {showAlert && <Alert />}
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
                  {index !== 0 && (
                    <button
                      type="button"
                      className="btn"
                      id={`remove-button-${index}`}
                      onClick={removeExecutionHandler}
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Action (buy or sell) */}
                <FormRow
                  name="action"
                  id={`action-${index}`}
                  type="select"
                  handleChange={handleExecutionChange}
                  options={["BUY", "SELL"]}
                  value={state.executions[index]["action"]}
                />

                {/* Execution date */}
                <FormRow
                  name="execDate"
                  id={`execDate-${index}`}
                  labelText="execution date"
                  type="date"
                  handleChange={handleExecutionChange}
                  value={state.executions[index]["execDate"]}
                />

                {/* If the market is futures or options, have a form row input for expiration date as well */}
                {(state.market === "FUTURES" || state.market === "OPTIONS") && (
                  <FormRow
                    name="expDate"
                    id={`expDate-${index}`}
                    labelText="expiration date"
                    type="date"
                    handleChange={handleExecutionChange}
                    value={state.executions[index]["expDate"]}
                  />
                )}

                {/* Shares/contracts */}
                <FormRow
                  name="positionSize"
                  id={`positionSize-${index}`}
                  labelText="position size"
                  type="number"
                  min="0.001"
                  step="0.001"
                  handleChange={handleExecutionChange}
                  handleScroll={handleScroll}
                  value={state.executions[index]["positionSize"]}
                />

                {/* If the market is futures, have a form row input for lot size as well */}
                {state.market === "FUTURES" && (
                  <FormRow
                    name="lotSize"
                    id={`lotSize-${index}`}
                    labelText="lot size multiplier"
                    type="number"
                    min="0.001"
                    step="0.001"
                    handleChange={handleExecutionChange}
                    handleScroll={handleScroll}
                    value={state.executions[index]["lotSize"]}
                  />
                )}

                {/* Price */}
                <FormRow
                  name="price"
                  id={`price-${index}`}
                  type="number"
                  min="0.001"
                  step="0.001"
                  handleChange={handleExecutionChange}
                  handleScroll={handleScroll}
                  value={state.executions[index]["price"]}
                />

                {/* Commissions */}
                <FormRow
                  name="commissions"
                  id={`commissions-${index}`}
                  type="number"
                  min="0"
                  step="0.001"
                  handleChange={handleExecutionChange}
                  handleScroll={handleScroll}
                  value={state.executions[index]["commissions"]}
                />

                {/* Fees */}
                <FormRow
                  name="fees"
                  id={`fees-${index}`}
                  type="number"
                  min="0"
                  step="0.001"
                  handleChange={handleExecutionChange}
                  handleScroll={handleScroll}
                  value={state.executions[index]["fees"]}
                />
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
