import { useState, useEffect } from "react";

import { FaTimes } from "react-icons/fa";

import { IoIosArrowDropdownCircle } from "react-icons/io";
import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";

import Wrapper from "../assets/wrappers/AddTradeModal";

import { FormRow, Alert } from ".";

import { useAppContext } from "../context/appContext";

// initially, the executions array will have 1 execution by default
const initialState = {
  market: "STOCK",
  option: "CALL",
  strikePrice: 0,
  lotSize: 0,
  expDate: new Date().toISOString().slice(0, 10),
  symbol: "",
  executions: [
    {
      action: "BUY",
      execDate: new Date().toISOString().slice(0, 10),
      positionSize: 0,
      price: 0,
      commissions: 0,
      fees: 0,
    },
  ],
};

function AddTradeModal() {
  // global state variables and functions
  const {
    createTrade,
    showAlert,
    clearAlert,
    toggleMainModal,
    fetchTags,
    tags,
    selectedTags,
    setSelectedTags,
  } = useAppContext();

  // local state variables
  const [state, setState] = useState({ ...initialState });

  const [toggleDropdown, setToggleDropdown] = useState(false);

  // useEffect for resetting local state to initial state, and fetching tags
  useEffect(() => {
    setState({
      ...initialState,
      executions: [
        {
          action: "BUY",
          execDate: new Date().toISOString().slice(0, 10),
          positionSize: 0,
          price: 0,
          commissions: 0,
          fees: 0,
        },
      ],
    });

    // fetch tags from database
    fetchTags();
  }, []);

  // when global tags array has been changed (i.e. after they are fetched initially)
  useEffect(() => {
    // if there are any tags, loop through each tag, and set the selected tags to all false (i.e. none of the tags are selected by default)
    if (tags.length !== 0) {
      // map the tags array to a map of tag id's as the key, and false as the value
      const tagIdMap = new Map(
        tags.map((tag) => {
          return [tag._id, false];
        })
      );

      // convert the Map to an object
      const tagIdObject = Object.fromEntries(tagIdMap);

      // set the global selectedTags state
      setSelectedTags({ ...tagIdObject });
    }
  }, [tags]);

  // close modal button handler
  const closeButtonHandler = (e) => {
    toggleMainModal();
    clearAlert();
  };

  // tag options toggle handler
  const handleTagDropdown = () => {
    setToggleDropdown(!toggleDropdown);
  };

  // handle tag select
  const handleTagSelect = (tagId) => {
    // set id of selected tag to be the opposite state (true or false) of what it was originally
    setSelectedTags({
      ...selectedTags,
      [tagId]: !selectedTags[tagId],
    });
  };

  // add trades form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = async () => {
      // create trade, update global trades state, then toggle modal
      await createTrade(state, selectedTags);
    };

    submitData();
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

            {/* Option Contract Type */}
            {/* only show option contract type select input if the market type is options */}
            {state.market.toLowerCase() === "options" && (
              <FormRow
                name="option"
                labelText="option type"
                type="select"
                options={["CALL", "PUT"]}
                handleChange={handleChange}
                value={state.option}
              />
            )}

            {/* Option Strike Price */}
            {/* only show option contract strike price input if the market type is options */}
            {state.market.toLowerCase() === "options" && (
              <FormRow
                name="strikePrice"
                labelText="strike price"
                type="number"
                min="0.001"
                step="0.001"
                handleChange={handleChange}
                handleScroll={handleScroll}
                value={state.strikePrice}
              />
            )}

            {/* If the market is futures, have a form row input for lot size as well */}
            {state.market.toLowerCase() === "futures" && (
              <FormRow
                name="lotSize"
                labelText="lot size multiplier"
                type="number"
                min="0.001"
                step="0.001"
                handleChange={handleChange}
                handleScroll={handleScroll}
                value={state.lotSize}
              />
            )}

            {/* If the market is futures or options, have a form row input for expiration date as well */}
            {(state.market.toLowerCase() === "futures" ||
              state.market.toLowerCase() === "options") && (
              <FormRow
                name="expDate"
                labelText="expiration date"
                type="date"
                handleChange={handleChange}
                value={state.expDate}
              />
            )}

            {/* Tags */}
            {/* multi-select dropdown component */}
            <div className="multi-select-dropdown-container">
              <label className="form-label" htmlFor="multi-select-dropdown">
                Tags
              </label>
              <div
                className="multi-select-dropdown"
                onClick={handleTagDropdown}
              >
                {/* selected tags will appear in this */}
                {tags.map((tag) => {
                  if (selectedTags[tag._id]) {
                    return (
                      <div key={tag._id} className="selected-tag-item">
                        {tag.text}
                      </div>
                    );
                  }
                })}

                {/* dropdown icon */}
                <div className="dropdown-button-container">
                  <IoIosArrowDropdownCircle />
                </div>
              </div>
              {/* list of options */}
              {/* only show list of options if dropdown is toggled */}
              {toggleDropdown && (
                <ul className="tag-options-list">
                  {tags.map((tag) => {
                    return (
                      <li
                        id={tag._id}
                        key={tag._id}
                        className="tag-item"
                        onClick={(e) => {
                          handleTagSelect(tag._id);
                        }}
                      >
                        {/* if this tag has been selected, show the checked box, otherwise show the unchecked box */}
                        {selectedTags[tag._id] ? (
                          <ImCheckboxChecked />
                        ) : (
                          <ImCheckboxUnchecked />
                        )}
                        {tag.text}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
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
