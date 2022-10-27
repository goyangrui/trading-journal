import { useState } from "react";

import { FaTimes } from "react-icons/fa";

import { useAppContext } from "../context/appContext";

import { Alert, FormRow } from ".";

import Wrapper from "../assets/wrappers/AddJournalModal";

// initial state
const initialState = {
  date: "",
  notes: "",
};

function AddJournalModal() {
  // local state variables and functions
  const [state, setState] = useState(initialState);

  // global state variables and functions
  const {
    showAlert,
    createJournal,
    showMainModal,
    toggleMainModal,
    showTagModal,
    toggleTagModal,
  } = useAppContext();

  // handle modal close button
  const closeButtonHandler = () => {
    toggleMainModal();
  };

  // handle change for form inputs
  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  // handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = async () => {
      // create journal, update global journals state, then toggle modal
      await createJournal(state);
    };

    submitData();
  };

  return (
    <Wrapper>
      {/* modal content */}
      <div className="modal-content">
        {/* modal header */}
        <div className="modal-header">
          <h2>Add Journal Entry</h2>

          {/* close modal button */}
          <button
            type="button"
            className="modal-close-btn"
            onClick={closeButtonHandler}
          >
            <FaTimes />
          </button>
        </div>

        {/* modal form */}
        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Alert */}
          {showAlert && <Alert />}

          {/* Journal entry date */}
          <div className="journal-entry-date">
            <FormRow
              name="date"
              type="date"
              value={state.date}
              handleChange={handleChange}
            />
          </div>

          {/* Journal entry notes */}
          <div className="journal-entry-notes">
            <FormRow
              name="notes"
              type="text"
              value={state.notes}
              handleChange={handleChange}
            />
          </div>

          {/* submit button */}
          <div className="modal-btn-container">
            <button className="btn" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </Wrapper>
  );
}

export default AddJournalModal;
